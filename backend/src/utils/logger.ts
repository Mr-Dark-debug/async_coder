import winston from 'winston';
import path from 'path';

// Define log levels
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define log colors
const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Add colors to winston
winston.addColors(logColors);

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => {
    const { timestamp, level, message, ...meta } = info;
    const metaString = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return `${timestamp} [${level}]: ${message} ${metaString}`;
  })
);

// Define file format (without colors)
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Create transports
const transports: winston.transport[] = [
  // Console transport
  new winston.transports.Console({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
  }),
];

// Add file transports in production
if (process.env.NODE_ENV === 'production') {
  // Ensure logs directory exists
  const logsDir = path.join(process.cwd(), 'logs');
  
  transports.push(
    // Error log file
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      format: fileFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    
    // Combined log file
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      format: fileFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );
}

// Create logger instance
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels: logLevels,
  format: fileFormat,
  transports,
  exitOnError: false,
});

// Create a stream object for Morgan HTTP logging
export const loggerStream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

// Helper functions for structured logging
export class Logger {
  static info(message: string, meta?: any) {
    logger.info(message, meta);
  }

  static error(message: string, error?: Error | any, meta?: any) {
    const errorMeta = error instanceof Error 
      ? { 
          message: error.message, 
          stack: error.stack, 
          name: error.name,
          ...meta 
        }
      : { error, ...meta };
    
    logger.error(message, errorMeta);
  }

  static warn(message: string, meta?: any) {
    logger.warn(message, meta);
  }

  static debug(message: string, meta?: any) {
    logger.debug(message, meta);
  }

  static http(message: string, meta?: any) {
    logger.http(message, meta);
  }

  // Specific logging methods for different components
  static database(message: string, meta?: any) {
    logger.info(`[DATABASE] ${message}`, meta);
  }

  static auth(message: string, meta?: any) {
    logger.info(`[AUTH] ${message}`, meta);
  }

  static api(message: string, meta?: any) {
    logger.info(`[API] ${message}`, meta);
  }

  static task(message: string, meta?: any) {
    logger.info(`[TASK] ${message}`, meta);
  }

  static github(message: string, meta?: any) {
    logger.info(`[GITHUB] ${message}`, meta);
  }

  static ai(message: string, meta?: any) {
    logger.info(`[AI] ${message}`, meta);
  }

  static webhook(message: string, meta?: any) {
    logger.info(`[WEBHOOK] ${message}`, meta);
  }

  static security(message: string, meta?: any) {
    logger.warn(`[SECURITY] ${message}`, meta);
  }

  static performance(message: string, meta?: any) {
    logger.info(`[PERFORMANCE] ${message}`, meta);
  }

  // Request logging helper
  static request(req: any, res?: any, meta?: any) {
    const requestMeta = {
      method: req.method,
      url: req.url,
      userAgent: req.headers?.['user-agent'],
      ip: req.ip || req.connection?.remoteAddress,
      userId: req.user?.id,
      ...meta,
    };

    if (res) {
      requestMeta.statusCode = res.statusCode;
      requestMeta.responseTime = res.responseTime;
    }

    logger.http('HTTP Request', requestMeta);
  }

  // Error logging with context
  static errorWithContext(
    message: string, 
    error: Error, 
    context: Record<string, any> = {}
  ) {
    logger.error(message, {
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name,
      },
      context,
      timestamp: new Date().toISOString(),
    });
  }

  // Audit logging for sensitive operations
  static audit(action: string, userId: string, meta?: any) {
    logger.info(`[AUDIT] ${action}`, {
      userId,
      timestamp: new Date().toISOString(),
      ...meta,
    });
  }

  // Business metrics logging
  static metric(name: string, value: number, unit?: string, meta?: any) {
    logger.info(`[METRIC] ${name}`, {
      value,
      unit,
      timestamp: new Date().toISOString(),
      ...meta,
    });
  }
}

// Export default logger for backward compatibility
export default logger;

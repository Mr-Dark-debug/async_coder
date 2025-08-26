import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { db } from '@/config/database';
import { pullRequests, tasks } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { webhookRateLimit } from '@/middleware/rate-limit';
import { GitHubService } from '@/utils/github';
import { logger } from '@/utils/logger';
import type { GitHubWebhookPayload } from '@/types';

export default async function webhookRoutes(fastify: FastifyInstance) {
  // GitHub webhook handler
  fastify.post('/github', {
    preHandler: [webhookRateLimit],
    schema: {
      headers: {
        type: 'object',
        required: ['x-github-event', 'x-hub-signature-256'],
        properties: {
          'x-github-event': { type: 'string' },
          'x-hub-signature-256': { type: 'string' },
          'x-github-delivery': { type: 'string' },
        },
      },
    },
  }, async (request: FastifyRequest<{
    Headers: {
      'x-github-event': string;
      'x-hub-signature-256': string;
      'x-github-delivery'?: string;
    };
    Body: any;
  }>, reply: FastifyReply) => {
    try {
      const event = request.headers['x-github-event'];
      const signature = request.headers['x-hub-signature-256'];
      const delivery = request.headers['x-github-delivery'];
      const payload = JSON.stringify(request.body);

      // Verify webhook signature
      const isValid = GitHubService.verifyWebhookSignature(payload, signature);
      
      if (!isValid) {
        logger.security('Invalid GitHub webhook signature', {
          event,
          delivery,
          ip: request.ip,
        });

        return reply.status(401).send({
          success: false,
          error: {
            code: 'INVALID_SIGNATURE',
            message: 'Invalid webhook signature',
          },
        });
      }

      logger.webhook('GitHub webhook received', {
        event,
        delivery,
        repository: request.body.repository?.full_name,
      });

      // Process webhook based on event type
      switch (event) {
        case 'pull_request':
          await handlePullRequestEvent(request.body);
          break;
        
        case 'push':
          await handlePushEvent(request.body);
          break;
        
        case 'repository':
          await handleRepositoryEvent(request.body);
          break;
        
        case 'ping':
          logger.webhook('GitHub webhook ping received', { delivery });
          break;
        
        default:
          logger.debug('Unhandled GitHub webhook event', { event, delivery });
      }

      return reply.send({
        success: true,
        data: {
          message: 'Webhook processed successfully',
          event,
          delivery,
        },
      });
    } catch (error) {
      logger.error('GitHub webhook processing failed:', error);
      return reply.status(500).send({
        success: false,
        error: {
          code: 'WEBHOOK_PROCESSING_FAILED',
          message: 'Webhook processing failed',
        },
      });
    }
  });

  // Stripe webhook handler (for payments)
  fastify.post('/stripe', {
    preHandler: [webhookRateLimit],
    schema: {
      headers: {
        type: 'object',
        required: ['stripe-signature'],
        properties: {
          'stripe-signature': { type: 'string' },
        },
      },
    },
  }, async (request: FastifyRequest<{
    Headers: {
      'stripe-signature': string;
    };
    Body: any;
  }>, reply: FastifyReply) => {
    try {
      const signature = request.headers['stripe-signature'];
      const payload = JSON.stringify(request.body);

      // Verify Stripe webhook signature
      const stripe = await import('stripe');
      const stripeClient = new stripe.default(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2023-10-16',
      });

      let event;
      try {
        event = stripeClient.webhooks.constructEvent(
          payload,
          signature,
          process.env.STRIPE_WEBHOOK_SECRET!
        );
      } catch (error) {
        logger.security('Invalid Stripe webhook signature', {
          error: error.message,
          ip: request.ip,
        });

        return reply.status(400).send({
          success: false,
          error: {
            code: 'INVALID_STRIPE_SIGNATURE',
            message: 'Invalid webhook signature',
          },
        });
      }

      logger.webhook('Stripe webhook received', {
        type: event.type,
        id: event.id,
      });

      // Process Stripe webhook
      switch (event.type) {
        case 'payment_intent.succeeded':
          await handlePaymentSucceeded(event.data.object);
          break;
        
        case 'payment_intent.payment_failed':
          await handlePaymentFailed(event.data.object);
          break;
        
        case 'customer.subscription.created':
          await handleSubscriptionCreated(event.data.object);
          break;
        
        case 'customer.subscription.updated':
          await handleSubscriptionUpdated(event.data.object);
          break;
        
        case 'customer.subscription.deleted':
          await handleSubscriptionDeleted(event.data.object);
          break;
        
        case 'invoice.payment_succeeded':
          await handleInvoicePaymentSucceeded(event.data.object);
          break;
        
        default:
          logger.debug('Unhandled Stripe webhook event', { type: event.type });
      }

      return reply.send({
        success: true,
        data: {
          message: 'Stripe webhook processed successfully',
          type: event.type,
          id: event.id,
        },
      });
    } catch (error) {
      logger.error('Stripe webhook processing failed:', error);
      return reply.status(500).send({
        success: false,
        error: {
          code: 'STRIPE_WEBHOOK_FAILED',
          message: 'Stripe webhook processing failed',
        },
      });
    }
  });
}

// GitHub webhook handlers
async function handlePullRequestEvent(payload: GitHubWebhookPayload): Promise<void> {
  try {
    const { action, pull_request, repository } = payload;
    
    if (!pull_request) return;

    // Find existing PR record
    const existingPR = await db.query.pullRequests.findFirst({
      where: eq(pullRequests.githubPrId, pull_request.id),
    });

    if (!existingPR) {
      logger.debug('PR not found in database, skipping webhook', {
        prId: pull_request.id,
        prNumber: pull_request.number,
      });
      return;
    }

    // Update PR status based on action
    let status: string = existingPR.status;
    let updatedAt = new Date();
    let mergedAt = existingPR.mergedAt;
    let closedAt = existingPR.closedAt;

    switch (action) {
      case 'opened':
        status = 'open';
        break;
      case 'closed':
        if (pull_request.merged) {
          status = 'merged';
          mergedAt = new Date();
        } else {
          status = 'closed';
          closedAt = new Date();
        }
        break;
      case 'reopened':
        status = 'open';
        closedAt = null;
        break;
      case 'converted_to_draft':
        status = 'draft';
        break;
      case 'ready_for_review':
        status = 'open';
        break;
    }

    // Update PR in database
    await db
      .update(pullRequests)
      .set({
        status: status as any,
        title: pull_request.title,
        description: pull_request.body || null,
        mergedAt,
        closedAt,
        updatedAt,
      })
      .where(eq(pullRequests.id, existingPR.id));

    // Update related task if PR is merged or closed
    if (existingPR.taskId && (status === 'merged' || status === 'closed')) {
      await db
        .update(tasks)
        .set({
          status: status === 'merged' ? 'completed' : 'failed',
          completedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(tasks.id, existingPR.taskId));
    }

    logger.webhook('Pull request updated', {
      prId: pull_request.id,
      prNumber: pull_request.number,
      action,
      status,
      taskId: existingPR.taskId,
    });
  } catch (error) {
    logger.error('Failed to handle pull request webhook:', error);
  }
}

async function handlePushEvent(payload: any): Promise<void> {
  try {
    const { repository, ref, commits } = payload;
    
    logger.webhook('Push event received', {
      repository: repository.full_name,
      ref,
      commitsCount: commits?.length || 0,
    });

    // Handle push events if needed
    // For example, trigger re-analysis of code or update repository metadata
  } catch (error) {
    logger.error('Failed to handle push webhook:', error);
  }
}

async function handleRepositoryEvent(payload: any): Promise<void> {
  try {
    const { action, repository } = payload;
    
    logger.webhook('Repository event received', {
      repository: repository.full_name,
      action,
    });

    // Handle repository events like deletion, archival, etc.
    if (action === 'deleted') {
      // Mark repository as inactive
      const { repositories } = await import('@/db/schema');
      await db
        .update(repositories)
        .set({
          isActive: false,
          updatedAt: new Date(),
        })
        .where(eq(repositories.githubId, repository.id));
    }
  } catch (error) {
    logger.error('Failed to handle repository webhook:', error);
  }
}

// Stripe webhook handlers
async function handlePaymentSucceeded(paymentIntent: any): Promise<void> {
  try {
    logger.webhook('Payment succeeded', {
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
    });

    // Handle successful payment
    // Update credit purchase status, add credits to user account, etc.
  } catch (error) {
    logger.error('Failed to handle payment succeeded webhook:', error);
  }
}

async function handlePaymentFailed(paymentIntent: any): Promise<void> {
  try {
    logger.webhook('Payment failed', {
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
    });

    // Handle failed payment
    // Update credit purchase status, notify user, etc.
  } catch (error) {
    logger.error('Failed to handle payment failed webhook:', error);
  }
}

async function handleSubscriptionCreated(subscription: any): Promise<void> {
  try {
    logger.webhook('Subscription created', {
      subscriptionId: subscription.id,
      customerId: subscription.customer,
      status: subscription.status,
    });

    // Handle new subscription
    // Create subscription record, update user tier, etc.
  } catch (error) {
    logger.error('Failed to handle subscription created webhook:', error);
  }
}

async function handleSubscriptionUpdated(subscription: any): Promise<void> {
  try {
    logger.webhook('Subscription updated', {
      subscriptionId: subscription.id,
      customerId: subscription.customer,
      status: subscription.status,
    });

    // Handle subscription update
    // Update subscription status, user tier, etc.
  } catch (error) {
    logger.error('Failed to handle subscription updated webhook:', error);
  }
}

async function handleSubscriptionDeleted(subscription: any): Promise<void> {
  try {
    logger.webhook('Subscription deleted', {
      subscriptionId: subscription.id,
      customerId: subscription.customer,
    });

    // Handle subscription cancellation
    // Update user tier to free, etc.
  } catch (error) {
    logger.error('Failed to handle subscription deleted webhook:', error);
  }
}

async function handleInvoicePaymentSucceeded(invoice: any): Promise<void> {
  try {
    logger.webhook('Invoice payment succeeded', {
      invoiceId: invoice.id,
      subscriptionId: invoice.subscription,
      amount: invoice.amount_paid,
    });

    // Handle successful invoice payment
    // Update subscription status, add credits, etc.
  } catch (error) {
    logger.error('Failed to handle invoice payment succeeded webhook:', error);
  }
}

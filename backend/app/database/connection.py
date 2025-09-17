"""
Database connection and configuration module for Supabase integration.
"""

import os
from typing import Optional, Dict, Any
from supabase import create_client, Client
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

class DatabaseConnection:
    """Manages Supabase database connection and operations."""
    
    _instance: Optional['DatabaseConnection'] = None
    _client: Optional[Client] = None
    
    def __new__(cls) -> 'DatabaseConnection':
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        if not hasattr(self, '_initialized'):
            self._initialized = True
            self._setup_connection()
    
    def _setup_connection(self) -> None:
        """Initialize Supabase client connection."""
        try:
            url = os.getenv('DATABASE_URL')
            key = os.getenv('SUPABASE_PUBLIC_KEY')
            
            if not url or not key:
                raise ValueError("Missing required environment variables: DATABASE_URL or SUPABASE_PUBLIC_KEY")
            
            self._client = create_client(url, key)
            logger.info("Successfully connected to Supabase database")
            
        except Exception as e:
            logger.error(f"Failed to connect to database: {e}")
            raise
    
    @property
    def client(self) -> Client:
        """Get the Supabase client instance."""
        if self._client is None:
            self._setup_connection()
        return self._client
    
    def test_connection(self) -> bool:
        """Test database connection."""
        try:
            # Simple query to test connection
            result = self.client.table('users').select('id').limit(1).execute()
            return True
        except Exception as e:
            logger.error(f"Database connection test failed: {e}")
            return False
    
    def execute_query(self, table: str, operation: str, data: Optional[Dict[str, Any]] = None, 
                     filters: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Execute database operations.
        
        Args:
            table: Table name
            operation: Operation type ('select', 'insert', 'update', 'delete')
            data: Data for insert/update operations
            filters: Filters for select/update/delete operations
            
        Returns:
            Query result
        """
        try:
            query = self.client.table(table)
            
            if operation == 'select':
                if filters:
                    for key, value in filters.items():
                        query = query.eq(key, value)
                result = query.execute()
                
            elif operation == 'insert':
                if not data:
                    raise ValueError("Data required for insert operation")
                result = query.insert(data).execute()
                
            elif operation == 'update':
                if not data:
                    raise ValueError("Data required for update operation")
                if filters:
                    for key, value in filters.items():
                        query = query.eq(key, value)
                result = query.update(data).execute()
                
            elif operation == 'delete':
                if filters:
                    for key, value in filters.items():
                        query = query.eq(key, value)
                result = query.delete().execute()
                
            else:
                raise ValueError(f"Unsupported operation: {operation}")
            
            return result
            
        except Exception as e:
            logger.error(f"Database operation failed: {e}")
            raise

# Global database instance
db = DatabaseConnection()

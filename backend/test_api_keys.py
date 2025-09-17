#!/usr/bin/env python3
"""
Test script for API key management system.
"""

import os
import sys
import asyncio
import requests
import json
from typing import Dict, Any

# Add the app directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

def test_api_key_validation():
    """Test API key validation for different providers."""
    print("Testing API key validation...")
    
    test_cases = [
        {
            'provider': 'openai',
            'valid_key': 'sk-' + 'a' * 48,
            'invalid_key': 'invalid-key'
        },
        {
            'provider': 'claude',
            'valid_key': 'sk-ant-' + 'a' * 95,
            'invalid_key': 'sk-ant-short'
        },
        {
            'provider': 'gemini',
            'valid_key': 'AIza' + 'a' * 35,
            'invalid_key': 'AIza-short'
        },
        {
            'provider': 'qwen',
            'valid_key': 'sk-' + 'a' * 32,
            'invalid_key': 'qw-invalid'
        },
        {
            'provider': 'deepseek',
            'valid_key': 'sk-' + 'a' * 40,
            'invalid_key': 'ds-invalid'
        },
        {
            'provider': 'openrouter',
            'valid_key': 'sk-or-v1-' + 'a' * 64,
            'invalid_key': 'sk-or-invalid'
        }
    ]
    
    from services.api_key_validator import APIKeyValidationService
    
    for test_case in test_cases:
        provider = test_case['provider']
        
        # Test valid format
        is_valid = APIKeyValidationService.validate_key_format(provider, test_case['valid_key'])
        print(f"✓ {provider} valid format: {is_valid}")
        assert is_valid, f"Valid key format test failed for {provider}"
        
        # Test invalid format
        is_invalid = APIKeyValidationService.validate_key_format(provider, test_case['invalid_key'])
        print(f"✓ {provider} invalid format: {not is_invalid}")
        assert not is_invalid, f"Invalid key format test failed for {provider}"
    
    print("All API key validation tests passed!")

def test_database_connection():
    """Test database connection."""
    print("Testing database connection...")
    
    try:
        from database.connection import db
        
        # Test connection
        is_connected = db.test_connection()
        print(f"✓ Database connection: {is_connected}")
        
        if not is_connected:
            print("⚠️  Database connection failed. Make sure Supabase credentials are set.")
            return False
            
        return True
        
    except Exception as e:
        print(f"✗ Database connection error: {e}")
        return False

def test_api_endpoints():
    """Test API endpoints (requires running server)."""
    print("Testing API endpoints...")
    
    base_url = "http://localhost:8000/api/v1"
    
    try:
        # Test providers endpoint
        response = requests.get(f"{base_url}/api-keys/providers", timeout=5)
        if response.status_code == 200:
            providers = response.json()
            print(f"✓ Providers endpoint: {len(providers)} providers found")
        else:
            print(f"✗ Providers endpoint failed: {response.status_code}")
            
        # Test API key test endpoint
        test_data = {
            "provider": "openai",
            "keyValue": "sk-invalid-test-key"
        }
        
        response = requests.post(
            f"{base_url}/api-keys/test",
            json=test_data,
            timeout=10
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"✓ API key test endpoint: {result}")
        else:
            print(f"✗ API key test endpoint failed: {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print("⚠️  API server not running. Start with: uvicorn main:app --reload")
    except Exception as e:
        print(f"✗ API endpoint test error: {e}")

def main():
    """Run all tests."""
    print("🚀 Starting API Key Management System Tests\n")
    
    # Test 1: API key validation
    try:
        test_api_key_validation()
        print()
    except Exception as e:
        print(f"✗ API key validation test failed: {e}\n")
    
    # Test 2: Database connection
    try:
        db_connected = test_database_connection()
        print()
    except Exception as e:
        print(f"✗ Database connection test failed: {e}\n")
    
    # Test 3: API endpoints (optional)
    try:
        test_api_endpoints()
        print()
    except Exception as e:
        print(f"✗ API endpoint test failed: {e}\n")
    
    print("🎉 Test suite completed!")
    print("\nNext steps:")
    print("1. Start the backend server: cd backend && python -m uvicorn main:app --reload")
    print("2. Start the frontend: npm run dev")
    print("3. Visit http://localhost:3000/settings to test the UI")

if __name__ == "__main__":
    main()

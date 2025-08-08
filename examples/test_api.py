#!/usr/bin/env python3
"""
Test script for Ollama OpenAI API Server
"""

import requests
import json
import time

API_URL = 'http://localhost:3000/v1/chat/completions'
API_KEY = 'dummy-key'

def test_health_check():
    """Test the health check endpoint"""
    try:
        print("🏥 Testing health check...")
        
        response = requests.get('http://localhost:3000/health', timeout=10)
        response.raise_for_status()
        
        print("✅ Health check passed:", response.json())
        return True
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Health check failed: {e}")
        return False

def test_chat_completion():
    """Test the chat completion endpoint"""
    try:
        print("\n🤖 Testing Ollama OpenAI API Server...")
        
        payload = {
            "model": "jinbora/deepseek-r1-Bllossom:8b",
            "messages": [
                {
                    "role": "user",
                    "content": "Hello! What is the capital of France?"
                }
            ],
            "temperature": 0.7,
            "max_tokens": 1000
        }
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {API_KEY}"
        }
        
        response = requests.post(
            API_URL,
            json=payload,
            headers=headers,
            timeout=120
        )
        response.raise_for_status()
        
        data = response.json()
        print("✅ Success!")
        print("Response:", json.dumps(data, indent=2))
        
        message = data['choices'][0]['message']['content']
        print(f"\n📝 AI Response: {message}")
        
        return True
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Error: {e}")
        
        if hasattr(e, 'response') and e.response is not None:
            print(f"Response Status: {e.response.status_code}")
            try:
                print(f"Response Data: {e.response.json()}")
            except:
                print(f"Response Text: {e.response.text}")
        
        return False

def test_direct_ollama():
    """Test the direct Ollama endpoint"""
    try:
        print("\n🔧 Testing direct Ollama endpoint...")
        
        payload = {
            "model": "jinbora/deepseek-r1-Bllossom:8b",
            "prompt": "What is 2 + 2?",
            "temperature": 0.7
        }
        
        response = requests.post(
            'http://localhost:3000/api/generate',
            json=payload,
            timeout=120
        )
        response.raise_for_status()
        
        data = response.json()
        print("✅ Direct Ollama test passed!")
        print("Response:", json.dumps(data, indent=2))
        
        return True
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Direct Ollama test failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Starting API tests...\n")
    
    # Test health check
    health_ok = test_health_check()
    
    print("\n" + "="*50 + "\n")
    
    # Test chat completion
    chat_ok = test_chat_completion()
    
    print("\n" + "="*50 + "\n")
    
    # Test direct Ollama
    direct_ok = test_direct_ollama()
    
    # Summary
    print("\n" + "="*50)
    print("📊 Test Summary:")
    print(f"Health Check: {'✅ PASS' if health_ok else '❌ FAIL'}")
    print(f"Chat Completion: {'✅ PASS' if chat_ok else '❌ FAIL'}")
    print(f"Direct Ollama: {'✅ PASS' if direct_ok else '❌ FAIL'}")
    
    if all([health_ok, chat_ok, direct_ok]):
        print("\n🎉 All tests passed!")
    else:
        print("\n⚠️  Some tests failed. Check the output above.")

if __name__ == "__main__":
    main() 
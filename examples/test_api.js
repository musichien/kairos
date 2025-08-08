// Test script for Ollama OpenAI API Server
const axios = require('axios');

const API_URL = 'http://localhost:3000/v1/chat/completions';
const API_KEY = 'dummy-key';

async function testChatCompletion() {
  try {
    console.log('🤖 Testing Ollama OpenAI API Server...\n');

    const response = await axios.post(API_URL, {
      model: 'jinbora/deepseek-r1-Bllossom:8b',
      messages: [
        {
          role: 'user',
          content: 'Hello! What is the capital of France?'
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      timeout: 120000
    });

    console.log('✅ Success!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    const message = response.data.choices[0].message.content;
    console.log('\n📝 AI Response:', message);

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', error.response.data);
    }
  }
}

async function testHealthCheck() {
  try {
    console.log('🏥 Testing health check...');
    
    const response = await axios.get('http://localhost:3000/health');
    console.log('✅ Health check passed:', response.data);
    
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting API tests...\n');
  
  await testHealthCheck();
  console.log('\n' + '='.repeat(50) + '\n');
  
  await testChatCompletion();
}

runTests(); 
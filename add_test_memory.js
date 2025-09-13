/**
 * 테스트용 메모리 추가 스크립트
 */

const axios = require('axios');

async function addTestMemories() {
  const baseURL = 'http://localhost:3000';
  const headers = { 'X-Bypass-Auth': 'true' };

  console.log('🧠 Starting test memory addition...\n');

  try {
    // 1. Add fact (anonymized sample data for global platform)
    console.log('1. Adding fact');
    await axios.post(`${baseURL}/api/memory/user_001/facts`, {
      fact: 'User is learning programming',
      category: 'learning'
    }, { headers });
    console.log('✅ Fact added');

    // 2. Add preference (anonymized sample data for global platform)
    console.log('2. Adding preference');
    await axios.post(`${baseURL}/api/memory/user_001/preferences`, {
      preference: 'Music Genre',
      value: 'Classical'
    }, { headers });
    console.log('✅ Preference added');

    // 3. Add long-term memory (anonymized sample data for global platform)
    console.log('3. Adding long-term memory');
    await axios.post(`${baseURL}/api/memory/user_001/longterm`, {
      memory: 'User prefers working in the morning',
      category: 'work_preference',
      importance: 'high'
    }, { headers });
    console.log('✅ Long-term memory added');

    // 4. Add interest (anonymized sample data for global platform)
    console.log('4. Adding interest');
    await axios.post(`${baseURL}/api/memory/user_001/interests`, {
      interest: 'Reading',
      category: 'hobby'
    }, { headers });
    console.log('✅ Interest added');

    console.log('\n🎉 All test memories have been added!');
    console.log('Now test chatting at http://localhost:3000');

  } catch (error) {
    console.error('❌ Memory addition failed:', error.response?.data || error.message);
  }
}

// Execute memory addition
addTestMemories();

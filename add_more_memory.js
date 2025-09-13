/**
 * 더 많은 테스트용 메모리 추가
 */

const axios = require('axios');

async function addMoreMemories() {
  const baseURL = 'http://localhost:3000';
  const headers = { 'X-Bypass-Auth': 'true' };

  console.log('🧠 Generating additional memories...\n');

  const memories = [
    { type: 'fact', content: 'User prefers working in the morning', category: 'work_preference' },
    { type: 'fact', content: 'User is learning programming', category: 'learning' },
    { type: 'fact', content: 'User enjoys reading', category: 'hobby' },
    { type: 'preference', preference: 'Music Genre', value: 'Classical' },
    { type: 'preference', preference: 'Coffee Type', value: 'Espresso' },
    { type: 'preference', preference: 'Work Time', value: 'Morning' },
    { type: 'longterm', memory: 'User enjoys creative projects', category: 'personality', importance: 'high' },
    { type: 'longterm', memory: 'User likes learning new technologies', category: 'learning', importance: 'medium' },
    { type: 'longterm', memory: 'User values teamwork', category: 'work_style', importance: 'high' }
  ];

  try {
    for (let i = 0; i < memories.length; i++) {
      const mem = memories[i];
      
      try {
        if (mem.type === 'fact') {
          await axios.post(`${baseURL}/api/memory/user_001/facts`, {
            fact: mem.content,
            category: mem.category
          }, { headers });
          console.log(`✅ Fact added: ${mem.content.substring(0, 30)}...`);
        } else if (mem.type === 'preference') {
          await axios.post(`${baseURL}/api/memory/user_001/preferences`, {
            preference: mem.preference,
            value: mem.value
          }, { headers });
          console.log(`✅ Preference added: ${mem.preference} = ${mem.value}`);
        } else if (mem.type === 'longterm') {
          await axios.post(`${baseURL}/api/memory/user_001/longterm`, {
            memory: mem.memory,
            category: mem.category,
            importance: mem.importance
          }, { headers });
          console.log(`✅ Long-term memory added: ${mem.memory.substring(0, 30)}...`);
        }
      } catch (error) {
        console.log(`⚠️ ${mem.type} addition failed: ${error.response?.data?.error?.message || error.message}`);
      }
    }

    console.log('\n🎉 Memory addition completed!');
    console.log('Now test chatting at http://localhost:3000');
    console.log('AI responses will show "🧠 Memories used in this response" below.');

  } catch (error) {
    console.error('❌ Memory addition failed:', error.message);
  }
}

addMoreMemories();

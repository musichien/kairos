/**
 * 메모리 표시 테스트
 */

const axios = require('axios');

async function testMemoryDisplay() {
  const baseURL = 'http://localhost:3000';
  const headers = { 'X-Bypass-Auth': 'true' };

  console.log('🧪 메모리 표시 테스트 시작...\n');

  try {
    // 1. Context Builder 테스트
    console.log('1. Context Builder 테스트');
    const contextResponse = await axios.post(`${baseURL}/api/context/build`, {
      userId: 'user_001',
      query: '안녕하세요',
      queryEmbedding: [0.1, 0.2, 0.3, 0.4, 0.5],
      options: {
        weights: {
          alpha: 0.6,
          beta: 0.2,
          gamma: 0.15,
          delta: 0.05
        }
      }
    }, { headers });

    const contextData = contextResponse.data.data;
    console.log('✅ Context Builder 응답:');
    console.log('- 사용된 메모리 ID:', contextData.usedMemoryIds);
    console.log('- 처리 시간:', contextData.debug.processingTime + 'ms');
    console.log('- 선택된 메모리 수:', contextData.debug.selectedMemoryCount);
    
    if (contextData.debug.condensedMemories && contextData.debug.condensedMemories.condensed) {
      console.log('- 압축된 메모리:');
      contextData.debug.condensedMemories.condensed.forEach((mem, index) => {
        console.log(`  ${index + 1}. ${mem.type}: ${mem.content} (점수: ${(mem.score * 100).toFixed(1)}%)`);
      });
    }

    // 2. 채팅 API 테스트 (실제로는 웹 브라우저에서 테스트해야 함)
    console.log('\n2. 채팅 API 테스트');
    const chatResponse = await axios.post(`${baseURL}/api/chat`, {
      messages: [
        { role: 'system', content: 'You are Kairos, a helpful AI assistant.' },
        { role: 'user', content: '안녕하세요' }
      ],
      user_id: 'user_001',
      model: 'gpt-oss:20b',
      max_tokens: 2000,
      temperature: 0.7,
      language: 'ko'
    }, { headers });

    console.log('✅ 채팅 API 응답:');
    console.log('- 응답 길이:', chatResponse.data.choices?.[0]?.message?.content?.length || 0);
    console.log('- 응답 내용:', chatResponse.data.choices?.[0]?.message?.content?.substring(0, 100) + '...');

    console.log('\n🎉 테스트 완료!');
    console.log('웹 브라우저에서 http://localhost:3000 에 접속하여 실제 UI를 테스트해보세요.');

  } catch (error) {
    console.error('❌ 테스트 실패:', error.response?.data || error.message);
  }
}

testMemoryDisplay();

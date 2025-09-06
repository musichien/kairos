/**
 * API 테스트 스크립트
 */

const axios = require('axios');

async function testAPIs() {
  const baseURL = 'http://localhost:3000';
  const headers = { 'X-Bypass-Auth': 'true' };

  console.log('🧪 API 테스트 시작...\n');

  try {
    // 1. 모니터링 통계 테스트
    console.log('1. 모니터링 통계 테스트');
    const monitoringResponse = await axios.get(`${baseURL}/api/monitoring/stats`, { headers });
    console.log('✅ 모니터링 통계:', JSON.stringify(monitoringResponse.data, null, 2));
    console.log('');

    // 2. Context Builder 테스트
    console.log('2. Context Builder 테스트');
    const contextBody = {
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
    };

    const contextResponse = await axios.post(`${baseURL}/api/context/build`, contextBody, { headers });
    console.log('✅ Context Builder:', JSON.stringify(contextResponse.data, null, 2));
    console.log('');

    // 3. Context 통계 테스트
    console.log('3. Context 통계 테스트');
    const contextStatsResponse = await axios.get(`${baseURL}/api/context/stats/user_001`, { headers });
    console.log('✅ Context 통계:', JSON.stringify(contextStatsResponse.data, null, 2));
    console.log('');

    // 4. 성능 리포트 테스트
    console.log('4. 성능 리포트 테스트');
    const reportResponse = await axios.get(`${baseURL}/api/monitoring/report`, { headers });
    console.log('✅ 성능 리포트:', JSON.stringify(reportResponse.data, null, 2));

  } catch (error) {
    console.error('❌ API 테스트 실패:', error.response?.data || error.message);
  }
}

// 테스트 실행
testAPIs();

/**
 * 테스트용 메모리 추가 스크립트
 */

const axios = require('axios');

async function addTestMemories() {
  const baseURL = 'http://localhost:3000';
  const headers = { 'X-Bypass-Auth': 'true' };

  console.log('🧠 테스트용 메모리 추가 시작...\n');

  try {
    // 1. 사실 추가 (익명화된 샘플 데이터)
    console.log('1. 사실 추가');
    await axios.post(`${baseURL}/api/memory/user_001/facts`, {
      fact: '사용자는 프로그래밍을 배우고 있습니다',
      category: 'learning'
    }, { headers });
    console.log('✅ 사실 추가됨');

    // 2. 선호도 추가 (익명화된 샘플 데이터)
    console.log('2. 선호도 추가');
    await axios.post(`${baseURL}/api/memory/user_001/preferences`, {
      preference: '음악 장르',
      value: '클래식'
    }, { headers });
    console.log('✅ 선호도 추가됨');

    // 3. 장기 기억 추가 (익명화된 샘플 데이터)
    console.log('3. 장기 기억 추가');
    await axios.post(`${baseURL}/api/memory/user_001/longterm`, {
      memory: '사용자는 아침에 일하는 것을 선호합니다',
      category: 'work_preference',
      importance: 'high'
    }, { headers });
    console.log('✅ 장기 기억 추가됨');

    // 4. 관심사 추가 (익명화된 샘플 데이터)
    console.log('4. 관심사 추가');
    await axios.post(`${baseURL}/api/memory/user_001/interests`, {
      interest: '독서',
      category: 'hobby'
    }, { headers });
    console.log('✅ 관심사 추가됨');

    console.log('\n🎉 모든 테스트 메모리가 추가되었습니다!');
    console.log('이제 http://localhost:3000 에서 채팅을 테스트해보세요.');

  } catch (error) {
    console.error('❌ 메모리 추가 실패:', error.response?.data || error.message);
  }
}

// 메모리 추가 실행
addTestMemories();

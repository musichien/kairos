/**
 * 더 많은 테스트용 메모리 추가
 */

const axios = require('axios');

async function addMoreMemories() {
  const baseURL = 'http://localhost:3000';
  const headers = { 'X-Bypass-Auth': 'true' };

  console.log('🧠 추가 메모리 생성 중...\n');

  const memories = [
    { type: 'fact', content: '사용자는 아침에 일하는 것을 선호합니다', category: 'work_preference' },
    { type: 'fact', content: '사용자는 프로그래밍을 배우고 있습니다', category: 'learning' },
    { type: 'fact', content: '사용자는 독서를 좋아합니다', category: 'hobby' },
    { type: 'preference', preference: '음악 장르', value: '클래식' },
    { type: 'preference', preference: '커피 종류', value: '에스프레소' },
    { type: 'preference', preference: '작업 시간', value: '오전' },
    { type: 'longterm', memory: '사용자는 창의적인 프로젝트를 즐깁니다', category: 'personality', importance: 'high' },
    { type: 'longterm', memory: '사용자는 새로운 기술을 배우는 것을 좋아합니다', category: 'learning', importance: 'medium' },
    { type: 'longterm', memory: '사용자는 팀워크를 중시합니다', category: 'work_style', importance: 'high' }
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
          console.log(`✅ 사실 추가: ${mem.content.substring(0, 30)}...`);
        } else if (mem.type === 'preference') {
          await axios.post(`${baseURL}/api/memory/user_001/preferences`, {
            preference: mem.preference,
            value: mem.value
          }, { headers });
          console.log(`✅ 선호도 추가: ${mem.preference} = ${mem.value}`);
        } else if (mem.type === 'longterm') {
          await axios.post(`${baseURL}/api/memory/user_001/longterm`, {
            memory: mem.memory,
            category: mem.category,
            importance: mem.importance
          }, { headers });
          console.log(`✅ 장기 기억 추가: ${mem.memory.substring(0, 30)}...`);
        }
      } catch (error) {
        console.log(`⚠️ ${mem.type} 추가 실패: ${error.response?.data?.error?.message || error.message}`);
      }
    }

    console.log('\n🎉 메모리 추가 완료!');
    console.log('이제 http://localhost:3000 에서 채팅을 테스트해보세요.');
    console.log('AI 응답 아래에 "🧠 이 답변에 사용된 기억"이 표시될 것입니다.');

  } catch (error) {
    console.error('❌ 메모리 추가 실패:', error.message);
  }
}

addMoreMemories();

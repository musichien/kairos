/**
 * Advanced Features Test Script - 고도화 기능 테스트
 * 
 * 이 스크립트는 새로 추가된 고도화 기능들을 테스트합니다:
 * - AI 성능 모니터링
 * - 사용자 행동 분석
 * - 고급 보안 관리
 * - 성능 최적화
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
const TEST_USER_ID = 'test_user_001';

// 테스트 헬퍼 함수
function logTestResult(testName, success, details = '') {
    const status = success ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${testName}`);
    if (details) {
        console.log(`   ${details}`);
    }
}

// 테스트 실행 함수
async function runTests() {
    console.log('🚀 Kairos 고도화 기능 테스트 시작\n');
    
    let passedTests = 0;
    let totalTests = 0;

    try {
        // 1. AI 성능 모니터링 테스트
        console.log('📊 AI 성능 모니터링 테스트');
        
        // 성능 상태 조회
        try {
            const response = await axios.get(`${BASE_URL}/api/performance/status`);
            if (response.data.success) {
                logTestResult('성능 모니터링 상태 조회', true);
                passedTests++;
            } else {
                logTestResult('성능 모니터링 상태 조회', false, '응답이 성공하지 않음');
            }
        } catch (error) {
            logTestResult('성능 모니터링 상태 조회', false, error.message);
        }
        totalTests++;

        // 성능 메트릭 조회
        try {
            const response = await axios.get(`${BASE_URL}/api/performance/metrics`);
            if (response.data.success) {
                logTestResult('성능 메트릭 조회', true);
                passedTests++;
            } else {
                logTestResult('성능 메트릭 조회', false, '응답이 성공하지 않음');
            }
        } catch (error) {
            logTestResult('성능 메트릭 조회', false, error.message);
        }
        totalTests++;

        // 2. 사용자 행동 분석 테스트
        console.log('\n👤 사용자 행동 분석 테스트');
        
        // 사용자 행동 기록
        try {
            const behaviorData = {
                userId: TEST_USER_ID,
                behaviorType: 'feature_usage',
                data: {
                    feature: 'ai_chat',
                    duration: 5000,
                    success: true
                }
            };
            
            const response = await axios.post(`${BASE_URL}/api/behavior/analyze`, behaviorData);
            if (response.data.success) {
                logTestResult('사용자 행동 분석', true);
                passedTests++;
            } else {
                logTestResult('사용자 행동 분석', false, '응답이 성공하지 않음');
            }
        } catch (error) {
            logTestResult('사용자 행동 분석', false, error.message);
        }
        totalTests++;

        // 개인화 설정 조회
        try {
            const response = await axios.get(`${BASE_URL}/api/behavior/personalize/${TEST_USER_ID}`);
            if (response.data.success) {
                logTestResult('개인화 설정 조회', true);
                passedTests++;
            } else {
                logTestResult('개인화 설정 조회', false, '응답이 성공하지 않음');
            }
        } catch (error) {
            logTestResult('개인화 설정 조회', false, error.message);
        }
        totalTests++;

        // 3. 고급 보안 관리 테스트
        console.log('\n🔒 고급 보안 관리 테스트');
        
        // 보안 상태 조회
        try {
            const response = await axios.get(`${BASE_URL}/api/security/advanced/status`);
            if (response.data.success) {
                logTestResult('고급 보안 상태 조회', true);
                passedTests++;
            } else {
                logTestResult('고급 보안 상태 조회', false, '응답이 성공하지 않음');
            }
        } catch (error) {
            logTestResult('고급 보안 상태 조회', false, error.message);
        }
        totalTests++;

        // 보안 알림 조회
        try {
            const response = await axios.get(`${BASE_URL}/api/security/advanced/alerts`);
            if (response.data.success) {
                logTestResult('보안 알림 조회', true);
                passedTests++;
            } else {
                logTestResult('보안 알림 조회', false, '응답이 성공하지 않음');
            }
        } catch (error) {
            logTestResult('보안 알림 조회', false, error.message);
        }
        totalTests++;

        // 4. 성능 최적화 테스트
        console.log('\n⚡ 성능 최적화 테스트');
        
        // 캐시 상태 조회
        try {
            const response = await axios.get(`${BASE_URL}/api/optimization/cache`);
            if (response.data.success) {
                logTestResult('캐시 상태 조회', true);
                passedTests++;
            } else {
                logTestResult('캐시 상태 조회', false, '응답이 성공하지 않음');
            }
        } catch (error) {
            logTestResult('캐시 상태 조회', false, error.message);
        }
        totalTests++;

        // 로드 밸런서 상태 조회
        try {
            const response = await axios.get(`${BASE_URL}/api/optimization/load-balancer`);
            if (response.data.success) {
                logTestResult('로드 밸런서 상태 조회', true);
                passedTests++;
            } else {
                logTestResult('로드 밸런서 상태 조회', false, '응답이 성공하지 않음');
            }
        } catch (error) {
            logTestResult('로드 밸런서 상태 조회', false, error.message);
        }
        totalTests++;

        // 최적화 권장사항 조회
        try {
            const response = await axios.get(`${BASE_URL}/api/optimization/recommendations`);
            if (response.data.success) {
                logTestResult('최적화 권장사항 조회', true);
                passedTests++;
            } else {
                logTestResult('최적화 권장사항 조회', false, '응답이 성공하지 않음');
            }
        } catch (error) {
            logTestResult('최적화 권장사항 조회', false, error.message);
        }
        totalTests++;

        // 5. 성능 최적화 실행 테스트
        try {
            const response = await axios.post(`${BASE_URL}/api/performance/optimize`, {
                operation: 'test_optimization',
                data: { test: true }
            });
            if (response.data.success) {
                logTestResult('성능 최적화 실행', true);
                passedTests++;
            } else {
                logTestResult('성능 최적화 실행', false, '응답이 성공하지 않음');
            }
        } catch (error) {
            logTestResult('성능 최적화 실행', false, error.message);
        }
        totalTests++;

        // 6. 보안 감사 보고서 테스트
        try {
            const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            const endDate = new Date().toISOString().split('T')[0];
            
            const response = await axios.get(`${BASE_URL}/api/security/advanced/audit?startDate=${startDate}&endDate=${endDate}`);
            if (response.data.success) {
                logTestResult('보안 감사 보고서 생성', true);
                passedTests++;
            } else {
                logTestResult('보안 감사 보고서 생성', false, '응답이 성공하지 않음');
            }
        } catch (error) {
            logTestResult('보안 감사 보고서 생성', false, error.message);
        }
        totalTests++;

    } catch (error) {
        console.error('❌ 테스트 실행 중 오류 발생:', error.message);
    }

    // 테스트 결과 요약
    console.log('\n' + '='.repeat(50));
    console.log('📋 테스트 결과 요약');
    console.log('='.repeat(50));
    console.log(`총 테스트: ${totalTests}`);
    console.log(`통과: ${passedTests}`);
    console.log(`실패: ${totalTests - passedTests}`);
    console.log(`성공률: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
    
    if (passedTests === totalTests) {
        console.log('\n🎉 모든 테스트가 통과했습니다!');
    } else {
        console.log('\n⚠️ 일부 테스트가 실패했습니다.');
    }
    
    console.log('\n🚀 Kairos 고도화 기능 테스트 완료');
}

// 서버 상태 확인
async function checkServerStatus() {
    try {
        const response = await axios.get(`${BASE_URL}/health`);
        if (response.data.status === 'ok') {
            console.log('✅ 서버가 정상적으로 실행 중입니다.');
            return true;
        } else {
            console.log('❌ 서버 상태가 정상이 아닙니다.');
            return false;
        }
    } catch (error) {
        console.log('❌ 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
        console.log(`   서버 URL: ${BASE_URL}`);
        return false;
    }
}

// 메인 실행 함수
async function main() {
    console.log('🔍 Kairos 서버 상태 확인 중...');
    
    const serverRunning = await checkServerStatus();
    if (!serverRunning) {
        console.log('\n💡 서버를 시작하려면: npm start');
        process.exit(1);
    }
    
    console.log('\n🚀 고도화 기능 테스트를 시작합니다...\n');
    await runTests();
}

// 스크립트 실행
if (require.main === module) {
    main().catch(error => {
        console.error('❌ 테스트 실행 실패:', error.message);
        process.exit(1);
    });
}

module.exports = { runTests, checkServerStatus };


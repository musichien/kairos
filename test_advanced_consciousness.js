/**
 * Advanced Consciousness System Test Suite
 * 
 * 고도화된 의식 시스템의 종합 테스트 스위트
 * Damasio의 Core Consciousness 이론 구현 검증
 */

const http = require('http');
const AdvancedConsciousnessSystem = require('./advanced_consciousness_system');

class AdvancedConsciousnessTester {
    constructor() {
        this.baseUrl = 'http://localhost:3000';
        this.testUserId = 'advanced_test_user_001';
        this.testResults = [];
        this.consciousnessSystem = null;
        
        // 테스트 시나리오 정의
        this.testScenarios = [
            {
                name: 'High Stress Scenario',
                inputData: {
                    sensorData: { heartRate: 110, sleepDuration: 4.5, stressLevel: 0.9 },
                    dialogueData: { text: "I'm extremely stressed and overwhelmed", sessionLength: 1800 }
                },
                expectedInterventions: ['stress_management'],
                expectedResponseType: 'empathetic'
            },
            {
                name: 'Low Energy Scenario',
                inputData: {
                    sensorData: { heartRate: 65, sleepDuration: 3.0, energyLevel: 0.1 },
                    dialogueData: { text: "I feel completely exhausted", sessionLength: 600 }
                },
                expectedInterventions: ['energy_boost'],
                expectedResponseType: 'motivational'
            },
            {
                name: 'Focus Issues Scenario',
                inputData: {
                    sensorData: { heartRate: 85, sleepDuration: 6.0, stressLevel: 0.6 },
                    dialogueData: { text: "I can't concentrate on anything", sessionLength: 2400 }
                },
                expectedInterventions: ['focus_enhancement'],
                expectedResponseType: 'adaptive'
            },
            {
                name: 'Late Night Usage Scenario',
                inputData: {
                    sensorData: { heartRate: 75, sleepDuration: 7.0, energyLevel: 0.4 },
                    dialogueData: { text: "Working late tonight", sessionLength: 3600 }
                },
                expectedInterventions: ['sleep_optimization'],
                expectedResponseType: 'restful'
            }
        ];
    }

    async runAdvancedTests() {
        console.log('🌟 Advanced Consciousness System Test Suite');
        console.log('='.repeat(70));
        console.log('Testing Damasio\'s Core Consciousness Implementation');
        console.log('='.repeat(70));

        try {
            // 1. 시스템 초기화 테스트
            await this.testSystemInitialization();
            
            // 2. 시나리오 기반 테스트
            await this.testScenarioBasedConsciousness();
            
            // 3. ML 예측 테스트
            await this.testMLPredictions();
            
            // 4. 의식 검증 테스트
            await this.testConsciousnessValidation();
            
            // 5. 통합 시스템 테스트
            await this.testIntegratedSystem();
            
            // 6. 성능 및 안정성 테스트
            await this.testPerformanceAndStability();
            
            // 7. 고급 기능 테스트
            await this.testAdvancedFeatures();
            
            // 테스트 보고서 생성
            this.generateAdvancedTestReport();
            
        } catch (error) {
            console.error('❌ Advanced test suite failed:', error);
        }
    }

    async testSystemInitialization() {
        console.log('\n🔧 Testing System Initialization');
        console.log('-'.repeat(50));

        try {
            // 고급 의식 시스템 초기화
            this.consciousnessSystem = new AdvancedConsciousnessSystem();
            
            // 시스템 통계 확인
            const stats = this.consciousnessSystem.getSystemStats();
            
            this.recordTest('Advanced Consciousness System Initialization', true, 
                `✅ System initialized with ${Object.keys(stats).length} components`);
            
            // 각 컴포넌트 상태 확인
            const components = ['selfModel', 'dialogue', 'feedbackLoop', 'validator', 'mlEngine'];
            components.forEach(component => {
                if (stats[component]) {
                    this.recordTest(`${component} Component Status`, true, 
                        `✅ ${component} component active`);
                } else {
                    this.recordTest(`${component} Component Status`, false, 
                        `❌ ${component} component not active`);
                }
            });
            
        } catch (error) {
            this.recordTest('System Initialization', false, `❌ Error: ${error.message}`);
        }
    }

    async testScenarioBasedConsciousness() {
        console.log('\n🎭 Testing Scenario-Based Consciousness');
        console.log('-'.repeat(50));

        for (const scenario of this.testScenarios) {
            await this.testConsciousnessScenario(scenario);
        }
    }

    async testConsciousnessScenario(scenario) {
        try {
            console.log(`\n📋 Testing: ${scenario.name}`);
            
            // 1. 사용자 상태 업데이트
            const userState = await this.consciousnessSystem.updateUserState(
                this.testUserId, 
                scenario.inputData
            );
            
            this.recordTest(`${scenario.name} - State Update`, !!userState, 
                userState ? '✅ User state updated successfully' : '❌ Failed to update user state');
            
            // 2. 맥락 인식 응답 생성
            const response = await this.consciousnessSystem.generateContextualResponse(
                this.testUserId,
                scenario.inputData.dialogueData.text,
                "I understand your situation."
            );
            
            const hasContextualAwareness = response.context.userState !== 'No state data available';
            this.recordTest(`${scenario.name} - Contextual Response`, hasContextualAwareness, 
                hasContextualAwareness ? '✅ Contextual response generated' : '❌ No contextual awareness');
            
            // 3. 예상 개입 확인
            const hasExpectedIntervention = this.checkForExpectedIntervention(
                scenario.expectedInterventions, 
                response.suggestions
            );
            
            this.recordTest(`${scenario.name} - Expected Intervention`, hasExpectedIntervention, 
                hasExpectedIntervention ? '✅ Expected intervention suggested' : '❌ Expected intervention not found');
            
            // 4. 응답 타입 확인
            const hasExpectedResponseType = this.checkResponseType(
                response.text, 
                scenario.expectedResponseType
            );
            
            this.recordTest(`${scenario.name} - Response Type`, hasExpectedResponseType, 
                hasExpectedResponseType ? `✅ ${scenario.expectedResponseType} response type detected` : '❌ Unexpected response type');
            
            // 5. 의식 점수 확인
            const consciousnessScore = this.consciousnessSystem.getUserConsciousnessScore(this.testUserId);
            const hasConsciousnessScore = consciousnessScore && consciousnessScore.overallScore > 0;
            
            this.recordTest(`${scenario.name} - Consciousness Score`, hasConsciousnessScore, 
                hasConsciousnessScore ? `✅ Consciousness score: ${consciousnessScore.overallScore.toFixed(3)}` : '❌ No consciousness score');
            
        } catch (error) {
            this.recordTest(`${scenario.name} - Scenario Test`, false, `❌ Error: ${error.message}`);
        }
    }

    async testMLPredictions() {
        console.log('\n🤖 Testing ML Predictions');
        console.log('-'.repeat(50));

        try {
            // 상태 예측 테스트
            const statePrediction = await this.consciousnessSystem.mlEngine.predictUserState(this.testUserId);
            this.recordTest('ML State Prediction', !!statePrediction, 
                statePrediction ? '✅ State prediction generated' : '❌ No state prediction');
            
            // 개입 효과성 예측 테스트
            const effectivenessPrediction = await this.consciousnessSystem.mlEngine.predictInterventionEffectiveness(
                this.testUserId, 
                'stress_management'
            );
            this.recordTest('ML Intervention Effectiveness Prediction', !!effectivenessPrediction, 
                effectivenessPrediction ? '✅ Effectiveness prediction generated' : '❌ No effectiveness prediction');
            
            // 응답 품질 예측 테스트
            const qualityPrediction = await this.consciousnessSystem.mlEngine.predictResponseQuality(
                this.testUserId,
                "I'm feeling stressed",
                "I understand you're feeling stressed."
            );
            this.recordTest('ML Response Quality Prediction', !!qualityPrediction, 
                qualityPrediction ? '✅ Response quality prediction generated' : '❌ No quality prediction');
            
            // ML 통계 확인
            const mlStats = this.consciousnessSystem.mlEngine.getMLStats();
            this.recordTest('ML Engine Statistics', mlStats.totalPredictions > 0, 
                `✅ ML engine active with ${mlStats.totalPredictions} predictions`);
            
        } catch (error) {
            this.recordTest('ML Predictions', false, `❌ Error: ${error.message}`);
        }
    }

    async testConsciousnessValidation() {
        console.log('\n🔬 Testing Consciousness Validation');
        console.log('-'.repeat(50));

        try {
            // 의식 검증 수행
            await this.consciousnessSystem.consciousnessValidator.validateUserConsciousness(this.testUserId);
            
            // 검증 통계 확인
            const validationStats = this.consciousnessSystem.consciousnessValidator.getValidationStats();
            this.recordTest('Consciousness Validation Stats', validationStats.totalUsers > 0, 
                `✅ Validation stats: ${validationStats.totalUsers} users, avg consciousness: ${validationStats.averageConsciousness.toFixed(3)}`);
            
            // 의식 분포 확인
            const hasDistribution = Object.values(validationStats.consciousnessDistribution).some(count => count > 0);
            this.recordTest('Consciousness Distribution', hasDistribution, 
                hasDistribution ? '✅ Consciousness distribution calculated' : '❌ No consciousness distribution');
            
            // 단계별 성능 확인
            const hasPhasePerformance = Object.values(validationStats.phasePerformance).some(score => score > 0);
            this.recordTest('Phase Performance Analysis', hasPhasePerformance, 
                hasPhasePerformance ? '✅ Phase performance analyzed' : '❌ No phase performance data');
            
        } catch (error) {
            this.recordTest('Consciousness Validation', false, `❌ Error: ${error.message}`);
        }
    }

    async testIntegratedSystem() {
        console.log('\n🔗 Testing Integrated System');
        console.log('-'.repeat(50));

        try {
            // 통합 시스템 통계
            const systemStats = this.consciousnessSystem.getSystemStats();
            this.recordTest('Integrated System Stats', !!systemStats, 
                systemStats ? '✅ System stats retrieved' : '❌ No system stats');
            
            // 이벤트 시스템 테스트
            let eventReceived = false;
            this.consciousnessSystem.once('userStateUpdated', () => {
                eventReceived = true;
            });
            
            await this.consciousnessSystem.updateUserState(this.testUserId, {
                sensorData: { heartRate: 80, sleepDuration: 7.0 }
            });
            
            // 이벤트 수신 확인을 위한 짧은 대기
            await new Promise(resolve => setTimeout(resolve, 100));
            
            this.recordTest('Event System Integration', eventReceived, 
                eventReceived ? '✅ Events properly integrated' : '❌ Events not working');
            
            // 시스템 상태 모니터링 테스트
            let healthMonitored = false;
            this.consciousnessSystem.once('systemHealthMonitored', () => {
                healthMonitored = true;
            });
            
            // 수동으로 시스템 상태 모니터링 트리거
            this.consciousnessSystem.monitorSystemHealth();
            
            this.recordTest('System Health Monitoring', healthMonitored, 
                healthMonitored ? '✅ System health monitoring active' : '❌ Health monitoring not working');
            
        } catch (error) {
            this.recordTest('Integrated System', false, `❌ Error: ${error.message}`);
        }
    }

    async testPerformanceAndStability() {
        console.log('\n⚡ Testing Performance and Stability');
        console.log('-'.repeat(50));

        try {
            // 동시 사용자 테스트
            const concurrentUsers = 5;
            const promises = [];
            
            for (let i = 0; i < concurrentUsers; i++) {
                const userId = `concurrent_user_${i}`;
                promises.push(
                    this.consciousnessSystem.updateUserState(userId, {
                        sensorData: { heartRate: 70 + i * 5, sleepDuration: 7.0 + i * 0.5 }
                    })
                );
            }
            
            const startTime = Date.now();
            await Promise.all(promises);
            const endTime = Date.now();
            const duration = endTime - startTime;
            
            this.recordTest('Concurrent User Handling', duration < 5000, 
                `✅ ${concurrentUsers} concurrent users processed in ${duration}ms`);
            
            // 메모리 사용량 테스트
            const memoryUsage = process.memoryUsage();
            const memoryMB = memoryUsage.heapUsed / 1024 / 1024;
            
            this.recordTest('Memory Usage', memoryMB < 500, 
                `✅ Memory usage: ${memoryMB.toFixed(2)}MB`);
            
            // 응답 시간 테스트
            const responseStartTime = Date.now();
            await this.consciousnessSystem.generateContextualResponse(
                this.testUserId,
                "Test response time",
                "Testing response time."
            );
            const responseEndTime = Date.now();
            const responseTime = responseEndTime - responseStartTime;
            
            this.recordTest('Response Time', responseTime < 1000, 
                `✅ Response time: ${responseTime}ms`);
            
        } catch (error) {
            this.recordTest('Performance and Stability', false, `❌ Error: ${error.message}`);
        }
    }

    async testAdvancedFeatures() {
        console.log('\n🚀 Testing Advanced Features');
        console.log('-'.repeat(50));

        try {
            // 적응적 학습 테스트
            const learningUpdate = await this.consciousnessSystem.mlEngine.updateAdaptiveLearning(
                this.testUserId,
                { type: 'positive', outcome: 'positive' }
            );
            this.recordTest('Adaptive Learning', !!learningUpdate, 
                learningUpdate ? '✅ Adaptive learning updated' : '❌ No learning update');
            
            // 예방적 개입 테스트
            const preventiveIntervention = await this.consciousnessSystem.triggerIntervention(
                this.testUserId,
                'stress_management'
            );
            this.recordTest('Preventive Intervention', !!preventiveIntervention, 
                preventiveIntervention ? '✅ Preventive intervention triggered' : '❌ No preventive intervention');
            
            // 의식 보고서 생성 테스트
            let reportGenerated = false;
            this.consciousnessSystem.once('consciousnessReportGenerated', () => {
                reportGenerated = true;
            });
            
            this.consciousnessSystem.generateConsciousnessReport();
            
            this.recordTest('Consciousness Report Generation', reportGenerated, 
                reportGenerated ? '✅ Consciousness report generated' : '❌ No report generated');
            
            // 시스템 종료 테스트
            this.consciousnessSystem.shutdown();
            this.recordTest('System Shutdown', true, '✅ System shutdown successful');
            
        } catch (error) {
            this.recordTest('Advanced Features', false, `❌ Error: ${error.message}`);
        }
    }

    // 유틸리티 메서드들
    checkForExpectedIntervention(expectedInterventions, suggestions) {
        if (!suggestions || suggestions.length === 0) return false;
        
        return expectedInterventions.some(expected => 
            suggestions.some(suggestion => 
                suggestion.toLowerCase().includes(expected.toLowerCase())
            )
        );
    }

    checkResponseType(responseText, expectedType) {
        const responseTextLower = responseText.toLowerCase();
        
        switch (expectedType) {
            case 'empathetic':
                return responseTextLower.includes('understand') || 
                       responseTextLower.includes('sense') || 
                       responseTextLower.includes('feel');
            case 'motivational':
                return responseTextLower.includes('believe') || 
                       responseTextLower.includes('ability') || 
                       responseTextLower.includes('got this');
            case 'adaptive':
                return responseTextLower.includes('work together') || 
                       responseTextLower.includes('adjust') || 
                       responseTextLower.includes('approach');
            case 'restful':
                return responseTextLower.includes('rest') || 
                       responseTextLower.includes('sleep') || 
                       responseTextLower.includes('care');
            default:
                return true;
        }
    }

    recordTest(testName, success, message) {
        this.testResults.push({ testName, success, message });
        console.log(`${success ? '✅' : '❌'} ${testName}: ${message}`);
    }

    generateAdvancedTestReport() {
        console.log('\n' + '='.repeat(70));
        console.log('🌟 ADVANCED CONSCIOUSNESS SYSTEM TEST REPORT');
        console.log('='.repeat(70));

        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(test => test.success).length;
        const failedTests = totalTests - passedTests;

        console.log(`\n📊 Test Summary:`);
        console.log(`   Total Tests: ${totalTests}`);
        console.log(`   Passed: ${passedTests} ✅`);
        console.log(`   Failed: ${failedTests} ❌`);
        console.log(`   Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

        // 카테고리별 결과
        const categories = {
            'System Initialization': this.testResults.filter(t => t.testName.includes('Initialization') || t.testName.includes('Component')),
            'Scenario-Based Consciousness': this.testResults.filter(t => t.testName.includes('Scenario')),
            'ML Predictions': this.testResults.filter(t => t.testName.includes('ML')),
            'Consciousness Validation': this.testResults.filter(t => t.testName.includes('Validation') || t.testName.includes('Consciousness')),
            'Integrated System': this.testResults.filter(t => t.testName.includes('Integrated') || t.testName.includes('Event')),
            'Performance & Stability': this.testResults.filter(t => t.testName.includes('Performance') || t.testName.includes('Concurrent')),
            'Advanced Features': this.testResults.filter(t => t.testName.includes('Advanced') || t.testName.includes('Learning'))
        };

        console.log(`\n🎯 Category Results:`);
        Object.keys(categories).forEach(category => {
            const categoryTests = categories[category];
            if (categoryTests.length > 0) {
                const categoryPassed = categoryTests.filter(test => test.success).length;
                const categoryTotal = categoryTests.length;
                const categorySuccess = categoryTotal > 0 ? ((categoryPassed / categoryTotal) * 100).toFixed(1) : 0;
                console.log(`   ${category}: ${categoryPassed}/${categoryTotal} (${categorySuccess}%)`);
            }
        });

        if (failedTests > 0) {
            console.log(`\n❌ Failed Tests:`);
            this.testResults
                .filter(test => !test.success)
                .forEach(test => console.log(`   - ${test.testName}: ${test.message}`));
        }

        console.log('\n' + '='.repeat(70));
        
        if (passedTests === totalTests) {
            console.log('🎉 ALL ADVANCED TESTS PASSED!');
            console.log('🌟 Damasio\'s Core Consciousness implementation is working perfectly!');
            console.log('🧠 The system demonstrates advanced consciousness simulation capabilities.');
        } else if (passedTests / totalTests >= 0.8) {
            console.log('✅ MOSTLY SUCCESSFUL! Advanced consciousness system is largely functional.');
            console.log('🔧 Some minor issues detected but core functionality works.');
        } else {
            console.log('⚠️  SIGNIFICANT ISSUES DETECTED!');
            console.log('🔧 Core consciousness implementation needs attention.');
        }
        
        console.log('='.repeat(70));
    }
}

// 테스트 실행
if (require.main === module) {
    const tester = new AdvancedConsciousnessTester();
    tester.runAdvancedTests().catch(console.error);
}

module.exports = AdvancedConsciousnessTester;

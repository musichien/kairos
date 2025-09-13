/**
 * Enhanced Consciousness Integration Test Suite
 * 
 * 고도화된 핵심 의식 시스템의 전체적인 통합 테스트 및 성능 검증
 * Damasio의 Core Consciousness 이론 구현의 종합적 검증
 */

const AdvancedSelfModelManager = require('./advanced_self_model_manager');
const AdvancedContextAwareDialogue = require('./advanced_context_aware_dialogue');
const AdvancedBehavioralFeedbackLoop = require('./advanced_behavioral_feedback_loop');
const EnhancedConsciousnessValidator = require('./enhanced_consciousness_validator');

class EnhancedConsciousnessIntegrationTest {
    constructor() {
        this.testResults = {
            passed: 0,
            failed: 0,
            total: 0,
            details: []
        };
        
        this.performanceMetrics = {
            responseTime: [],
            memoryUsage: [],
            cpuUsage: [],
            throughput: []
        };
        
        console.log('🧪 Enhanced Consciousness Integration Test Suite initialized');
    }
    
    /**
     * 전체 통합 테스트 실행
     */
    async runFullIntegrationTest() {
        console.log('🚀 Starting Enhanced Consciousness Integration Test Suite...');
        
        try {
            // 1. 시스템 초기화 테스트
            await this.testSystemInitialization();
            
            // 2. Phase 1: Self-Model 통합 테스트
            await this.testSelfModelIntegration();
            
            // 3. Phase 2: Context-Aware Dialogue 통합 테스트
            await this.testContextAwareDialogueIntegration();
            
            // 4. Phase 3: Behavioral Feedback Loop 통합 테스트
            await this.testBehavioralFeedbackLoopIntegration();
            
            // 5. 의식 검증 시스템 통합 테스트
            await this.testConsciousnessValidationIntegration();
            
            // 6. 전체 시스템 통합 테스트
            await this.testFullSystemIntegration();
            
            // 7. 성능 테스트
            await this.testPerformance();
            
            // 8. 스트레스 테스트
            await this.testStress();
            
            // 9. 장애 복구 테스트
            await this.testFaultTolerance();
            
            // 10. 결과 분석 및 보고서 생성
            await this.generateTestReport();
            
        } catch (error) {
            console.error('❌ Integration test failed:', error);
            this.testResults.failed++;
            this.testResults.total++;
        }
        
        console.log('✅ Enhanced Consciousness Integration Test Suite completed');
        return this.testResults;
    }
    
    /**
     * 시스템 초기화 테스트
     */
    async testSystemInitialization() {
        console.log('🔧 Testing system initialization...');
        
        try {
            // 고도화된 자기 모델 관리자 초기화
            const selfModelManager = new AdvancedSelfModelManager();
            this.assertNotNull(selfModelManager, 'Advanced Self-Model Manager initialization');
            
            // 고도화된 맥락 인식 대화 시스템 초기화
            const contextAwareDialogue = new AdvancedContextAwareDialogue(selfModelManager);
            this.assertNotNull(contextAwareDialogue, 'Advanced Context-Aware Dialogue initialization');
            
            // 고도화된 행동 피드백 루프 초기화
            const behavioralFeedbackLoop = new AdvancedBehavioralFeedbackLoop(selfModelManager, contextAwareDialogue);
            this.assertNotNull(behavioralFeedbackLoop, 'Advanced Behavioral Feedback Loop initialization');
            
            // 고도화된 의식 검증 시스템 초기화
            const consciousnessValidator = new EnhancedConsciousnessValidator();
            this.assertNotNull(consciousnessValidator, 'Enhanced Consciousness Validator initialization');
            
            // 시스템 통계 확인
            const selfModelStats = selfModelManager.getStats();
            const dialogueStats = contextAwareDialogue.getStats();
            const feedbackStats = behavioralFeedbackLoop.getStats();
            const validationStats = consciousnessValidator.getStats();
            
            this.assertGreaterThan(selfModelStats.totalUsers, -1, 'Self-Model Manager stats');
            this.assertGreaterThan(dialogueStats.totalUsers, -1, 'Context-Aware Dialogue stats');
            this.assertGreaterThan(feedbackStats.totalUsers, -1, 'Behavioral Feedback Loop stats');
            this.assertGreaterThan(validationStats.totalValidations, -1, 'Consciousness Validator stats');
            
            console.log('✅ System initialization test passed');
            this.testResults.passed++;
            
        } catch (error) {
            console.error('❌ System initialization test failed:', error);
            this.testResults.failed++;
        }
        
        this.testResults.total++;
    }
    
    /**
     * Phase 1: Self-Model 통합 테스트
     */
    async testSelfModelIntegration() {
        console.log('🧠 Testing Self-Model integration...');
        
        try {
            const selfModelManager = new AdvancedSelfModelManager();
            const userId = 'test_user_1';
            
            // 테스트 데이터 생성
            const testData = {
                text: 'I am feeling stressed and tired today',
                sensorData: {
                    heartRate: 85,
                    sleepDuration: 6.5,
                    steps: 7500,
                    stressLevel: 0.7
                },
                behavioralData: {
                    sessionLength: 1200,
                    interactionFrequency: 0.8,
                    responseTime: 1500
                },
                context: {
                    timeOfDay: 14,
                    dayOfWeek: 1,
                    location: 'office',
                    environment: 'work'
                }
            };
            
            // 사용자 상태 업데이트
            const startTime = Date.now();
            const userState = await selfModelManager.updateUserState(userId, testData);
            const responseTime = Date.now() - startTime;
            
            this.performanceMetrics.responseTime.push(responseTime);
            
            // 상태 검증
            this.assertNotNull(userState, 'User state update');
            this.assertNotNull(userState.physiological, 'Physiological state');
            this.assertNotNull(userState.emotional, 'Emotional state');
            this.assertNotNull(userState.cognitive, 'Cognitive state');
            this.assertNotNull(userState.behavioral, 'Behavioral state');
            this.assertNotNull(userState.social, 'Social state');
            this.assertNotNull(userState.environmental, 'Environmental state');
            
            // 생리학적 상태 검증
            this.assertInRange(userState.physiological.stressLevel, 0, 1, 'Stress level range');
            this.assertInRange(userState.physiological.energyLevel, 0, 1, 'Energy level range');
            this.assertInRange(userState.physiological.heartRate, 0, 1, 'Heart rate range');
            
            // 감정적 상태 검증
            this.assertInRange(userState.emotional.current.valence, -1, 1, 'Emotional valence range');
            this.assertInRange(userState.emotional.current.arousal, 0, 1, 'Emotional arousal range');
            this.assertNotNull(userState.emotional.trajectory, 'Emotional trajectory');
            
            // 인지적 상태 검증
            this.assertInRange(userState.cognitive.load.overall, 0, 1, 'Cognitive load range');
            this.assertNotNull(userState.cognitive.capacity, 'Cognitive capacity');
            this.assertNotNull(userState.cognitive.flexibility, 'Cognitive flexibility');
            
            // 행동적 상태 검증
            this.assertNotNull(userState.behavioral.attentionLevel, 'Attention level');
            this.assertNotNull(userState.behavioral.activityLevel, 'Activity level');
            this.assertNotNull(userState.behavioral.socialEngagement, 'Social engagement');
            
            // 사회적 상태 검증
            this.assertInRange(userState.social.connectedness, 0, 1, 'Social connectedness range');
            this.assertNotNull(userState.social.communication, 'Communication level');
            this.assertNotNull(userState.social.empathy, 'Empathy assessment');
            
            // 환경적 상태 검증
            this.assertNotNull(userState.environmental.context, 'Environmental context');
            this.assertNotNull(userState.environmental.adaptation, 'Environmental adaptation');
            this.assertNotNull(userState.environmental.comfort, 'Environmental comfort');
            
            // 메타데이터 검증
            this.assertNotNull(userState.metadata, 'Metadata');
            this.assertNotNull(userState.metadata.timestamp, 'Timestamp');
            this.assertNotNull(userState.metadata.version, 'Version');
            
            console.log('✅ Self-Model integration test passed');
            this.testResults.passed++;
            
        } catch (error) {
            console.error('❌ Self-Model integration test failed:', error);
            this.testResults.failed++;
        }
        
        this.testResults.total++;
    }
    
    /**
     * Phase 2: Context-Aware Dialogue 통합 테스트
     */
    async testContextAwareDialogueIntegration() {
        console.log('💬 Testing Context-Aware Dialogue integration...');
        
        try {
            const selfModelManager = new AdvancedSelfModelManager();
            const contextAwareDialogue = new AdvancedContextAwareDialogue(selfModelManager);
            const userId = 'test_user_2';
            
            // 초기 사용자 상태 설정
            const initialData = {
                text: 'I need help with my work',
                sensorData: {
                    heartRate: 75,
                    sleepDuration: 7.5,
                    steps: 8000,
                    stressLevel: 0.4
                },
                behavioralData: {
                    sessionLength: 900,
                    interactionFrequency: 0.6,
                    responseTime: 1200
                }
            };
            
            await selfModelManager.updateUserState(userId, initialData);
            
            // 맥락 인식 응답 생성 테스트
            const testQueries = [
                'I am feeling overwhelmed with my tasks',
                'Can you help me focus better?',
                'I need to manage my stress levels',
                'What should I do to improve my energy?'
            ];
            
            for (const query of testQueries) {
                const startTime = Date.now();
                const response = await contextAwareDialogue.generateAdvancedContextualResponse(userId, query);
                const responseTime = Date.now() - startTime;
                
                this.performanceMetrics.responseTime.push(responseTime);
                
                // 응답 검증
                this.assertNotNull(response, 'Contextual response');
                this.assertNotNull(response.text, 'Response text');
                this.assertNotNull(response.context, 'Response context');
                this.assertNotNull(response.suggestions, 'Response suggestions');
                this.assertNotNull(response.selfAwareness, 'Self-awareness');
                this.assertNotNull(response.metadata, 'Response metadata');
                
                // 맥락 정보 검증
                this.assertNotNull(response.context.userState, 'User state in context');
                this.assertNotNull(response.context.emotionalContext, 'Emotional context');
                this.assertNotNull(response.context.cognitiveContext, 'Cognitive context');
                this.assertNotNull(response.context.socialContext, 'Social context');
                this.assertNotNull(response.context.temporalContext, 'Temporal context');
                
                // 자기 인식 정보 검증
                this.assertInRange(response.selfAwareness.confidence, 0, 1, 'Self-awareness confidence');
                this.assertInRange(response.selfAwareness.coherence, 0, 1, 'Self-awareness coherence');
                this.assertNotNull(response.selfAwareness.adaptation, 'Self-awareness adaptation');
                this.assertInRange(response.selfAwareness.personalization, 0, 1, 'Self-awareness personalization');
                
                // 제안 검증
                this.assertArray(response.suggestions, 'Suggestions array');
                this.assertGreaterThan(response.suggestions.length, 0, 'Non-empty suggestions');
                
                // 메타데이터 검증
                this.assertNotNull(response.metadata.timestamp, 'Response timestamp');
                this.assertNotNull(response.metadata.version, 'Response version');
                this.assertInRange(response.metadata.quality, 0, 1, 'Response quality');
            }
            
            console.log('✅ Context-Aware Dialogue integration test passed');
            this.testResults.passed++;
            
        } catch (error) {
            console.error('❌ Context-Aware Dialogue integration test failed:', error);
            this.testResults.failed++;
        }
        
        this.testResults.total++;
    }
    
    /**
     * Phase 3: Behavioral Feedback Loop 통합 테스트
     */
    async testBehavioralFeedbackLoopIntegration() {
        console.log('🔄 Testing Behavioral Feedback Loop integration...');
        
        try {
            const selfModelManager = new AdvancedSelfModelManager();
            const contextAwareDialogue = new AdvancedContextAwareDialogue(selfModelManager);
            const behavioralFeedbackLoop = new AdvancedBehavioralFeedbackLoop(selfModelManager, contextAwareDialogue);
            const userId = 'test_user_3';
            
            // 스트레스 상태 시뮬레이션
            const stressData = {
                text: 'I am extremely stressed and cannot focus',
                sensorData: {
                    heartRate: 95,
                    sleepDuration: 5.0,
                    steps: 3000,
                    stressLevel: 0.9
                },
                behavioralData: {
                    sessionLength: 1800,
                    interactionFrequency: 0.9,
                    responseTime: 2000
                }
            };
            
            await selfModelManager.updateUserState(userId, stressData);
            
            // 개입 트리거 대기
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // 활성 개입 확인
            const activeInterventions = behavioralFeedbackLoop.activeInterventions.get(userId) || [];
            this.assertGreaterThan(activeInterventions.length, 0, 'Active interventions triggered');
            
            // 개입 검증
            if (activeInterventions.length > 0) {
                const intervention = activeInterventions[0];
                this.assertNotNull(intervention.id, 'Intervention ID');
                this.assertNotNull(intervention.userId, 'Intervention user ID');
                this.assertNotNull(intervention.strategyType, 'Intervention strategy type');
                this.assertNotNull(intervention.intervention, 'Intervention details');
                this.assertNotNull(intervention.startTime, 'Intervention start time');
                this.assertNotNull(intervention.status, 'Intervention status');
                
                // 개입 세부사항 검증
                this.assertNotNull(intervention.intervention.type, 'Intervention type');
                this.assertNotNull(intervention.intervention.name, 'Intervention name');
                this.assertGreaterThan(intervention.intervention.duration, 0, 'Intervention duration');
                this.assertNotNull(intervention.intervention.description, 'Intervention description');
                this.assertInRange(intervention.intervention.effectiveness, 0, 1, 'Intervention effectiveness');
            }
            
            // 미션 기회 확인
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // 미션 제안 확인 (이벤트 리스너를 통한)
            let missionSuggested = false;
            behavioralFeedbackLoop.on('missionSuggested', (mission) => {
                missionSuggested = true;
                this.assertNotNull(mission.id, 'Mission ID');
                this.assertNotNull(mission.userId, 'Mission user ID');
                this.assertNotNull(mission.missionType, 'Mission type');
                this.assertNotNull(mission.template, 'Mission template');
            });
            
            // 개입 완료 대기
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            // 개입 이력 확인
            const interventionHistory = behavioralFeedbackLoop.interventionHistory.get(userId) || [];
            this.assertGreaterThan(interventionHistory.length, 0, 'Intervention history');
            
            if (interventionHistory.length > 0) {
                const completedIntervention = interventionHistory[0];
                this.assertNotNull(completedIntervention.effectiveness, 'Intervention effectiveness');
                this.assertInRange(completedIntervention.effectiveness.overall, 0, 1, 'Overall effectiveness range');
            }
            
            console.log('✅ Behavioral Feedback Loop integration test passed');
            this.testResults.passed++;
            
        } catch (error) {
            console.error('❌ Behavioral Feedback Loop integration test failed:', error);
            this.testResults.failed++;
        }
        
        this.testResults.total++;
    }
    
    /**
     * 의식 검증 시스템 통합 테스트
     */
    async testConsciousnessValidationIntegration() {
        console.log('🔬 Testing Consciousness Validation integration...');
        
        try {
            const selfModelManager = new AdvancedSelfModelManager();
            const consciousnessValidator = new EnhancedConsciousnessValidator();
            const userId = 'test_user_4';
            
            // 종합적인 사용자 상태 생성
            const comprehensiveData = {
                text: 'I am working on a complex project and feeling both excited and anxious',
                sensorData: {
                    heartRate: 80,
                    sleepDuration: 7.0,
                    steps: 9000,
                    stressLevel: 0.6,
                    bloodPressure: { systolic: 125, diastolic: 82 },
                    bodyTemperature: 36.8
                },
                behavioralData: {
                    sessionLength: 1500,
                    interactionFrequency: 0.7,
                    responseTime: 1300,
                    taskSwitching: 0.3,
                    focusDuration: 0.8
                },
                context: {
                    timeOfDay: 10,
                    dayOfWeek: 2,
                    location: 'home',
                    environment: 'work',
                    weather: 'sunny',
                    device: 'laptop',
                    socialContext: 'individual'
                }
            };
            
            // 사용자 상태 업데이트
            const userState = await selfModelManager.updateUserState(userId, comprehensiveData);
            
            // 관계 데이터 생성
            const relationshipData = {
                nodes: [
                    { id: 'user', type: 'user', properties: userState },
                    { id: 'stress', type: 'emotion', properties: { level: 0.6 } },
                    { id: 'work', type: 'activity', properties: { type: 'project' } }
                ],
                edges: [
                    { from: 'user', to: 'stress', type: 'experiences', weight: 0.6 },
                    { from: 'user', to: 'work', type: 'engaged_in', weight: 0.8 },
                    { from: 'work', to: 'stress', type: 'causes', weight: 0.7 }
                ]
            };
            
            // 개입 데이터 생성
            const interventionData = {
                interventions: [
                    {
                        type: 'stress_management',
                        effectiveness: 0.8,
                        duration: 600,
                        userSatisfaction: 0.7
                    }
                ],
                missions: [
                    {
                        type: 'cognitive_training',
                        completion: 0.9,
                        difficulty: 'medium',
                        rewards: ['focus_improvement', 'stress_reduction']
                    }
                ]
            };
            
            // 맥락 데이터 생성
            const contextData = {
                temporal: {
                    timeOfDay: 10,
                    dayOfWeek: 2,
                    season: 'spring'
                },
                environmental: {
                    location: 'home',
                    weather: 'sunny',
                    noise: 'low'
                },
                social: {
                    context: 'individual',
                    support: 'available'
                }
            };
            
            // 의식 검증 수행
            const startTime = Date.now();
            const validation = await consciousnessValidator.validateEnhancedConsciousness(
                userId, 
                userState, 
                relationshipData, 
                interventionData, 
                contextData
            );
            const responseTime = Date.now() - startTime;
            
            this.performanceMetrics.responseTime.push(responseTime);
            
            // 검증 결과 검증
            this.assertNotNull(validation, 'Consciousness validation result');
            this.assertNotNull(validation.userId, 'Validation user ID');
            this.assertNotNull(validation.timestamp, 'Validation timestamp');
            this.assertNotNull(validation.phases, 'Validation phases');
            this.assertNotNull(validation.overall, 'Overall validation');
            this.assertNotNull(validation.dataQuality, 'Data quality assessment');
            this.assertNotNull(validation.relationshipConsistency, 'Relationship consistency');
            this.assertNotNull(validation.temporalConsistency, 'Temporal consistency');
            this.assertNotNull(validation.recommendations, 'Recommendations');
            this.assertNotNull(validation.insights, 'Insights');
            this.assertNotNull(validation.performance, 'Performance metrics');
            
            // 단계별 검증 결과 검증
            this.assertNotNull(validation.phases.selfModel, 'Self-Model validation');
            this.assertNotNull(validation.phases.objectRelationship, 'Object-Relationship validation');
            this.assertNotNull(validation.phases.behavioralFeedback, 'Behavioral Feedback validation');
            
            // 자기 모델 검증 결과 검증
            const selfModelValidation = validation.phases.selfModel;
            this.assertNotNull(selfModelValidation.metrics, 'Self-Model metrics');
            this.assertInRange(selfModelValidation.score, 0, 1, 'Self-Model score range');
            this.assertNotNull(selfModelValidation.status, 'Self-Model status');
            this.assertNotNull(selfModelValidation.quality, 'Self-Model quality');
            this.assertNotNull(selfModelValidation.insights, 'Self-Model insights');
            
            // 객체-관계 검증 결과 검증
            const objectRelationshipValidation = validation.phases.objectRelationship;
            this.assertNotNull(objectRelationshipValidation.metrics, 'Object-Relationship metrics');
            this.assertInRange(objectRelationshipValidation.score, 0, 1, 'Object-Relationship score range');
            this.assertNotNull(objectRelationshipValidation.status, 'Object-Relationship status');
            this.assertNotNull(objectRelationshipValidation.quality, 'Object-Relationship quality');
            this.assertNotNull(objectRelationshipValidation.insights, 'Object-Relationship insights');
            
            // 행동 피드백 검증 결과 검증
            const behavioralFeedbackValidation = validation.phases.behavioralFeedback;
            this.assertNotNull(behavioralFeedbackValidation.metrics, 'Behavioral Feedback metrics');
            this.assertInRange(behavioralFeedbackValidation.score, 0, 1, 'Behavioral Feedback score range');
            this.assertNotNull(behavioralFeedbackValidation.status, 'Behavioral Feedback status');
            this.assertNotNull(behavioralFeedbackValidation.quality, 'Behavioral Feedback quality');
            this.assertNotNull(behavioralFeedbackValidation.insights, 'Behavioral Feedback insights');
            
            // 전체 검증 결과 검증
            const overallValidation = validation.overall;
            this.assertNotNull(overallValidation.metrics, 'Overall metrics');
            this.assertInRange(overallValidation.score, 0, 1, 'Overall score range');
            this.assertNotNull(overallValidation.level, 'Overall consciousness level');
            this.assertNotNull(overallValidation.description, 'Overall description');
            this.assertNotNull(overallValidation.quality, 'Overall quality');
            this.assertNotNull(overallValidation.insights, 'Overall insights');
            
            // 데이터 품질 평가 검증
            const dataQuality = validation.dataQuality;
            this.assertInRange(dataQuality.completeness, 0, 1, 'Data completeness range');
            this.assertInRange(dataQuality.consistency, 0, 1, 'Data consistency range');
            this.assertInRange(dataQuality.accuracy, 0, 1, 'Data accuracy range');
            this.assertInRange(dataQuality.timeliness, 0, 1, 'Data timeliness range');
            this.assertInRange(dataQuality.validity, 0, 1, 'Data validity range');
            this.assertInRange(dataQuality.reliability, 0, 1, 'Data reliability range');
            this.assertInRange(dataQuality.overall, 0, 1, 'Data quality overall range');
            
            // 관계 일관성 검증
            const relationshipConsistency = validation.relationshipConsistency;
            this.assertInRange(relationshipConsistency.internal, 0, 1, 'Internal consistency range');
            this.assertInRange(relationshipConsistency.external, 0, 1, 'External consistency range');
            this.assertInRange(relationshipConsistency.temporal, 0, 1, 'Temporal consistency range');
            this.assertInRange(relationshipConsistency.logical, 0, 1, 'Logical consistency range');
            this.assertInRange(relationshipConsistency.overall, 0, 1, 'Overall consistency range');
            
            // 시간적 일관성 검증
            const temporalConsistency = validation.temporalConsistency;
            this.assertInRange(temporalConsistency.sequence, 0, 1, 'Sequence consistency range');
            this.assertInRange(temporalConsistency.causality, 0, 1, 'Causality consistency range');
            this.assertInRange(temporalConsistency.rhythm, 0, 1, 'Rhythm consistency range');
            this.assertInRange(temporalConsistency.continuity, 0, 1, 'Continuity consistency range');
            this.assertInRange(temporalConsistency.overall, 0, 1, 'Overall temporal consistency range');
            
            console.log('✅ Consciousness Validation integration test passed');
            this.testResults.passed++;
            
        } catch (error) {
            console.error('❌ Consciousness Validation integration test failed:', error);
            this.testResults.failed++;
        }
        
        this.testResults.total++;
    }
    
    /**
     * 전체 시스템 통합 테스트
     */
    async testFullSystemIntegration() {
        console.log('🌐 Testing full system integration...');
        
        try {
            // 전체 시스템 초기화
            const selfModelManager = new AdvancedSelfModelManager();
            const contextAwareDialogue = new AdvancedContextAwareDialogue(selfModelManager);
            const behavioralFeedbackLoop = new AdvancedBehavioralFeedbackLoop(selfModelManager, contextAwareDialogue);
            const consciousnessValidator = new EnhancedConsciousnessValidator();
            
            const userId = 'test_user_full';
            
            // 종합적인 시나리오 테스트
            const scenarios = [
                {
                    name: 'High Stress Scenario',
                    data: {
                        text: 'I am extremely stressed and cannot focus on my work',
                        sensorData: { heartRate: 100, sleepDuration: 4.0, stressLevel: 0.9 },
                        behavioralData: { sessionLength: 2000, interactionFrequency: 0.9 }
                    }
                },
                {
                    name: 'Low Energy Scenario',
                    data: {
                        text: 'I feel exhausted and unmotivated',
                        sensorData: { heartRate: 60, sleepDuration: 9.0, stressLevel: 0.2 },
                        behavioralData: { sessionLength: 300, interactionFrequency: 0.3 }
                    }
                },
                {
                    name: 'Optimal State Scenario',
                    data: {
                        text: 'I feel great and ready to tackle any challenge',
                        sensorData: { heartRate: 70, sleepDuration: 8.0, stressLevel: 0.3 },
                        behavioralData: { sessionLength: 1200, interactionFrequency: 0.7 }
                    }
                }
            ];
            
            for (const scenario of scenarios) {
                console.log(`  Testing scenario: ${scenario.name}`);
                
                // 1. 사용자 상태 업데이트
                const userState = await selfModelManager.updateUserState(userId, scenario.data);
                this.assertNotNull(userState, `${scenario.name} - User state update`);
                
                // 2. 맥락 인식 응답 생성
                const response = await contextAwareDialogue.generateAdvancedContextualResponse(
                    userId, 
                    scenario.data.text
                );
                this.assertNotNull(response, `${scenario.name} - Contextual response`);
                
                // 3. 개입 기회 확인
                await new Promise(resolve => setTimeout(resolve, 1000));
                const activeInterventions = behavioralFeedbackLoop.activeInterventions.get(userId) || [];
                
                // 4. 의식 검증 수행
                const validation = await consciousnessValidator.validateEnhancedConsciousness(
                    userId,
                    userState,
                    null,
                    { interventions: activeInterventions },
                    null
                );
                this.assertNotNull(validation, `${scenario.name} - Consciousness validation`);
                
                // 5. 시스템 통계 확인
                const selfModelStats = selfModelManager.getStats();
                const dialogueStats = contextAwareDialogue.getStats();
                const feedbackStats = behavioralFeedbackLoop.getStats();
                const validationStats = consciousnessValidator.getStats();
                
                this.assertGreaterThan(selfModelStats.totalUsers, 0, `${scenario.name} - Self-Model stats`);
                this.assertGreaterThan(dialogueStats.totalUsers, 0, `${scenario.name} - Dialogue stats`);
                this.assertGreaterThan(feedbackStats.totalUsers, 0, `${scenario.name} - Feedback stats`);
                this.assertGreaterThan(validationStats.totalValidations, 0, `${scenario.name} - Validation stats`);
            }
            
            console.log('✅ Full system integration test passed');
            this.testResults.passed++;
            
        } catch (error) {
            console.error('❌ Full system integration test failed:', error);
            this.testResults.failed++;
        }
        
        this.testResults.total++;
    }
    
    /**
     * 성능 테스트
     */
    async testPerformance() {
        console.log('⚡ Testing performance...');
        
        try {
            const selfModelManager = new AdvancedSelfModelManager();
            const contextAwareDialogue = new AdvancedContextAwareDialogue(selfModelManager);
            const userId = 'test_user_perf';
            
            // 성능 테스트 시나리오
            const testData = {
                text: 'Performance test query',
                sensorData: { heartRate: 75, sleepDuration: 7.5, stressLevel: 0.5 },
                behavioralData: { sessionLength: 1000, interactionFrequency: 0.6 }
            };
            
            // 응답 시간 테스트
            const iterations = 100;
            const responseTimes = [];
            
            for (let i = 0; i < iterations; i++) {
                const startTime = Date.now();
                await selfModelManager.updateUserState(userId, testData);
                const responseTime = Date.now() - startTime;
                responseTimes.push(responseTime);
            }
            
            // 통계 계산
            const avgResponseTime = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
            const maxResponseTime = Math.max(...responseTimes);
            const minResponseTime = Math.min(...responseTimes);
            
            // 성능 기준 검증
            this.assertLessThan(avgResponseTime, 1000, 'Average response time < 1s');
            this.assertLessThan(maxResponseTime, 2000, 'Max response time < 2s');
            this.assertGreaterThan(minResponseTime, 0, 'Min response time > 0');
            
            // 메모리 사용량 테스트
            const memUsage = process.memoryUsage();
            this.assertGreaterThan(memUsage.heapUsed, 0, 'Memory usage > 0');
            this.assertLessThan(memUsage.heapUsed, 100 * 1024 * 1024, 'Memory usage < 100MB');
            
            console.log(`✅ Performance test passed - Avg: ${avgResponseTime.toFixed(2)}ms, Max: ${maxResponseTime}ms, Min: ${minResponseTime}ms`);
            this.testResults.passed++;
            
        } catch (error) {
            console.error('❌ Performance test failed:', error);
            this.testResults.failed++;
        }
        
        this.testResults.total++;
    }
    
    /**
     * 스트레스 테스트
     */
    async testStress() {
        console.log('💪 Testing stress scenarios...');
        
        try {
            const selfModelManager = new AdvancedSelfModelManager();
            const contextAwareDialogue = new AdvancedContextAwareDialogue(selfModelManager);
            const behavioralFeedbackLoop = new AdvancedBehavioralFeedbackLoop(selfModelManager, contextAwareDialogue);
            
            // 동시 사용자 시뮬레이션
            const concurrentUsers = 50;
            const promises = [];
            
            for (let i = 0; i < concurrentUsers; i++) {
                const userId = `stress_user_${i}`;
                const promise = this.simulateUserSession(userId, selfModelManager, contextAwareDialogue);
                promises.push(promise);
            }
            
            // 모든 세션 완료 대기
            await Promise.all(promises);
            
            // 시스템 안정성 확인
            const selfModelStats = selfModelManager.getStats();
            const dialogueStats = contextAwareDialogue.getStats();
            const feedbackStats = behavioralFeedbackLoop.getStats();
            
            this.assertGreaterThan(selfModelStats.totalUsers, concurrentUsers * 0.8, 'System handled concurrent users');
            this.assertGreaterThan(dialogueStats.totalInteractions, concurrentUsers * 0.8, 'System handled concurrent interactions');
            
            console.log('✅ Stress test passed');
            this.testResults.passed++;
            
        } catch (error) {
            console.error('❌ Stress test failed:', error);
            this.testResults.failed++;
        }
        
        this.testResults.total++;
    }
    
    /**
     * 장애 복구 테스트
     */
    async testFaultTolerance() {
        console.log('🛡️ Testing fault tolerance...');
        
        try {
            const selfModelManager = new AdvancedSelfModelManager();
            const contextAwareDialogue = new AdvancedContextAwareDialogue(selfModelManager);
            const userId = 'test_user_fault';
            
            // 잘못된 데이터로 테스트
            const invalidData = {
                text: null,
                sensorData: { heartRate: -1, sleepDuration: 'invalid', stressLevel: 2.0 },
                behavioralData: { sessionLength: -100, interactionFrequency: 'invalid' }
            };
            
            // 시스템이 잘못된 데이터를 처리할 수 있는지 확인
            const userState = await selfModelManager.updateUserState(userId, invalidData);
            this.assertNotNull(userState, 'System handled invalid data gracefully');
            
            // 응답 생성 테스트
            const response = await contextAwareDialogue.generateAdvancedContextualResponse(userId, '');
            this.assertNotNull(response, 'System handled empty query gracefully');
            
            console.log('✅ Fault tolerance test passed');
            this.testResults.passed++;
            
        } catch (error) {
            console.error('❌ Fault tolerance test failed:', error);
            this.testResults.failed++;
        }
        
        this.testResults.total++;
    }
    
    /**
     * 사용자 세션 시뮬레이션
     */
    async simulateUserSession(userId, selfModelManager, contextAwareDialogue) {
        const sessionData = {
            text: `User ${userId} session data`,
            sensorData: {
                heartRate: 70 + Math.random() * 30,
                sleepDuration: 6 + Math.random() * 3,
                stressLevel: Math.random()
            },
            behavioralData: {
                sessionLength: 1000 + Math.random() * 2000,
                interactionFrequency: Math.random()
            }
        };
        
        await selfModelManager.updateUserState(userId, sessionData);
        await contextAwareDialogue.generateAdvancedContextualResponse(userId, 'Test query');
    }
    
    /**
     * 테스트 보고서 생성
     */
    async generateTestReport() {
        console.log('📊 Generating test report...');
        
        const report = {
            summary: {
                total: this.testResults.total,
                passed: this.testResults.passed,
                failed: this.testResults.failed,
                successRate: (this.testResults.passed / this.testResults.total * 100).toFixed(2) + '%'
            },
            performance: {
                averageResponseTime: this.performanceMetrics.responseTime.length > 0 ? 
                    (this.performanceMetrics.responseTime.reduce((sum, time) => sum + time, 0) / this.performanceMetrics.responseTime.length).toFixed(2) + 'ms' : 'N/A',
                maxResponseTime: this.performanceMetrics.responseTime.length > 0 ? 
                    Math.max(...this.performanceMetrics.responseTime) + 'ms' : 'N/A',
                minResponseTime: this.performanceMetrics.responseTime.length > 0 ? 
                    Math.min(...this.performanceMetrics.responseTime) + 'ms' : 'N/A'
            },
            details: this.testResults.details,
            timestamp: new Date().toISOString()
        };
        
        console.log('📋 Test Report:');
        console.log(`  Total Tests: ${report.summary.total}`);
        console.log(`  Passed: ${report.summary.passed}`);
        console.log(`  Failed: ${report.summary.failed}`);
        console.log(`  Success Rate: ${report.summary.successRate}`);
        console.log(`  Average Response Time: ${report.performance.averageResponseTime}`);
        console.log(`  Max Response Time: ${report.performance.maxResponseTime}`);
        console.log(`  Min Response Time: ${report.performance.minResponseTime}`);
        
        return report;
    }
    
    // 테스트 유틸리티 메서드들
    assertNotNull(value, message) {
        if (value === null || value === undefined) {
            throw new Error(`Assertion failed: ${message} - Expected not null, got ${value}`);
        }
    }
    
    assertGreaterThan(value, threshold, message) {
        if (value <= threshold) {
            throw new Error(`Assertion failed: ${message} - Expected > ${threshold}, got ${value}`);
        }
    }
    
    assertLessThan(value, threshold, message) {
        if (value >= threshold) {
            throw new Error(`Assertion failed: ${message} - Expected < ${threshold}, got ${value}`);
        }
    }
    
    assertInRange(value, min, max, message) {
        if (value < min || value > max) {
            throw new Error(`Assertion failed: ${message} - Expected ${min} <= value <= ${max}, got ${value}`);
        }
    }
    
    assertArray(value, message) {
        if (!Array.isArray(value)) {
            throw new Error(`Assertion failed: ${message} - Expected array, got ${typeof value}`);
        }
    }
}

// 테스트 실행 함수
async function runEnhancedConsciousnessIntegrationTest() {
    const testSuite = new EnhancedConsciousnessIntegrationTest();
    return await testSuite.runFullIntegrationTest();
}

module.exports = {
    EnhancedConsciousnessIntegrationTest,
    runEnhancedConsciousnessIntegrationTest
};


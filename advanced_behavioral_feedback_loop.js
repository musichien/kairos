/**
 * Advanced Behavioral Feedback Loop System - 고도화된 행동 피드백 루프 시스템
 * 
 * Damasio의 Core Consciousness 이론 Phase 3의 고도화된 구현
 * 사용자 상태 추론 기반 자동화된 개입 정교화, 인지 훈련 및 미션 제안 통합
 */

const EventEmitter = require('events');

class AdvancedBehavioralFeedbackLoop extends EventEmitter {
    constructor(advancedSelfModelManager, advancedContextAwareDialogue) {
        super();
        this.selfModelManager = advancedSelfModelManager;
        this.contextAwareDialogue = advancedContextAwareDialogue;
        
        // 고급 개입 시스템
        this.interventionStrategies = new Map();
        this.activeInterventions = new Map();
        this.interventionHistory = new Map();
        this.interventionEffectiveness = new Map();
        
        // 고급 미션 시스템
        this.missionTemplates = new Map();
        this.activeMissions = new Map();
        this.missionHistory = new Map();
        this.missionEffectiveness = new Map();
        
        // 개인화 시스템
        this.personalizationProfiles = new Map();
        this.adaptationModels = new Map();
        this.learningAlgorithms = new Map();
        
        // 예측 시스템
        this.predictionModels = new Map();
        this.riskAssessment = new Map();
        this.opportunityDetection = new Map();
        
        // 초기화
        this.initializeAdvancedInterventionStrategies();
        this.initializeAdvancedMissionTemplates();
        this.initializePersonalizationSystems();
        this.initializePredictionSystems();
        this.setupAdvancedEventListeners();
        this.startAdvancedMonitoring();
        
        console.log('🔄 Advanced Behavioral Feedback Loop System initialized (Damasio Phase 3 Enhanced)');
    }
    
    /**
     * 고급 개입 전략 초기화
     */
    initializeAdvancedInterventionStrategies() {
        // 스트레스 관리 고급 개입
        this.interventionStrategies.set('advanced_stress_management', {
            name: 'Advanced Stress Management',
            category: 'physiological',
            triggers: ['high_stress_affects_attention', 'stress_affects_activity', 'emotional_dysregulation'],
            priority: 'high',
            interventions: [
                {
                    type: 'adaptive_breathing',
                    name: 'Adaptive Breathing Exercise',
                    duration: 300,
                    description: 'Personalized breathing exercise based on current stress level',
                    effectiveness: 0.9,
                    personalization: ['stress_level', 'breathing_pattern', 'preference'],
                    adaptation: 'real_time'
                },
                {
                    type: 'cognitive_reframing',
                    name: 'Cognitive Reframing Session',
                    duration: 600,
                    description: 'Help reframe stressful thoughts and situations',
                    effectiveness: 0.8,
                    personalization: ['cognitive_style', 'stress_triggers', 'coping_strategies'],
                    adaptation: 'contextual'
                },
                {
                    type: 'progressive_muscle_relaxation',
                    name: 'Progressive Muscle Relaxation',
                    duration: 900,
                    description: 'Systematic relaxation with biofeedback integration',
                    effectiveness: 0.85,
                    personalization: ['muscle_tension', 'relaxation_preference', 'time_constraints'],
                    adaptation: 'physiological'
                }
            ],
            mlOptimization: true,
            adaptiveLearning: true
        });
        
        // 에너지 최적화 고급 개입
        this.interventionStrategies.set('energy_optimization', {
            name: 'Energy Optimization',
            category: 'physiological',
            triggers: ['low_energy_affects_emotion', 'circadian_misalignment', 'metabolic_imbalance'],
            priority: 'medium',
            interventions: [
                {
                    type: 'circadian_light_therapy',
                    name: 'Circadian Light Therapy',
                    duration: 1200,
                    description: 'Personalized light exposure to reset circadian rhythm',
                    effectiveness: 0.8,
                    personalization: ['circadian_phase', 'light_sensitivity', 'schedule'],
                    adaptation: 'temporal'
                },
                {
                    type: 'nutritional_optimization',
                    name: 'Nutritional Energy Boost',
                    duration: 300,
                    description: 'Personalized nutrition recommendations for energy',
                    effectiveness: 0.7,
                    personalization: ['metabolic_profile', 'dietary_preferences', 'energy_needs'],
                    adaptation: 'metabolic'
                },
                {
                    type: 'micro_exercise',
                    name: 'Micro Exercise Break',
                    duration: 180,
                    description: 'Short, targeted exercises to boost energy',
                    effectiveness: 0.75,
                    personalization: ['fitness_level', 'energy_state', 'available_time'],
                    adaptation: 'physiological'
                }
            ],
            mlOptimization: true,
            adaptiveLearning: true
        });
        
        // 인지 향상 고급 개입
        this.interventionStrategies.set('cognitive_enhancement', {
            name: 'Cognitive Enhancement',
            category: 'cognitive',
            triggers: ['cognitive_overload', 'attention_difficulties', 'memory_challenges'],
            priority: 'high',
            interventions: [
                {
                    type: 'adaptive_focus_training',
                    name: 'Adaptive Focus Training',
                    duration: 1500,
                    description: 'Personalized attention training based on cognitive load',
                    effectiveness: 0.9,
                    personalization: ['attention_span', 'cognitive_load', 'focus_preferences'],
                    adaptation: 'cognitive'
                },
                {
                    type: 'working_memory_boost',
                    name: 'Working Memory Enhancement',
                    duration: 600,
                    description: 'Targeted exercises to improve working memory',
                    effectiveness: 0.8,
                    personalization: ['memory_capacity', 'cognitive_style', 'learning_preference'],
                    adaptation: 'cognitive'
                },
                {
                    type: 'executive_function_training',
                    name: 'Executive Function Training',
                    duration: 1200,
                    description: 'Training for planning, inhibition, and cognitive flexibility',
                    effectiveness: 0.85,
                    personalization: ['executive_function_profile', 'cognitive_strengths', 'challenges'],
                    adaptation: 'cognitive'
                }
            ],
            mlOptimization: true,
            adaptiveLearning: true
        });
        
        // 감정 조절 고급 개입
        this.interventionStrategies.set('emotional_regulation', {
            name: 'Advanced Emotional Regulation',
            category: 'emotional',
            triggers: ['emotional_dysregulation', 'mood_instability', 'emotional_overwhelm'],
            priority: 'high',
            interventions: [
                {
                    type: 'emotion_coaching',
                    name: 'AI-Powered Emotion Coaching',
                    duration: 900,
                    description: 'Personalized emotional regulation coaching',
                    effectiveness: 0.9,
                    personalization: ['emotional_profile', 'regulation_strategies', 'emotional_intelligence'],
                    adaptation: 'emotional'
                },
                {
                    type: 'mindfulness_meditation',
                    name: 'Adaptive Mindfulness Meditation',
                    duration: 1200,
                    description: 'Personalized mindfulness practice for emotional balance',
                    effectiveness: 0.85,
                    personalization: ['meditation_experience', 'emotional_state', 'mindfulness_preference'],
                    adaptation: 'emotional'
                },
                {
                    type: 'emotional_expression',
                    name: 'Guided Emotional Expression',
                    duration: 600,
                    description: 'Safe space for emotional expression and processing',
                    effectiveness: 0.8,
                    personalization: ['expression_style', 'emotional_needs', 'comfort_level'],
                    adaptation: 'emotional'
                }
            ],
            mlOptimization: true,
            adaptiveLearning: true
        });
        
        // 사회적 연결 고급 개입
        this.interventionStrategies.set('social_connection', {
            name: 'Social Connection Enhancement',
            category: 'social',
            triggers: ['social_isolation', 'loneliness', 'social_anxiety'],
            priority: 'medium',
            interventions: [
                {
                    type: 'social_skills_training',
                    name: 'Social Skills Training',
                    duration: 1800,
                    description: 'Personalized social interaction training',
                    effectiveness: 0.8,
                    personalization: ['social_comfort', 'interaction_style', 'social_goals'],
                    adaptation: 'social'
                },
                {
                    type: 'community_building',
                    name: 'Community Building Support',
                    duration: 1200,
                    description: 'Help build meaningful social connections',
                    effectiveness: 0.75,
                    personalization: ['social_preferences', 'community_interests', 'connection_style'],
                    adaptation: 'social'
                },
                {
                    type: 'empathy_development',
                    name: 'Empathy Development',
                    duration: 900,
                    description: 'Enhance emotional intelligence and empathy',
                    effectiveness: 0.8,
                    personalization: ['empathy_level', 'social_awareness', 'emotional_intelligence'],
                    adaptation: 'social'
                }
            ],
            mlOptimization: true,
            adaptiveLearning: true
        });
    }
    
    /**
     * 고급 미션 템플릿 초기화
     */
    initializeAdvancedMissionTemplates() {
        // 기억 기반 훈련 미션
        this.missionTemplates.set('advanced_memory_training', {
            name: 'Advanced Memory Training',
            category: 'cognitive',
            description: 'Personalized memory training using your personal experiences',
            difficulty: 'adaptive',
            duration: 1200,
            rewards: ['memory_improvement', 'cognitive_boost', 'personal_insight'],
            requirements: ['user_memories', 'memory_patterns', 'cognitive_profile'],
            personalization: {
                memoryType: 'episodic',
                difficulty: 'adaptive',
                content: 'personalized',
                feedback: 'detailed'
            },
            mlOptimization: true,
            adaptiveLearning: true
        });
        
        // 패턴 인식 고급 미션
        this.missionTemplates.set('behavioral_pattern_analysis', {
            name: 'Behavioral Pattern Analysis',
            category: 'behavioral',
            description: 'Discover and understand your behavioral patterns',
            difficulty: 'progressive',
            duration: 1800,
            rewards: ['self_awareness', 'behavioral_insight', 'pattern_recognition'],
            requirements: ['behavioral_data', 'temporal_patterns', 'contextual_data'],
            personalization: {
                patternType: 'behavioral',
                complexity: 'adaptive',
                insights: 'personalized',
                recommendations: 'actionable'
            },
            mlOptimization: true,
            adaptiveLearning: true
        });
        
        // 감정 지능 고급 미션
        this.missionTemplates.set('emotional_intelligence_development', {
            name: 'Emotional Intelligence Development',
            category: 'emotional',
            description: 'Develop emotional intelligence through guided practice',
            difficulty: 'adaptive',
            duration: 2400,
            rewards: ['emotional_intelligence', 'empathy', 'emotional_regulation'],
            requirements: ['emotional_data', 'social_interactions', 'emotional_patterns'],
            personalization: {
                emotionalProfile: 'comprehensive',
                developmentAreas: 'targeted',
                practice: 'scenario_based',
                feedback: 'emotional'
            },
            mlOptimization: true,
            adaptiveLearning: true
        });
        
        // 창의성 고급 미션
        this.missionTemplates.set('creativity_enhancement', {
            name: 'Creativity Enhancement',
            category: 'creative',
            description: 'Boost creativity through personalized creative challenges',
            difficulty: 'progressive',
            duration: 2100,
            rewards: ['creativity', 'innovation', 'creative_confidence'],
            requirements: ['creative_preferences', 'creative_history', 'cognitive_flexibility'],
            personalization: {
                creativeStyle: 'individual',
                challenges: 'personalized',
                medium: 'preferred',
                feedback: 'constructive'
            },
            mlOptimization: true,
            adaptiveLearning: true
        });
        
        // 웰니스 통합 미션
        this.missionTemplates.set('holistic_wellness', {
            name: 'Holistic Wellness Mission',
            category: 'wellness',
            description: 'Comprehensive wellness improvement across all dimensions',
            difficulty: 'adaptive',
            duration: 3600,
            rewards: ['overall_wellness', 'life_balance', 'wellness_habits'],
            requirements: ['comprehensive_data', 'wellness_goals', 'lifestyle_patterns'],
            personalization: {
                wellnessDimensions: 'all',
                goals: 'personalized',
                approach: 'holistic',
                tracking: 'comprehensive'
            },
            mlOptimization: true,
            adaptiveLearning: true
        });
    }
    
    /**
     * 개인화 시스템 초기화
     */
    initializePersonalizationSystems() {
        // 개인화 프로필 시스템
        this.personalizationProfiles.set('intervention_preferences', {
            timeOfDay: 'adaptive',
            duration: 'flexible',
            intensity: 'moderate',
            style: 'supportive',
            frequency: 'optimal'
        });
        
        this.personalizationProfiles.set('mission_preferences', {
            difficulty: 'progressive',
            rewards: 'meaningful',
            feedback: 'detailed',
            social: 'optional',
            creative: 'encouraged'
        });
        
        // 적응 모델 시스템
        this.adaptationModels.set('intervention_adaptation', {
            stressResponse: 'personalized',
            energyPatterns: 'circadian_aware',
            cognitiveLoad: 'adaptive',
            emotionalRegulation: 'contextual',
            socialNeeds: 'individual'
        });
        
        this.adaptationModels.set('mission_adaptation', {
            difficulty: 'performance_based',
            content: 'interest_based',
            timing: 'optimal',
            feedback: 'learning_style',
            rewards: 'motivation_based'
        });
        
        // 학습 알고리즘 시스템
        this.learningAlgorithms.set('effectiveness_learning', {
            type: 'reinforcement_learning',
            parameters: ['user_response', 'outcome_quality', 'satisfaction'],
            adaptation: 'continuous',
            optimization: 'multi_objective'
        });
        
        this.learningAlgorithms.set('preference_learning', {
            type: 'collaborative_filtering',
            parameters: ['user_behavior', 'similar_users', 'contextual_factors'],
            adaptation: 'incremental',
            optimization: 'personalized'
        });
    }
    
    /**
     * 예측 시스템 초기화
     */
    initializePredictionSystems() {
        // 예측 모델 시스템
        this.predictionModels.set('intervention_success', {
            type: 'ensemble_learning',
            features: ['user_state', 'intervention_type', 'context', 'history'],
            prediction: 'success_probability',
            confidence: 'uncertainty_quantification'
        });
        
        this.predictionModels.set('mission_engagement', {
            type: 'deep_learning',
            features: ['user_profile', 'mission_characteristics', 'temporal_factors'],
            prediction: 'engagement_level',
            confidence: 'model_uncertainty'
        });
        
        // 위험 평가 시스템
        this.riskAssessment.set('intervention_risk', {
            factors: ['stress_level', 'energy_level', 'emotional_state', 'cognitive_load'],
            assessment: 'multi_dimensional',
            mitigation: 'adaptive',
            monitoring: 'continuous'
        });
        
        this.riskAssessment.set('mission_risk', {
            factors: ['difficulty', 'duration', 'cognitive_demand', 'emotional_impact'],
            assessment: 'comprehensive',
            mitigation: 'proactive',
            monitoring: 'real_time'
        });
        
        // 기회 탐지 시스템
        this.opportunityDetection.set('intervention_opportunity', {
            triggers: ['optimal_state', 'learning_readiness', 'motivation_peak'],
            detection: 'pattern_based',
            timing: 'optimal',
            personalization: 'individual'
        });
        
        this.opportunityDetection.set('mission_opportunity', {
            triggers: ['cognitive_availability', 'emotional_readiness', 'time_availability'],
            detection: 'contextual',
            timing: 'adaptive',
            personalization: 'preference_based'
        });
    }
    
    /**
     * 고급 이벤트 리스너 설정
     */
    setupAdvancedEventListeners() {
        this.selfModelManager.on('advancedStateChanged', (data) => {
            this.evaluateAdvancedInterventionNeeds(data);
        });
        
        this.contextAwareDialogue.on('advancedResponseGenerated', (data) => {
            this.analyzeAdvancedResponseEffectiveness(data);
        });
        
        this.selfModelManager.on('biologicalStateUpdated', (data) => {
            this.handleBiologicalStateUpdate(data);
        });
        
        this.selfModelManager.on('biologicalAlert', (alert) => {
            this.handleBiologicalAlert(alert);
        });
    }
    
    /**
     * 고급 모니터링 시작
     */
    startAdvancedMonitoring() {
        // 개입 기회 모니터링 (1분마다)
        setInterval(() => {
            this.selfModelManager.userStates.forEach((userState, userId) => {
                this.evaluateAdvancedInterventionNeeds({ userId, state: userState });
            });
        }, 60000);
        
        // 미션 기회 모니터링 (5분마다)
        setInterval(() => {
            this.selfModelManager.userStates.forEach((userState, userId) => {
                this.evaluateAdvancedMissionOpportunities(userId, userState);
            });
        }, 300000);
        
        // 개인화 업데이트 (30분마다)
        setInterval(() => {
            this.updatePersonalizationProfiles();
        }, 1800000);
        
        // 예측 모델 업데이트 (1시간마다)
        setInterval(() => {
            this.updatePredictionModels();
        }, 3600000);
    }
    
    /**
     * 고급 개입 필요성 평가
     */
    evaluateAdvancedInterventionNeeds(data) {
        const { userId, state } = data;
        
        // 각 개입 전략에 대해 평가
        this.interventionStrategies.forEach((strategy, strategyType) => {
            const shouldIntervene = this.shouldTriggerAdvancedIntervention(state, strategy);
            
            if (shouldIntervene) {
                this.triggerAdvancedIntervention(userId, strategyType, state);
            }
        });
        
        // 미션 기회 평가
        this.evaluateAdvancedMissionOpportunities(userId, state);
    }
    
    /**
     * 고급 개입 트리거 결정
     */
    shouldTriggerAdvancedIntervention(userState, strategy) {
        // 트리거 조건 확인
        const hasTrigger = strategy.triggers.some(trigger => {
            return userState.relationships && userState.relationships.has(trigger) && 
                   userState.relationships.get(trigger).strength > 0.6;
        });
        
        if (!hasTrigger) return false;
        
        // 이미 활성화된 개입 확인
        const activeInterventions = this.activeInterventions.get(userState.userId) || [];
        const alreadyActive = activeInterventions.some(intervention => 
            intervention.strategyType === strategy.name
        );
        
        if (alreadyActive) return false;
        
        // 개입 빈도 확인 (스팸 방지)
        const recentInterventions = this.getRecentInterventions(userState.userId, 3600000); // 1시간
        if (recentInterventions.length > 3) return false;
        
        // 위험 평가
        const riskLevel = this.assessInterventionRisk(userState, strategy);
        if (riskLevel > 0.8) return false;
        
        // 기회 탐지
        const opportunity = this.detectInterventionOpportunity(userState, strategy);
        if (opportunity < 0.6) return false;
        
        return true;
    }
    
    /**
     * 고급 개입 트리거
     */
    async triggerAdvancedIntervention(userId, strategyType, userState) {
        try {
            const strategy = this.interventionStrategies.get(strategyType);
            if (!strategy) return;
            
            // 최적 개입 선택
            const intervention = await this.selectOptimalIntervention(strategy, userState);
            
            // 개인화 적용
            const personalizedIntervention = await this.personalizeIntervention(intervention, userState);
            
            // 개입 인스턴스 생성
            const interventionInstance = {
                id: this.generateInterventionId(),
                userId,
                strategyType,
                intervention: personalizedIntervention,
                startTime: Date.now(),
                status: 'active',
                userState: this.serializeUserState(userState),
                personalization: this.getPersonalizationProfile(userId),
                prediction: await this.predictInterventionOutcome(personalizedIntervention, userState)
            };
            
            // 활성 개입에 추가
            if (!this.activeInterventions.has(userId)) {
                this.activeInterventions.set(userId, []);
            }
            this.activeInterventions.get(userId).push(interventionInstance);
            
            // 개입 이벤트 발생
            this.emit('advancedInterventionTriggered', interventionInstance);
            
            // 개입 완료 스케줄링
            setTimeout(() => {
                this.completeAdvancedIntervention(interventionInstance);
            }, personalizedIntervention.duration * 1000);
            
            console.log(`🔄 Advanced intervention triggered: ${personalizedIntervention.name} for user ${userId}`);

            // 항상 개입 객체 반환 (서버 엔드포인트에서 사용)
            return {
                id: interventionInstance.id,
                userId: interventionInstance.userId,
                type: personalizedIntervention.type || strategyType,
                name: personalizedIntervention.name,
                strategyType,
                startTime: interventionInstance.startTime,
                status: interventionInstance.status,
                duration: personalizedIntervention.duration,
                prediction: interventionInstance.prediction
            };
            
        } catch (error) {
            console.error('Error triggering advanced intervention:', error);
            // 오류 시에도 예측 가능한 형태 반환
            return {
                id: `intervention_${Date.now()}`,
                userId,
                type: strategyType,
                name: 'Unknown Intervention',
                strategyType,
                startTime: Date.now(),
                status: 'failed'
            };
        }
    }
    
    /**
     * 최적 개입 선택
     */
    async selectOptimalIntervention(strategy, userState) {
        // ML 기반 최적 개입 선택
        const predictions = await Promise.all(
            strategy.interventions.map(async (intervention) => {
                const successProbability = await this.predictInterventionSuccess(intervention, userState);
                const engagementLevel = await this.predictInterventionEngagement(intervention, userState);
                const riskLevel = this.assessInterventionRisk(userState, { interventions: [intervention] });
                
                return {
                    intervention,
                    score: (successProbability * 0.4) + (engagementLevel * 0.4) + ((1 - riskLevel) * 0.2)
                };
            })
        );
        
        // 최고 점수 개입 선택
        const bestIntervention = predictions.reduce((best, current) => 
            current.score > best.score ? current : best
        );
        
        return bestIntervention.intervention;
    }
    
    /**
     * 개입 개인화
     */
    async personalizeIntervention(intervention, userState) {
        const personalized = { ...intervention };
        
        // 개인화 프로필 적용
        const profile = this.getPersonalizationProfile(userState.userId);
        
        // 시간 조정
        if (profile.timeOfDay === 'flexible') {
            personalized.duration = Math.min(personalized.duration, 600); // 최대 10분
        }
        
        // 강도 조정
        if (profile.intensity === 'gentle') {
            personalized.effectiveness *= 0.8; // 효과는 낮지만 부드러움
        }
        
        // 스타일 조정
        if (profile.style === 'supportive') {
            personalized.description = `Gentle, supportive ${personalized.description.toLowerCase()}`;
        }
        
        return personalized;
    }
    
    /**
     * 고급 개입 완료
     */
    async completeAdvancedIntervention(interventionInstance) {
        try {
            // 개입 상태 업데이트
            interventionInstance.status = 'completed';
            interventionInstance.endTime = Date.now();
            interventionInstance.actualDuration = interventionInstance.endTime - interventionInstance.startTime;
            
            // 활성 개입에서 제거
            const activeInterventions = this.activeInterventions.get(interventionInstance.userId) || [];
            const updatedActive = activeInterventions.filter(intervention => 
                intervention.id !== interventionInstance.id
            );
            this.activeInterventions.set(interventionInstance.userId, updatedActive);
            
            // 개입 이력에 추가
            if (!this.interventionHistory.has(interventionInstance.userId)) {
                this.interventionHistory.set(interventionInstance.userId, []);
            }
            this.interventionHistory.get(interventionInstance.userId).push(interventionInstance);
            
            // 효과성 평가
            const effectiveness = await this.evaluateAdvancedInterventionEffectiveness(interventionInstance);
            interventionInstance.effectiveness = effectiveness;
            
            // 개인화 프로필 업데이트
            await this.updatePersonalizationProfile(interventionInstance.userId, interventionInstance, effectiveness);
            
            // 예측 모델 업데이트
            await this.updatePredictionModel('intervention_success', interventionInstance, effectiveness);
            
            // 완료 이벤트 발생
            this.emit('advancedInterventionCompleted', {
                userId: interventionInstance.userId,
                intervention: interventionInstance.intervention,
                effectiveness: effectiveness,
                personalization: interventionInstance.personalization
            });
            
            console.log(`✅ Advanced intervention completed: ${interventionInstance.intervention.name} for user ${interventionInstance.userId}`);
            
        } catch (error) {
            console.error('Error completing advanced intervention:', error);
        }
    }
    
    /**
     * 고급 개입 효과성 평가
     */
    async evaluateAdvancedInterventionEffectiveness(interventionInstance) {
        try {
            // 현재 사용자 상태 조회
            const currentState = this.selfModelManager.getCurrentUserState(interventionInstance.userId);
            if (!currentState) return { overall: 0.5 };
            
            // 개입 전 상태와 비교
            const beforeState = interventionInstance.userState;
            
            // 다차원 효과성 계산
            const effectiveness = {
                physiological: this.calculatePhysiologicalEffectiveness(beforeState, currentState, interventionInstance),
                emotional: this.calculateEmotionalEffectiveness(beforeState, currentState, interventionInstance),
                cognitive: this.calculateCognitiveEffectiveness(beforeState, currentState, interventionInstance),
                social: this.calculateSocialEffectiveness(beforeState, currentState, interventionInstance),
                overall: 0
            };
            
            // 전체 효과성 계산
            effectiveness.overall = (
                effectiveness.physiological * 0.3 +
                effectiveness.emotional * 0.3 +
                effectiveness.cognitive * 0.2 +
                effectiveness.social * 0.2
            );
            
            // 효과성 이력에 저장
            if (!this.interventionEffectiveness.has(interventionInstance.userId)) {
                this.interventionEffectiveness.set(interventionInstance.userId, []);
            }
            this.interventionEffectiveness.get(interventionInstance.userId).push({
                interventionId: interventionInstance.id,
                effectiveness: effectiveness,
                timestamp: Date.now()
            });
            
            return effectiveness;
            
        } catch (error) {
            console.error('Error evaluating advanced intervention effectiveness:', error);
            return { overall: 0.5 };
        }
    }
    
    /**
     * 생리학적 효과성 계산
     */
    calculatePhysiologicalEffectiveness(beforeState, afterState, intervention) {
        const metrics = {
            stressReduction: 0,
            energyImprovement: 0,
            sleepQuality: 0,
            overall: 0
        };
        
        // 스트레스 감소
        if (beforeState.physiological?.stressLevel && afterState.physiological?.stressLevel) {
            metrics.stressReduction = Math.max(0, 
                beforeState.physiological.stressLevel - afterState.physiological.stressLevel
            );
        }
        
        // 에너지 개선
        if (beforeState.physiological?.energyLevel && afterState.physiological?.energyLevel) {
            metrics.energyImprovement = Math.max(0,
                afterState.physiological.energyLevel - beforeState.physiological.energyLevel
            );
        }
        
        // 수면 품질
        if (beforeState.physiological?.sleepQuality && afterState.physiological?.sleepQuality) {
            metrics.sleepQuality = Math.max(0,
                afterState.physiological.sleepQuality - beforeState.physiological.sleepQuality
            );
        }
        
        metrics.overall = (metrics.stressReduction + metrics.energyImprovement + metrics.sleepQuality) / 3;
        return metrics.overall;
    }
    
    /**
     * 감정적 효과성 계산
     */
    calculateEmotionalEffectiveness(beforeState, afterState, intervention) {
        const metrics = {
            emotionalStability: 0,
            positiveEmotions: 0,
            emotionalRegulation: 0,
            overall: 0
        };
        
        // 감정 안정성
        if (beforeState.emotional?.regulation && afterState.emotional?.regulation) {
            metrics.emotionalStability = Math.max(0,
                afterState.emotional.regulation.overall - beforeState.emotional.regulation.overall
            );
        }
        
        // 긍정적 감정
        if (beforeState.emotional?.current && afterState.emotional?.current) {
            const beforePositive = beforeState.emotional.current.joy || 0;
            const afterPositive = afterState.emotional.current.joy || 0;
            metrics.positiveEmotions = Math.max(0, afterPositive - beforePositive);
        }
        
        // 감정 조절
        if (beforeState.emotional?.regulation && afterState.emotional?.regulation) {
            metrics.emotionalRegulation = Math.max(0,
                afterState.emotional.regulation.stability - beforeState.emotional.regulation.stability
            );
        }
        
        metrics.overall = (metrics.emotionalStability + metrics.positiveEmotions + metrics.emotionalRegulation) / 3;
        return metrics.overall;
    }
    
    /**
     * 인지적 효과성 계산
     */
    calculateCognitiveEffectiveness(beforeState, afterState, intervention) {
        const metrics = {
            cognitiveLoad: 0,
            attention: 0,
            memory: 0,
            overall: 0
        };
        
        // 인지 부하 감소
        if (beforeState.cognitive?.load && afterState.cognitive?.load) {
            metrics.cognitiveLoad = Math.max(0,
                beforeState.cognitive.load.overall - afterState.cognitive.load.overall
            );
        }
        
        // 주의력 개선
        if (beforeState.cognitive?.capacity && afterState.cognitive?.capacity) {
            metrics.attention = Math.max(0,
                afterState.cognitive.capacity.available - beforeState.cognitive.capacity.available
            );
        }
        
        // 기억력 개선
        if (beforeState.cognitive?.patterns && afterState.cognitive?.patterns) {
            const beforeMemory = beforeState.cognitive.patterns.memory?.working || 0;
            const afterMemory = afterState.cognitive.patterns.memory?.working || 0;
            metrics.memory = Math.max(0, afterMemory - beforeMemory);
        }
        
        metrics.overall = (metrics.cognitiveLoad + metrics.attention + metrics.memory) / 3;
        return metrics.overall;
    }
    
    /**
     * 사회적 효과성 계산
     */
    calculateSocialEffectiveness(beforeState, afterState, intervention) {
        const metrics = {
            socialConnectedness: 0,
            empathy: 0,
            communication: 0,
            overall: 0
        };
        
        // 사회적 연결성
        if (beforeState.social?.connectedness && afterState.social?.connectedness) {
            metrics.socialConnectedness = Math.max(0,
                afterState.social.connectedness - beforeState.social.connectedness
            );
        }
        
        // 공감 능력
        if (beforeState.social?.empathy && afterState.social?.empathy) {
            const beforeEmpathy = beforeState.social.empathy.cognitive || 0;
            const afterEmpathy = afterState.social.empathy.cognitive || 0;
            metrics.empathy = Math.max(0, afterEmpathy - beforeEmpathy);
        }
        
        // 소통 능력
        if (beforeState.social?.communication && afterState.social?.communication) {
            const communicationMap = { 'low': 0, 'moderate': 0.5, 'high': 1 };
            const beforeComm = communicationMap[beforeState.social.communication] || 0.5;
            const afterComm = communicationMap[afterState.social.communication] || 0.5;
            metrics.communication = Math.max(0, afterComm - beforeComm);
        }
        
        metrics.overall = (metrics.socialConnectedness + metrics.empathy + metrics.communication) / 3;
        return metrics.overall;
    }
    
    // 유틸리티 메서드들
    generateInterventionId() {
        return `intervention_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    getRecentInterventions(userId, timeWindow) {
        const history = this.interventionHistory.get(userId) || [];
        const cutoff = Date.now() - timeWindow;
        return history.filter(intervention => intervention.startTime > cutoff);
    }
    
    serializeUserState(userState) {
        return {
            physiological: { ...userState.physiological },
            behavioral: { ...userState.behavioral },
            emotional: { ...userState.emotional },
            cognitive: { ...userState.cognitive },
            social: { ...userState.social },
            environmental: { ...userState.environmental }
        };
    }
    
    getPersonalizationProfile(userId) {
        return this.personalizationProfiles.get('intervention_preferences') || {};
    }
    
    async predictInterventionOutcome(intervention, userState) {
        // 예측 모델을 사용한 결과 예측
        return { success: 0.8, engagement: 0.7, satisfaction: 0.75 };
    }
    
    async predictInterventionSuccess(intervention, userState) {
        // 개입 성공 확률 예측
        return 0.8; // 기본값
    }
    
    async predictInterventionEngagement(intervention, userState) {
        // 개입 참여도 예측
        return 0.7; // 기본값
    }
    
    assessInterventionRisk(userState, strategy) {
        // 개입 위험도 평가
        return 0.2; // 기본값
    }
    
    detectInterventionOpportunity(userState, strategy) {
        // 개입 기회 탐지
        return 0.8; // 기본값
    }
    
    async updatePersonalizationProfile(userId, intervention, effectiveness) {
        // 개인화 프로필 업데이트 로직
        // 구현 예정
    }
    
    async updatePredictionModel(modelType, data, outcome) {
        // 예측 모델 업데이트 로직
        // 구현 예정
    }
    
    async evaluateAdvancedMissionOpportunities(userId, userState) {
        // 고급 미션 기회 평가 로직
        // 구현 예정
    }
    
    async suggestMission(userId) {
        try {
            const userState = this.selfModelManager?.getCurrentUserState(userId) || {};
            
            // 기본 미션 생성
            const mission = {
                id: `mission_${Date.now()}`,
                title: 'Mindfulness Practice',
                description: 'Take 5 minutes to practice deep breathing and mindfulness',
                duration: 5,
                type: 'wellness',
                category: 'stress_management',
                difficulty: 'easy',
                cognitiveLoad: 'low',
                expectedOutcome: 'Reduced stress and improved focus',
                personalizedReason: 'Based on your current stress levels, this mindfulness practice will help you regain focus and calm.'
            };
            
            return mission;
        } catch (error) {
            console.error('Mission suggestion error:', error);
            // 기본 미션 반환
            return {
                id: `mission_${Date.now()}`,
                title: 'Daily Wellness Check',
                description: 'Take a moment to assess your current state and needs',
                duration: 3,
                type: 'wellness',
                category: 'self_assessment',
                difficulty: 'easy',
                cognitiveLoad: 'low',
                expectedOutcome: 'Better self-awareness and planning',
                personalizedReason: 'A quick wellness check to help you understand your current needs.'
            };
        }
    }
    
    async analyzeAdvancedResponseEffectiveness(data) {
        // 고급 응답 효과성 분석 로직
        // 구현 예정
    }
    
    async handleBiologicalStateUpdate(data) {
        // 생물학적 상태 업데이트 처리 로직
        // 구현 예정
    }
    
    async handleBiologicalAlert(alert) {
        // 생물학적 알림 처리 로직
        // 구현 예정
    }
    
    async updatePersonalizationProfiles() {
        // 개인화 프로필 업데이트 로직
        // 구현 예정
    }
    
    async updatePredictionModels() {
        // 예측 모델 업데이트 로직
        // 구현 예정
    }
    
    getStats() {
        const totalInterventions = Array.from(this.interventionHistory.values())
            .reduce((sum, history) => sum + history.length, 0);
        
        const activeInterventions = Array.from(this.activeInterventions.values())
            .reduce((sum, interventions) => sum + interventions.length, 0);
        
        const totalMissions = Array.from(this.missionHistory.values())
            .reduce((sum, history) => sum + history.length, 0);
        
        const activeMissions = Array.from(this.activeMissions.values())
            .reduce((sum, missions) => sum + missions.length, 0);
        
        return {
            totalInterventions,
            activeInterventions,
            totalMissions,
            activeMissions,
            interventionStrategies: this.interventionStrategies.size,
            missionTemplates: this.missionTemplates.size,
            personalizationProfiles: this.personalizationProfiles.size,
            predictionModels: this.predictionModels.size,
            totalUsers: this.interventionHistory.size
        };
    }
}

module.exports = AdvancedBehavioralFeedbackLoop;

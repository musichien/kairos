/**
 * Consciousness Machine Learning Engine
 * 
 * 고도화된 의식 시스템을 위한 머신러닝 엔진
 * 사용자 상태 예측, 개입 효과성 최적화, 적응적 학습을 제공합니다.
 */

const EventEmitter = require('events');

class ConsciousnessMLEngine extends EventEmitter {
    constructor(selfModelManager, contextAwareDialogue, behavioralFeedbackLoop) {
        super();
        this.selfModelManager = selfModelManager;
        this.contextAwareDialogue = contextAwareDialogue;
        this.behavioralFeedbackLoop = behavioralFeedbackLoop;
        
        // ML 모델 저장소
        this.models = new Map();
        this.trainingData = new Map(); // userId -> training data
        this.predictionCache = new Map(); // userId -> predictions
        
        // 모델 초기화
        this.initializeModels();
        this.startContinuousLearning();
        
        console.log('🤖 Consciousness ML Engine initialized');
    }

    /**
     * ML 모델 초기화
     */
    initializeModels() {
        // 1. 사용자 상태 예측 모델
        this.models.set('statePrediction', {
            name: 'User State Prediction Model',
            type: 'regression',
            features: [
                'heartRate', 'sleepDuration', 'steps', 'stressLevel', 'energyLevel',
                'dialogueTone', 'emotionalState', 'attentionLevel',
                'sessionLength', 'timeOfDay', 'currentActivity'
            ],
            target: 'nextState',
            accuracy: 0.0,
            lastTrained: null,
            predictions: new Map()
        });

        // 2. 개입 효과성 예측 모델
        this.models.set('interventionEffectiveness', {
            name: 'Intervention Effectiveness Prediction Model',
            type: 'classification',
            features: [
                'userStressLevel', 'userEnergyLevel', 'interventionType',
                'timeOfDay', 'sessionLength', 'previousInterventionSuccess'
            ],
            target: 'effectiveness',
            accuracy: 0.0,
            lastTrained: null,
            predictions: new Map()
        });

        // 3. 맥락적 응답 품질 예측 모델
        this.models.set('responseQuality', {
            name: 'Contextual Response Quality Prediction Model',
            type: 'regression',
            features: [
                'userState', 'queryComplexity', 'emotionalContext',
                'relationshipStrength', 'temporalContext'
            ],
            target: 'responseQuality',
            accuracy: 0.0,
            lastTrained: null,
            predictions: new Map()
        });

        // 4. 적응적 학습 모델
        this.models.set('adaptiveLearning', {
            name: 'Adaptive Learning Model',
            type: 'reinforcement',
            features: [
                'userFeedback', 'interventionOutcome', 'stateChange',
                'timeSinceLastIntervention', 'userEngagement'
            ],
            target: 'learningReward',
            accuracy: 0.0,
            lastTrained: null,
            predictions: new Map()
        });
    }

    /**
     * 지속적인 학습 시작
     */
    startContinuousLearning() {
        // 5분마다 모델 재훈련
        setInterval(() => {
            this.retrainModels();
        }, 300000);
        
        // 1분마다 예측 업데이트
        setInterval(() => {
            this.updatePredictions();
        }, 60000);
    }

    /**
     * 사용자 상태 예측
     */
    async predictUserState(userId, timeHorizon = 300000) { // 5분 후
        try {
            const currentState = this.selfModelManager.getCurrentUserState(userId);
            if (!currentState) return null;

            const features = this.extractStateFeatures(currentState);
            const prediction = await this.predictWithModel('statePrediction', features);
            
            if (prediction) {
                const predictedState = this.interpretStatePrediction(prediction, currentState);
                
                // 예측 캐시 업데이트
                this.predictionCache.set(userId, {
                    timestamp: Date.now(),
                    timeHorizon,
                    predictedState,
                    confidence: prediction.confidence || 0.5
                });
                
                this.emit('statePredicted', { userId, prediction: predictedState });
                return predictedState;
            }
            
            return null;
        } catch (error) {
            console.error('State prediction error:', error);
            return null;
        }
    }

    /**
     * 개입 효과성 예측
     */
    async predictInterventionEffectiveness(userId, interventionType) {
        try {
            const currentState = this.selfModelManager.getCurrentUserState(userId);
            if (!currentState) return null;

            const features = this.extractInterventionFeatures(currentState, interventionType);
            const prediction = await this.predictWithModel('interventionEffectiveness', features);
            
            if (prediction) {
                const effectiveness = {
                    interventionType,
                    predictedEffectiveness: prediction.effectiveness || 0.5,
                    confidence: prediction.confidence || 0.5,
                    factors: prediction.factors || []
                };
                
                this.emit('interventionEffectivenessPredicted', { userId, effectiveness });
                return effectiveness;
            }
            
            return null;
        } catch (error) {
            console.error('Intervention effectiveness prediction error:', error);
            return null;
        }
    }

    /**
     * 맥락적 응답 품질 예측
     */
    async predictResponseQuality(userId, userQuery, baseResponse) {
        try {
            const currentState = this.selfModelManager.getCurrentUserState(userId);
            if (!currentState) return null;

            const features = this.extractResponseFeatures(currentState, userQuery, baseResponse);
            const prediction = await this.predictWithModel('responseQuality', features);
            
            if (prediction) {
                const quality = {
                    predictedQuality: prediction.quality || 0.5,
                    confidence: prediction.confidence || 0.5,
                    improvements: prediction.improvements || []
                };
                
                this.emit('responseQualityPredicted', { userId, quality });
                return quality;
            }
            
            return null;
        } catch (error) {
            console.error('Response quality prediction error:', error);
            return null;
        }
    }

    /**
     * 적응적 학습 업데이트
     */
    async updateAdaptiveLearning(userId, feedback) {
        try {
            const currentState = this.selfModelManager.getCurrentUserState(userId);
            if (!currentState) return null;

            const features = this.extractLearningFeatures(currentState, feedback);
            const learningUpdate = await this.predictWithModel('adaptiveLearning', features);
            
            if (learningUpdate) {
                // 학습 데이터 업데이트
                this.updateTrainingData(userId, features, learningUpdate);
                
                this.emit('adaptiveLearningUpdated', { userId, learningUpdate });
                return learningUpdate;
            }
            
            return null;
        } catch (error) {
            console.error('Adaptive learning update error:', error);
            return null;
        }
    }

    // 특성 추출 메서드들
    extractStateFeatures(userState) {
        return {
            heartRate: userState.physiological.heartRate || 70,
            sleepDuration: userState.physiological.sleepDuration || 7,
            steps: userState.physiological.steps || 5000,
            stressLevel: userState.physiological.stressLevel || 0.5,
            energyLevel: userState.physiological.energyLevel || 0.5,
            dialogueTone: this.encodeDialogueTone(userState.behavioral.dialogueTone),
            emotionalState: this.encodeEmotionalState(userState.behavioral.emotionalState),
            attentionLevel: this.encodeAttentionLevel(userState.behavioral.attentionLevel),
            sessionLength: userState.behavioral.usagePatterns.sessionLength || 0,
            timeOfDay: this.encodeTimeOfDay(userState.contextual.temporalContext),
            currentActivity: this.encodeActivity(userState.contextual.currentActivity),
            relationshipCount: userState.relationships.length,
            selfAwarenessConfidence: userState.selfAwareness.confidence || 0.5
        };
    }

    extractInterventionFeatures(userState, interventionType) {
        return {
            userStressLevel: userState.physiological.stressLevel || 0.5,
            userEnergyLevel: userState.physiological.energyLevel || 0.5,
            interventionType: this.encodeInterventionType(interventionType),
            timeOfDay: this.encodeTimeOfDay(userState.contextual.temporalContext),
            sessionLength: userState.behavioral.usagePatterns.sessionLength || 0,
            previousInterventionSuccess: this.getPreviousInterventionSuccess(userState.userId),
            emotionalState: this.encodeEmotionalState(userState.behavioral.emotionalState),
            attentionLevel: this.encodeAttentionLevel(userState.behavioral.attentionLevel)
        };
    }

    extractResponseFeatures(userState, userQuery, baseResponse) {
        return {
            userState: this.extractStateFeatures(userState),
            queryComplexity: this.calculateQueryComplexity(userQuery),
            emotionalContext: this.detectEmotionalContext(userQuery),
            relationshipStrength: this.calculateAverageRelationshipStrength(userState),
            temporalContext: this.encodeTimeOfDay(userState.contextual.temporalContext),
            responseLength: baseResponse.length,
            userEngagement: this.calculateUserEngagement(userState)
        };
    }

    extractLearningFeatures(userState, feedback) {
        return {
            userFeedback: this.encodeFeedback(feedback),
            interventionOutcome: feedback.outcome || 'neutral',
            stateChange: this.calculateStateChange(userState, feedback.previousState),
            timeSinceLastIntervention: feedback.timeSinceLastIntervention || 0,
            userEngagement: this.calculateUserEngagement(userState),
            currentStressLevel: userState.physiological.stressLevel || 0.5,
            currentEnergyLevel: userState.physiological.energyLevel || 0.5
        };
    }

    // 인코딩 메서드들
    encodeDialogueTone(tone) {
        const toneMap = { 'positive': 1, 'neutral': 0, 'stressed': -1, 'negative': -0.5 };
        return toneMap[tone] || 0;
    }

    encodeEmotionalState(emotion) {
        const emotionMap = {
            'excited': 1, 'happy': 0.8, 'calm': 0.5, 'neutral': 0,
            'tired': -0.3, 'stressed': -0.7, 'anxious': -0.8, 'sad': -1
        };
        return emotionMap[emotion] || 0;
    }

    encodeAttentionLevel(attention) {
        const attentionMap = { 'hyperfocused': 1, 'focused': 0.5, 'distracted': -0.5, 'unfocused': -1 };
        return attentionMap[attention] || 0;
    }

    encodeTimeOfDay(timeContext) {
        const timeMap = { 'morning': 0.2, 'afternoon': 0.5, 'evening': 0.8, 'late_night': 1 };
        return timeMap[timeContext] || 0.5;
    }

    encodeActivity(activity) {
        const activityMap = {
            'work': 0.8, 'exercise': 0.6, 'social': 0.4, 'relaxation': 0.2,
            'sleep': 0, 'unknown': 0.5
        };
        return activityMap[activity] || 0.5;
    }

    encodeInterventionType(interventionType) {
        const interventionMap = {
            'stress_management': 0, 'energy_boost': 1, 'focus_enhancement': 2,
            'sleep_optimization': 3, 'proactive_dialogue': 4
        };
        return interventionMap[interventionType] || 0;
    }

    encodeFeedback(feedback) {
        const feedbackMap = { 'positive': 1, 'neutral': 0, 'negative': -1 };
        return feedbackMap[feedback.type] || 0;
    }

    // 계산 메서드들
    calculateQueryComplexity(query) {
        const words = query.split(' ').length;
        const sentences = query.split(/[.!?]+/).length;
        const avgWordsPerSentence = words / sentences;
        
        // 복잡도 점수 (0-1)
        return Math.min(1, avgWordsPerSentence / 20);
    }

    detectEmotionalContext(query) {
        const emotionalWords = {
            positive: ['good', 'great', 'excellent', 'happy', 'excited', 'love'],
            negative: ['bad', 'terrible', 'awful', 'sad', 'angry', 'hate', 'stressed'],
            neutral: ['okay', 'fine', 'normal', 'average']
        };
        
        const lowerQuery = query.toLowerCase();
        let maxScore = 0;
        let dominantEmotion = 'neutral';
        
        Object.keys(emotionalWords).forEach(emotion => {
            let score = 0;
            emotionalWords[emotion].forEach(word => {
                if (lowerQuery.includes(word)) score++;
            });
            
            if (score > maxScore) {
                maxScore = score;
                dominantEmotion = emotion;
            }
        });
        
        return this.encodeEmotionalState(dominantEmotion);
    }

    calculateAverageRelationshipStrength(userState) {
        // relationships can be Array of [key, value] or a Map
        const rels = Array.isArray(userState.relationships)
            ? userState.relationships.map(([key, value]) => value)
            : (userState.relationships && typeof userState.relationships.forEach === 'function'
                ? Array.from(userState.relationships.values())
                : []);
        if (rels.length === 0) return 0;
        const totalStrength = rels.reduce((sum, rel) => sum + (rel.strength || 0), 0);
        return totalStrength / rels.length;
    }

    calculateUserEngagement(userState) {
        const sessionLength = userState.behavioral.usagePatterns.sessionLength || 0;
        const frequentCommands = userState.behavioral.usagePatterns.frequentCommands.length;
        
        // 세션 길이와 명령어 사용 빈도 기반 참여도 계산
        const sessionEngagement = Math.min(1, sessionLength / 3600); // 1시간 기준
        const commandEngagement = Math.min(1, frequentCommands / 10); // 10개 명령어 기준
        
        return (sessionEngagement + commandEngagement) / 2;
    }

    getPreviousInterventionSuccess(userId) {
        const interventionHistory = this.behavioralFeedbackLoop.interventionHistory.get(userId) || [];
        if (interventionHistory.length === 0) return 0.5;
        
        const recentInterventions = interventionHistory.slice(-5);
        let totalSuccess = 0;
        
        recentInterventions.forEach(intervention => {
            if (intervention.effectiveness) {
                totalSuccess += intervention.effectiveness.overall;
            }
        });
        
        return totalSuccess / recentInterventions.length;
    }

    calculateStateChange(currentState, previousState) {
        if (!previousState) return 0;
        
        const currentStress = currentState.physiological.stressLevel || 0.5;
        const previousStress = previousState.physiological.stressLevel || 0.5;
        const stressChange = Math.abs(currentStress - previousStress);
        
        const currentEnergy = currentState.physiological.energyLevel || 0.5;
        const previousEnergy = previousState.physiological.energyLevel || 0.5;
        const energyChange = Math.abs(currentEnergy - previousEnergy);
        
        return (stressChange + energyChange) / 2;
    }

    // 모델 예측 메서드
    async predictWithModel(modelName, features) {
        const model = this.models.get(modelName);
        if (!model) return null;

        // 실제 ML 모델 대신 휴리스틱 기반 예측 구현
        // 실제 환경에서는 TensorFlow.js, ML5.js 등을 사용할 수 있습니다
        return this.heuristicPrediction(model, features);
    }

    heuristicPrediction(model, features) {
        switch (model.name) {
            case 'User State Prediction Model':
                return this.predictUserStateHeuristic(features);
            case 'Intervention Effectiveness Prediction Model':
                return this.predictInterventionEffectivenessHeuristic(features);
            case 'Contextual Response Quality Prediction Model':
                return this.predictResponseQualityHeuristic(features);
            case 'Adaptive Learning Model':
                return this.predictAdaptiveLearningHeuristic(features);
            default:
                return { confidence: 0.5, prediction: 0.5 };
        }
    }

    predictUserStateHeuristic(features) {
        // 사용자 상태 예측 휴리스틱
        const stressTrend = this.calculateStressTrend(features);
        const energyTrend = this.calculateEnergyTrend(features);
        const attentionTrend = this.calculateAttentionTrend(features);
        
        return {
            predictedStress: Math.max(0, Math.min(1, features.stressLevel + stressTrend)),
            predictedEnergy: Math.max(0, Math.min(1, features.energyLevel + energyTrend)),
            predictedAttention: Math.max(-1, Math.min(1, features.attentionLevel + attentionTrend)),
            confidence: 0.7
        };
    }

    predictInterventionEffectivenessHeuristic(features) {
        // 개입 효과성 예측 휴리스틱
        let effectiveness = 0.5;
        
        // 스트레스 관리 개입
        if (features.interventionType === 0 && features.userStressLevel > 0.7) {
            effectiveness = 0.8;
        }
        
        // 에너지 부스트 개입
        if (features.interventionType === 1 && features.userEnergyLevel < 0.3) {
            effectiveness = 0.7;
        }
        
        // 집중력 향상 개입
        if (features.interventionType === 2 && features.attentionLevel < 0) {
            effectiveness = 0.6;
        }
        
        // 시간대 조정
        if (features.timeOfDay > 0.8) { // 늦은 시간
            effectiveness *= 0.8;
        }
        
        return {
            effectiveness,
            confidence: 0.6,
            factors: ['user_state_match', 'time_appropriateness']
        };
    }

    predictResponseQualityHeuristic(features) {
        // 응답 품질 예측 휴리스틱
        let quality = 0.5;
        
        // 사용자 상태와의 일치도
        const stateMatch = this.calculateStateMatch(features.userState);
        quality += stateMatch * 0.3;
        
        // 쿼리 복잡도 적절성
        const complexityMatch = this.calculateComplexityMatch(features.queryComplexity);
        quality += complexityMatch * 0.2;
        
        // 감정적 맥락 일치도
        const emotionalMatch = this.calculateEmotionalMatch(features.emotionalContext);
        quality += emotionalMatch * 0.3;
        
        // 관계 강도
        quality += features.relationshipStrength * 0.2;
        
        return {
            quality: Math.max(0, Math.min(1, quality)),
            confidence: 0.7,
            improvements: this.suggestResponseImprovements(features)
        };
    }

    predictAdaptiveLearningHeuristic(features) {
        // 적응적 학습 예측 휴리스틱
        let learningReward = 0;
        
        // 피드백 기반 학습
        if (features.userFeedback > 0) {
            learningReward += 0.3;
        } else if (features.userFeedback < 0) {
            learningReward -= 0.2;
        }
        
        // 개입 결과 기반 학습
        if (features.interventionOutcome === 'positive') {
            learningReward += 0.4;
        } else if (features.interventionOutcome === 'negative') {
            learningReward -= 0.3;
        }
        
        // 상태 변화 기반 학습
        learningReward += features.stateChange * 0.3;
        
        return {
            learningReward: Math.max(-1, Math.min(1, learningReward)),
            confidence: 0.6,
            adaptation: this.calculateAdaptation(features)
        };
    }

    // 휴리스틱 계산 메서드들
    calculateStressTrend(features) {
        // 스트레스 트렌드 계산
        const timeFactor = features.timeOfDay > 0.8 ? 0.1 : -0.05; // 늦은 시간 스트레스 증가
        const sessionFactor = features.sessionLength > 1800 ? 0.1 : -0.05; // 긴 세션 스트레스 증가
        return timeFactor + sessionFactor;
    }

    calculateEnergyTrend(features) {
        // 에너지 트렌드 계산
        const sleepFactor = features.sleepDuration < 6 ? -0.2 : 0.1;
        const timeFactor = features.timeOfDay > 0.8 ? -0.1 : 0.05;
        return sleepFactor + timeFactor;
    }

    calculateAttentionTrend(features) {
        // 주의력 트렌드 계산
        const stressFactor = features.stressLevel > 0.7 ? -0.3 : 0.1;
        const energyFactor = features.energyLevel < 0.3 ? -0.2 : 0.1;
        return stressFactor + energyFactor;
    }

    calculateStateMatch(userState) {
        // 사용자 상태 일치도 계산
        const coherence = userState.selfAwarenessConfidence || 0.5;
        const relationshipCount = userState.relationshipCount || 0;
        return (coherence + Math.min(1, relationshipCount / 5)) / 2;
    }

    calculateComplexityMatch(complexity) {
        // 복잡도 일치도 계산
        return 1 - Math.abs(complexity - 0.5) * 2;
    }

    calculateEmotionalMatch(emotionalContext) {
        // 감정적 맥락 일치도 계산
        return 1 - Math.abs(emotionalContext);
    }

    suggestResponseImprovements(features) {
        const improvements = [];
        
        if (features.relationshipStrength < 0.5) {
            improvements.push('Strengthen user state relationships');
        }
        
        if (features.emotionalContext < -0.5) {
            improvements.push('Add more empathetic language');
        }
        
        if (features.queryComplexity > 0.7) {
            improvements.push('Simplify response complexity');
        }
        
        return improvements;
    }

    calculateAdaptation(features) {
        // 적응 계산
        const adaptation = {
            interventionStrategy: features.userFeedback > 0 ? 'continue' : 'modify',
            timingAdjustment: features.timeSinceLastIntervention > 3600000 ? 'reduce' : 'maintain',
            intensityAdjustment: features.userEngagement > 0.7 ? 'increase' : 'decrease'
        };
        
        return adaptation;
    }

    // 모델 재훈련
    async retrainModels() {
        try {
            for (const [modelName, model] of this.models) {
                const trainingData = this.collectTrainingData(modelName);
                if (trainingData.length > 10) { // 최소 10개 데이터 필요
                    const accuracy = await this.trainModel(model, trainingData);
                    model.accuracy = accuracy;
                    model.lastTrained = Date.now();
                    
                    this.emit('modelRetrained', { modelName, accuracy });
                }
            }
        } catch (error) {
            console.error('Model retraining error:', error);
        }
    }

    collectTrainingData(modelName) {
        const trainingData = [];
        
        this.trainingData.forEach((userData, userId) => {
            userData.forEach(entry => {
                if (entry.modelName === modelName) {
                    trainingData.push(entry);
                }
            });
        });
        
        return trainingData;
    }

    async trainModel(model, trainingData) {
        // 실제 ML 훈련 대신 휴리스틱 기반 정확도 계산
        // 실제 환경에서는 TensorFlow.js 등을 사용
        return this.calculateHeuristicAccuracy(model, trainingData);
    }

    calculateHeuristicAccuracy(model, trainingData) {
        // 휴리스틱 기반 정확도 계산
        let correctPredictions = 0;
        
        trainingData.forEach(entry => {
            const prediction = this.heuristicPrediction(model, entry.features);
            const actual = entry.target;
            
            if (this.isPredictionCorrect(prediction, actual, model.type)) {
                correctPredictions++;
            }
        });
        
        return trainingData.length > 0 ? correctPredictions / trainingData.length : 0;
    }

    isPredictionCorrect(prediction, actual, modelType) {
        if (modelType === 'classification') {
            return Math.abs(prediction.effectiveness - actual) < 0.2;
        } else if (modelType === 'regression') {
            return Math.abs(prediction.predictedStress - actual.stressLevel) < 0.2;
        }
        return false;
    }

    updateTrainingData(userId, features, target) {
        if (!this.trainingData.has(userId)) {
            this.trainingData.set(userId, []);
        }
        
        const userData = this.trainingData.get(userId);
        userData.push({
            timestamp: Date.now(),
            features,
            target,
            modelName: 'adaptiveLearning'
        });
        
        // 최대 100개 데이터 유지
        if (userData.length > 100) {
            userData.shift();
        }
    }

    updatePredictions() {
        this.selfModelManager.userStates.forEach((userState, userId) => {
            this.predictUserState(userId);
        });
    }

    interpretStatePrediction(prediction, currentState) {
        return {
            physiological: {
                ...currentState.physiological,
                stressLevel: prediction.predictedStress,
                energyLevel: prediction.predictedEnergy
            },
            behavioral: {
                ...currentState.behavioral,
                attentionLevel: this.decodeAttentionLevel(prediction.predictedAttention)
            },
            confidence: prediction.confidence
        };
    }

    decodeAttentionLevel(attentionScore) {
        if (attentionScore > 0.5) return 'hyperfocused';
        if (attentionScore > 0) return 'focused';
        if (attentionScore > -0.5) return 'distracted';
        return 'unfocused';
    }

    /**
     * ML 엔진 통계 조회
     */
    getMLStats() {
        const stats = {
            models: {},
            totalPredictions: 0,
            averageAccuracy: 0,
            trainingDataSize: 0
        };
        
        let totalAccuracy = 0;
        let modelCount = 0;
        
        this.models.forEach((model, modelName) => {
            stats.models[modelName] = {
                accuracy: model.accuracy,
                lastTrained: model.lastTrained,
                predictionCount: model.predictions.size
            };
            
            totalAccuracy += model.accuracy;
            modelCount++;
            stats.totalPredictions += model.predictions.size;
        });
        
        stats.averageAccuracy = modelCount > 0 ? totalAccuracy / modelCount : 0;
        
        this.trainingData.forEach(userData => {
            stats.trainingDataSize += userData.length;
        });
        
        return stats;
    }
}

module.exports = ConsciousnessMLEngine;

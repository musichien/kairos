/**
 * Enhanced Self-Model Manager - 고도화된 자기 모델 관리자
 * 
 * Damasio의 Core Consciousness 이론에 기반한 고도화된 자기 모델 시스템
 * 생물학적 항상성 시뮬레이터와 통합된 정교한 사용자 상태 추적
 */

const EventEmitter = require('events');
const BiologicalHomeostasisSimulator = require('./biological_homeostasis_simulator');

class EnhancedSelfModelManager extends EventEmitter {
    constructor() {
        super();
        
        // 생물학적 항상성 시뮬레이터 초기화
        this.homeostasisSimulator = new BiologicalHomeostasisSimulator();
        
        // 사용자 상태 저장소
        this.userStates = new Map();
        this.userHistory = new Map();
        this.userRelationships = new Map();
        
        // 고급 상태 추적 시스템
        this.stateTracking = {
            temporalPatterns: new Map(), // 시간적 패턴
            behavioralClusters: new Map(), // 행동 클러스터
            emotionalTrajectories: new Map(), // 감정 궤적
            cognitiveLoads: new Map() // 인지 부하
        };
        
        // 센서 데이터 통합
        this.sensorIntegrations = {
            wearable: new Map(), // 착용형 기기
            environmental: new Map(), // 환경 센서
            behavioral: new Map() // 행동 센서
        };
        
        // 지식 그래프 구조
        this.knowledgeGraph = {
            nodes: new Map(), // 사용자, 상태, 객체, 관계
            edges: new Map(), // 관계 연결
            weights: new Map() // 관계 강도
        };
        
        // 시뮬레이션 시작
        this.homeostasisSimulator.startSimulation();
        
        // 이벤트 연결
        this.setupEventListeners();
        
        console.log('🧠 Enhanced Self-Model Manager initialized (Damasio Core Consciousness)');
    }
    
    /**
     * 사용자 상태 업데이트 (고도화된 버전)
     */
    async updateUserState(userId, inputData) {
        try {
            // 1. 기존 상태 조회
            const currentState = this.userStates.get(userId) || this.initializeUserState(userId);
            
            // 2. 입력 데이터 분석 및 전처리
            const processedData = await this.processInputData(inputData);
            
            // 3. 생물학적 항상성 상태 업데이트
            await this.updateBiologicalState(userId, processedData);
            
            // 4. 다차원 상태 업데이트
            const updatedState = await this.updateMultiDimensionalState(userId, currentState, processedData);
            
            // 5. 지식 그래프 업데이트
            await this.updateKnowledgeGraph(userId, updatedState, processedData);
            
            // 6. 시간적 패턴 분석
            await this.analyzeTemporalPatterns(userId, updatedState);
            
            // 7. 상태 저장 및 이력 관리
            this.saveUserState(userId, updatedState);
            this.updateUserHistory(userId, updatedState);
            
            // 8. 이벤트 발생
            this.emit('stateChanged', {
                userId,
                state: updatedState,
                changes: this.calculateStateChanges(currentState, updatedState),
                timestamp: Date.now()
            });
            
            return updatedState;
        } catch (error) {
            console.error('Enhanced user state update error:', error);
            throw error;
        }
    }
    
    /**
     * 입력 데이터 전처리
     */
    async processInputData(inputData) {
        const processed = {
            // 기본 데이터
            raw: inputData,
            
            // 텍스트 분석
            textAnalysis: await this.analyzeText(inputData.text || ''),
            
            // 센서 데이터 정규화
            sensorData: this.normalizeSensorData(inputData.sensorData || {}),
            
            // 행동 패턴 추출
            behavioralPatterns: this.extractBehavioralPatterns(inputData),
            
            // 감정 상태 분석
            emotionalState: await this.analyzeEmotionalState(inputData),
            
            // 인지 부하 평가
            cognitiveLoad: this.assessCognitiveLoad(inputData),
            
            // 맥락 정보
            context: this.extractContext(inputData),
            
            // 메타데이터
            metadata: {
                timestamp: Date.now(),
                source: inputData.source || 'unknown',
                confidence: this.calculateDataConfidence(inputData)
            }
        };
        
        return processed;
    }
    
    /**
     * 텍스트 분석
     */
    async analyzeText(text) {
        if (!text) return { sentiment: 0, keywords: [], complexity: 0 };
        
        // 감정 분석 (간단한 키워드 기반)
        const sentimentKeywords = {
            positive: ['good', 'great', 'happy', 'excited', 'love', 'amazing', 'wonderful'],
            negative: ['bad', 'terrible', 'sad', 'angry', 'hate', 'awful', 'horrible'],
            stress: ['stressed', 'anxious', 'worried', 'overwhelmed', 'pressure', 'tired'],
            energy: ['energetic', 'motivated', 'active', 'exhausted', 'drained', 'lazy']
        };
        
        let sentiment = 0;
        let keywords = [];
        let complexity = 0;
        
        const words = text.toLowerCase().split(/\s+/);
        
        // 감정 점수 계산
        words.forEach(word => {
            if (sentimentKeywords.positive.includes(word)) sentiment += 0.1;
            if (sentimentKeywords.negative.includes(word)) sentiment -= 0.1;
            if (sentimentKeywords.stress.includes(word)) keywords.push('stress');
            if (sentimentKeywords.energy.includes(word)) keywords.push('energy');
        });
        
        // 복잡도 계산 (문장 길이, 단어 수 기반)
        complexity = Math.min(1, words.length / 20);
        
        return {
            sentiment: Math.max(-1, Math.min(1, sentiment)),
            keywords,
            complexity,
            wordCount: words.length
        };
    }
    
    /**
     * 센서 데이터 정규화
     */
    normalizeSensorData(sensorData) {
        const normalized = {};
        
        // 심박수 정규화
        if (sensorData.heartRate) {
            normalized.heartRate = Math.max(0, Math.min(1, (sensorData.heartRate - 60) / 40));
        }
        
        // 걸음수 정규화
        if (sensorData.steps) {
            normalized.steps = Math.max(0, Math.min(1, sensorData.steps / 10000));
        }
        
        // 수면 시간 정규화
        if (sensorData.sleepDuration) {
            normalized.sleepDuration = Math.max(0, Math.min(1, sensorData.sleepDuration / 8));
        }
        
        // 스트레스 레벨 정규화
        if (sensorData.stressLevel) {
            normalized.stressLevel = Math.max(0, Math.min(1, sensorData.stressLevel));
        }
        
        return normalized;
    }
    
    /**
     * 행동 패턴 추출
     */
    extractBehavioralPatterns(inputData) {
        const patterns = {
            sessionLength: inputData.sessionLength || 0,
            interactionFrequency: inputData.interactionFrequency || 0,
            responseTime: inputData.responseTime || 0,
            taskSwitching: inputData.taskSwitching || 0,
            focusDuration: inputData.focusDuration || 0
        };
        
        // 패턴 정규화
        Object.keys(patterns).forEach(key => {
            patterns[key] = Math.max(0, Math.min(1, patterns[key]));
        });
        
        return patterns;
    }
    
    /**
     * 감정 상태 분석
     */
    async analyzeEmotionalState(inputData) {
        const textAnalysis = await this.analyzeText(inputData.text || '');
        const sensorData = this.normalizeSensorData(inputData.sensorData || {});
        
        // 감정 상태 계산
        const emotionalState = {
            valence: textAnalysis.sentiment, // 긍정/부정
            arousal: sensorData.stressLevel || 0.5, // 각성도
            dominance: 1 - (sensorData.stressLevel || 0.5), // 지배감
            
            // 세부 감정
            joy: Math.max(0, textAnalysis.sentiment),
            sadness: Math.max(0, -textAnalysis.sentiment),
            anger: sensorData.stressLevel > 0.7 ? sensorData.stressLevel : 0,
            fear: sensorData.stressLevel > 0.6 ? sensorData.stressLevel * 0.8 : 0,
            surprise: textAnalysis.complexity > 0.7 ? 0.3 : 0,
            disgust: 0 // 기본값
        };
        
        return emotionalState;
    }
    
    /**
     * 인지 부하 평가
     */
    assessCognitiveLoad(inputData) {
        const textAnalysis = this.analyzeText(inputData.text || '');
        const behavioralPatterns = this.extractBehavioralPatterns(inputData);
        
        // 인지 부하 계산
        const cognitiveLoad = {
            linguistic: textAnalysis.complexity,
            attentional: 1 - behavioralPatterns.focusDuration,
            working: behavioralPatterns.taskSwitching,
            emotional: Math.abs(textAnalysis.sentiment),
            temporal: behavioralPatterns.sessionLength
        };
        
        // 전체 인지 부하
        cognitiveLoad.overall = Object.values(cognitiveLoad).reduce((sum, val) => sum + val, 0) / 5;
        
        return cognitiveLoad;
    }
    
    /**
     * 맥락 정보 추출
     */
    extractContext(inputData) {
        return {
            timeOfDay: new Date().getHours(),
            dayOfWeek: new Date().getDay(),
            location: inputData.location || 'unknown',
            device: inputData.device || 'unknown',
            previousInteraction: inputData.previousInteraction || null,
            currentTask: inputData.currentTask || null
        };
    }
    
    /**
     * 데이터 신뢰도 계산
     */
    calculateDataConfidence(inputData) {
        let confidence = 0.5; // 기본값
        
        // 텍스트 데이터가 있으면 신뢰도 증가
        if (inputData.text && inputData.text.length > 10) confidence += 0.2;
        
        // 센서 데이터가 있으면 신뢰도 증가
        if (inputData.sensorData && Object.keys(inputData.sensorData).length > 0) confidence += 0.2;
        
        // 행동 데이터가 있으면 신뢰도 증가
        if (inputData.behavioralData && Object.keys(inputData.behavioralData).length > 0) confidence += 0.1;
        
        return Math.max(0, Math.min(1, confidence));
    }
    
    /**
     * 생물학적 상태 업데이트
     */
    async updateBiologicalState(userId, processedData) {
        // 환경적 요인 업데이트
        const environmentalFactors = {
            stress: processedData.emotionalState.anger + processedData.emotionalState.fear,
            nutrition: 0.7, // 기본값 (실제로는 센서 데이터에서)
            exercise: processedData.sensorData.steps || 0.5,
            social: processedData.emotionalState.joy > 0 ? 0.8 : 0.4,
            cognitive: processedData.cognitiveLoad.overall
        };
        
        this.homeostasisSimulator.updateEnvironmentalFactors(environmentalFactors);
        
        // 생물학적 상태 조회
        const biologicalState = this.homeostasisSimulator.getCurrentHomeostasisState();
        
        return biologicalState;
    }
    
    /**
     * 다차원 상태 업데이트
     */
    async updateMultiDimensionalState(userId, currentState, processedData) {
        const updatedState = {
            // 생리학적 상태
            physiological: {
                heartRate: processedData.sensorData.heartRate || currentState.physiological?.heartRate || 0.5,
                stressLevel: processedData.emotionalState.arousal,
                energyLevel: 1 - processedData.emotionalState.sadness - processedData.cognitiveLoad.overall * 0.3,
                sleepQuality: processedData.sensorData.sleepDuration || currentState.physiological?.sleepQuality || 0.5,
                painLevel: 0, // 기본값
                hunger: 0.5, // 기본값
                thirst: 0.5, // 기본값
                
                // 생물학적 항상성 데이터
                biological: this.homeostasisSimulator.getCurrentHomeostasisState()
            },
            
            // 행동적 상태
            behavioral: {
                attentionLevel: processedData.cognitiveLoad.attentional < 0.3 ? 'focused' : 
                              processedData.cognitiveLoad.attentional < 0.7 ? 'moderate' : 'distracted',
                activityLevel: processedData.sensorData.steps > 0.7 ? 'high' : 
                              processedData.sensorData.steps > 0.3 ? 'moderate' : 'low',
                socialEngagement: processedData.emotionalState.joy > 0.3 ? 'high' : 
                                 processedData.emotionalState.joy > -0.3 ? 'moderate' : 'low',
                taskEngagement: processedData.behavioralPatterns.focusDuration > 0.7 ? 'high' : 
                               processedData.behavioralPatterns.focusDuration > 0.3 ? 'moderate' : 'low',
                
                // 행동 패턴
                patterns: processedData.behavioralPatterns
            },
            
            // 감정적 상태
            emotional: {
                current: processedData.emotionalState,
                trajectory: this.updateEmotionalTrajectory(userId, processedData.emotionalState),
                regulation: this.assessEmotionalRegulation(processedData.emotionalState),
                expression: this.assessEmotionalExpression(processedData.textAnalysis)
            },
            
            // 인지적 상태
            cognitive: {
                load: processedData.cognitiveLoad,
                capacity: this.assessCognitiveCapacity(processedData.cognitiveLoad),
                flexibility: this.assessCognitiveFlexibility(processedData.behavioralPatterns),
                creativity: this.assessCreativity(processedData.textAnalysis),
                
                // 인지 패턴
                patterns: this.analyzeCognitivePatterns(processedData)
            },
            
            // 사회적 상태
            social: {
                connectedness: processedData.emotionalState.joy > 0 ? 0.8 : 0.4,
                support: 0.6, // 기본값
                communication: processedData.textAnalysis.wordCount > 20 ? 'high' : 'low',
                empathy: this.assessEmpathy(processedData.textAnalysis)
            },
            
            // 환경적 상태
            environmental: {
                context: processedData.context,
                adaptation: this.assessEnvironmentalAdaptation(processedData),
                comfort: this.assessEnvironmentalComfort(processedData)
            },
            
            // 메타데이터
            metadata: {
                ...processedData.metadata,
                lastUpdated: Date.now(),
                version: '2.0'
            }
        };
        
        return updatedState;
    }
    
    /**
     * 감정 궤적 업데이트
     */
    updateEmotionalTrajectory(userId, currentEmotionalState) {
        const trajectory = this.stateTracking.emotionalTrajectories.get(userId) || [];
        
        // 최근 10개 상태만 유지
        trajectory.push({
            ...currentEmotionalState,
            timestamp: Date.now()
        });
        
        if (trajectory.length > 10) {
            trajectory.shift();
        }
        
        this.stateTracking.emotionalTrajectories.set(userId, trajectory);
        
        return trajectory;
    }
    
    /**
     * 감정 조절 평가
     */
    assessEmotionalRegulation(emotionalState) {
        const regulation = {
            stability: 1 - Math.abs(emotionalState.valence),
            flexibility: 1 - Math.abs(emotionalState.arousal - 0.5),
            recovery: 0.7, // 기본값
            awareness: 0.8 // 기본값
        };
        
        regulation.overall = Object.values(regulation).reduce((sum, val) => sum + val, 0) / 4;
        
        return regulation;
    }
    
    /**
     * 감정 표현 평가
     */
    assessEmotionalExpression(textAnalysis) {
        return {
            clarity: textAnalysis.complexity > 0.5 ? 0.8 : 0.4,
            intensity: Math.abs(textAnalysis.sentiment),
            authenticity: 0.7, // 기본값
            appropriateness: 0.8 // 기본값
        };
    }
    
    /**
     * 인지 용량 평가
     */
    assessCognitiveCapacity(cognitiveLoad) {
        return {
            available: Math.max(0, 1 - cognitiveLoad.overall),
            efficiency: cognitiveLoad.overall < 0.5 ? 0.8 : 0.4,
            flexibility: 1 - cognitiveLoad.working,
            sustainability: 1 - cognitiveLoad.temporal
        };
    }
    
    /**
     * 인지 유연성 평가
     */
    assessCognitiveFlexibility(behavioralPatterns) {
        return {
            taskSwitching: behavioralPatterns.taskSwitching,
            adaptation: 1 - behavioralPatterns.sessionLength,
            creativity: behavioralPatterns.focusDuration > 0.7 ? 0.8 : 0.4,
            problemSolving: 0.7 // 기본값
        };
    }
    
    /**
     * 창의성 평가
     */
    assessCreativity(textAnalysis) {
        return {
            originality: textAnalysis.complexity > 0.6 ? 0.8 : 0.4,
            fluency: textAnalysis.wordCount > 50 ? 0.8 : 0.4,
            flexibility: 0.6, // 기본값
            elaboration: textAnalysis.wordCount > 100 ? 0.8 : 0.4
        };
    }
    
    /**
     * 인지 패턴 분석
     */
    analyzeCognitivePatterns(processedData) {
        return {
            attention: {
                sustained: processedData.behavioralPatterns.focusDuration,
                selective: 1 - processedData.cognitiveLoad.attentional,
                divided: processedData.behavioralPatterns.taskSwitching
            },
            memory: {
                working: 1 - processedData.cognitiveLoad.working,
                episodic: 0.7, // 기본값
                semantic: 0.8 // 기본값
            },
            executive: {
                planning: 0.7, // 기본값
                inhibition: 1 - processedData.cognitiveLoad.emotional,
                shifting: processedData.behavioralPatterns.taskSwitching
            }
        };
    }
    
    /**
     * 공감 능력 평가
     */
    assessEmpathy(textAnalysis) {
        const empatheticKeywords = ['understand', 'feel', 'empathize', 'support', 'help'];
        const hasEmpatheticLanguage = empatheticKeywords.some(keyword => 
            textAnalysis.keywords.includes(keyword)
        );
        
        return {
            cognitive: hasEmpatheticLanguage ? 0.8 : 0.4,
            emotional: Math.abs(textAnalysis.sentiment) > 0.3 ? 0.7 : 0.4,
            compassionate: hasEmpatheticLanguage ? 0.8 : 0.4,
            perspective: 0.6 // 기본값
        };
    }
    
    /**
     * 환경 적응 평가
     */
    assessEnvironmentalAdaptation(processedData) {
        return {
            flexibility: 0.7, // 기본값
            resilience: 1 - processedData.emotionalState.fear,
            comfort: 1 - processedData.emotionalState.anger,
            control: 1 - processedData.emotionalState.sadness
        };
    }
    
    /**
     * 환경 편안함 평가
     */
    assessEnvironmentalComfort(processedData) {
        return {
            physical: 0.7, // 기본값
            psychological: 1 - processedData.emotionalState.stress,
            social: processedData.emotionalState.joy > 0 ? 0.8 : 0.4,
            cognitive: 1 - processedData.cognitiveLoad.overall
        };
    }
    
    /**
     * 지식 그래프 업데이트
     */
    async updateKnowledgeGraph(userId, userState, processedData) {
        // 사용자 노드 업데이트
        this.knowledgeGraph.nodes.set(`user_${userId}`, {
            type: 'user',
            state: userState,
            lastUpdated: Date.now()
        });
        
        // 상태 노드들 생성
        const stateNodes = this.createStateNodes(userState);
        stateNodes.forEach((node, key) => {
            this.knowledgeGraph.nodes.set(key, node);
        });
        
        // 관계 엣지들 생성
        const relationships = this.createRelationships(userId, userState, processedData);
        relationships.forEach((relationship, key) => {
            this.knowledgeGraph.edges.set(key, relationship);
        });
    }
    
    /**
     * 상태 노드 생성
     */
    createStateNodes(userState) {
        const nodes = new Map();
        
        // 생리학적 상태 노드
        Object.keys(userState.physiological).forEach(key => {
            if (typeof userState.physiological[key] === 'number') {
                nodes.set(`physiological_${key}`, {
                    type: 'physiological_state',
                    category: 'physiological',
                    value: userState.physiological[key],
                    timestamp: Date.now()
                });
            }
        });
        
        // 감정적 상태 노드
        Object.keys(userState.emotional.current).forEach(key => {
            nodes.set(`emotional_${key}`, {
                type: 'emotional_state',
                category: 'emotional',
                value: userState.emotional.current[key],
                timestamp: Date.now()
            });
        });
        
        // 인지적 상태 노드
        Object.keys(userState.cognitive.load).forEach(key => {
            nodes.set(`cognitive_${key}`, {
                type: 'cognitive_state',
                category: 'cognitive',
                value: userState.cognitive.load[key],
                timestamp: Date.now()
            });
        });
        
        return nodes;
    }
    
    /**
     * 관계 생성
     */
    createRelationships(userId, userState, processedData) {
        const relationships = new Map();
        
        // 사용자-상태 관계
        relationships.set(`user_${userId}_physiological`, {
            from: `user_${userId}`,
            to: 'physiological_states',
            type: 'has_physiological_state',
            strength: 1.0,
            timestamp: Date.now()
        });
        
        relationships.set(`user_${userId}_emotional`, {
            from: `user_${userId}`,
            to: 'emotional_states',
            type: 'has_emotional_state',
            strength: 1.0,
            timestamp: Date.now()
        });
        
        relationships.set(`user_${userId}_cognitive`, {
            from: `user_${userId}`,
            to: 'cognitive_states',
            type: 'has_cognitive_state',
            strength: 1.0,
            timestamp: Date.now()
        });
        
        // 상태 간 관계
        const stressLevel = userState.physiological.stressLevel;
        const energyLevel = userState.physiological.energyLevel;
        
        if (stressLevel > 0.7) {
            relationships.set('stress_energy_negative', {
                from: 'physiological_stressLevel',
                to: 'physiological_energyLevel',
                type: 'negatively_correlates',
                strength: stressLevel,
                timestamp: Date.now()
            });
        }
        
        return relationships;
    }
    
    /**
     * 시간적 패턴 분석
     */
    async analyzeTemporalPatterns(userId, userState) {
        const patterns = this.stateTracking.temporalPatterns.get(userId) || {
            daily: [],
            weekly: [],
            trends: {}
        };
        
        // 일일 패턴 추가
        patterns.daily.push({
            timestamp: Date.now(),
            state: userState,
            hour: new Date().getHours()
        });
        
        // 최근 24시간 데이터만 유지
        const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
        patterns.daily = patterns.daily.filter(p => p.timestamp > oneDayAgo);
        
        // 주간 패턴 추가
        patterns.weekly.push({
            timestamp: Date.now(),
            state: userState,
            dayOfWeek: new Date().getDay()
        });
        
        // 최근 7일 데이터만 유지
        const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        patterns.weekly = patterns.weekly.filter(p => p.timestamp > oneWeekAgo);
        
        // 트렌드 분석
        patterns.trends = this.analyzeTrends(patterns);
        
        this.stateTracking.temporalPatterns.set(userId, patterns);
    }
    
    /**
     * 트렌드 분석
     */
    analyzeTrends(patterns) {
        const trends = {
            stress: this.calculateTrend(patterns.daily, 'physiological.stressLevel'),
            energy: this.calculateTrend(patterns.daily, 'physiological.energyLevel'),
            mood: this.calculateTrend(patterns.daily, 'emotional.current.valence'),
            cognitive: this.calculateTrend(patterns.daily, 'cognitive.load.overall')
        };
        
        return trends;
    }
    
    /**
     * 개별 트렌드 계산
     */
    calculateTrend(data, path) {
        if (data.length < 2) return 0;
        
        const values = data.map(d => this.getNestedValue(d.state, path)).filter(v => v !== undefined);
        if (values.length < 2) return 0;
        
        // 선형 회귀로 트렌드 계산
        const n = values.length;
        const x = Array.from({length: n}, (_, i) => i);
        const y = values;
        
        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
        const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
        
        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        
        return slope;
    }
    
    /**
     * 중첩된 객체 값 가져오기
     */
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }
    
    /**
     * 상태 변화 계산
     */
    calculateStateChanges(currentState, updatedState) {
        const changes = {};
        
        // 생리학적 변화
        changes.physiological = this.calculateDimensionChanges(
            currentState.physiological || {}, 
            updatedState.physiological
        );
        
        // 감정적 변화
        changes.emotional = this.calculateDimensionChanges(
            currentState.emotional || {}, 
            updatedState.emotional
        );
        
        // 인지적 변화
        changes.cognitive = this.calculateDimensionChanges(
            currentState.cognitive || {}, 
            updatedState.cognitive
        );
        
        return changes;
    }
    
    /**
     * 차원별 변화 계산
     */
    calculateDimensionChanges(current, updated) {
        const changes = {};
        
        Object.keys(updated).forEach(key => {
            if (typeof updated[key] === 'number' && typeof current[key] === 'number') {
                changes[key] = updated[key] - current[key];
            } else if (typeof updated[key] === 'object' && typeof current[key] === 'object') {
                changes[key] = this.calculateDimensionChanges(current[key], updated[key]);
            }
        });
        
        return changes;
    }
    
    /**
     * 사용자 상태 초기화
     */
    initializeUserState(userId) {
        const initialState = {
            physiological: {
                heartRate: 0.5,
                stressLevel: 0.5,
                energyLevel: 0.5,
                sleepQuality: 0.5,
                painLevel: 0,
                hunger: 0.5,
                thirst: 0.5,
                biological: null
            },
            behavioral: {
                attentionLevel: 'moderate',
                activityLevel: 'moderate',
                socialEngagement: 'moderate',
                taskEngagement: 'moderate',
                patterns: {}
            },
            emotional: {
                current: {
                    valence: 0,
                    arousal: 0.5,
                    dominance: 0.5,
                    joy: 0,
                    sadness: 0,
                    anger: 0,
                    fear: 0,
                    surprise: 0,
                    disgust: 0
                },
                trajectory: [],
                regulation: { overall: 0.5 },
                expression: { clarity: 0.5, intensity: 0.5 }
            },
            cognitive: {
                load: { overall: 0.5 },
                capacity: { available: 0.5 },
                flexibility: { taskSwitching: 0.5 },
                creativity: { originality: 0.5 },
                patterns: {}
            },
            social: {
                connectedness: 0.5,
                support: 0.5,
                communication: 'moderate',
                empathy: { cognitive: 0.5 }
            },
            environmental: {
                context: {},
                adaptation: { flexibility: 0.5 },
                comfort: { physical: 0.5 }
            },
            metadata: {
                timestamp: Date.now(),
                version: '2.0'
            }
        };
        
        this.userStates.set(userId, initialState);
        return initialState;
    }
    
    /**
     * 사용자 상태 저장
     */
    saveUserState(userId, state) {
        this.userStates.set(userId, state);
    }
    
    /**
     * 사용자 이력 업데이트
     */
    updateUserHistory(userId, state) {
        const history = this.userHistory.get(userId) || [];
        history.push({
            state: { ...state },
            timestamp: Date.now()
        });
        
        // 최근 100개 상태만 유지
        if (history.length > 100) {
            history.shift();
        }
        
        this.userHistory.set(userId, history);
    }
    
    /**
     * 이벤트 리스너 설정
     */
    setupEventListeners() {
        this.homeostasisSimulator.on('homeostasisUpdated', (data) => {
            this.emit('biologicalStateUpdated', data);
        });
        
        this.homeostasisSimulator.on('homeostasisAlert', (alert) => {
            this.emit('biologicalAlert', alert);
        });
    }
    
    /**
     * 현재 사용자 상태 조회
     */
    getCurrentUserState(userId) {
        return this.userStates.get(userId);
    }
    
    /**
     * 사용자 이력 조회
     */
    getUserHistory(userId, limit = 10) {
        const history = this.userHistory.get(userId) || [];
        return history.slice(-limit);
    }
    
    /**
     * 시간적 패턴 조회
     */
    getTemporalPatterns(userId) {
        return this.stateTracking.temporalPatterns.get(userId);
    }
    
    /**
     * 지식 그래프 조회
     */
    getKnowledgeGraph(userId) {
        const userNodes = Array.from(this.knowledgeGraph.nodes.entries())
            .filter(([key]) => key.includes(userId));
        
        const userEdges = Array.from(this.knowledgeGraph.edges.entries())
            .filter(([key]) => key.includes(userId));
        
        return {
            nodes: userNodes,
            edges: userEdges
        };
    }
    
    /**
     * 시스템 통계 조회
     */
    getStats() {
        return {
            totalUsers: this.userStates.size,
            totalHistoryEntries: Array.from(this.userHistory.values())
                .reduce((sum, history) => sum + history.length, 0),
            knowledgeGraphNodes: this.knowledgeGraph.nodes.size,
            knowledgeGraphEdges: this.knowledgeGraph.edges.size,
            homeostasisSimulator: this.homeostasisSimulator.getSimulationStats(),
            timestamp: Date.now()
        };
    }
    
    /**
     * 시스템 종료
     */
    shutdown() {
        this.homeostasisSimulator.shutdown();
        this.removeAllListeners();
        console.log('🧠 Enhanced Self-Model Manager shutdown complete');
    }
}

module.exports = EnhancedSelfModelManager;



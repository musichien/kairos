/**
 * Biological Homeostasis Simulator - 생물학적 항상성 시뮬레이터
 * 
 * Damasio의 Core Consciousness 이론에 기반한 생물학적 항상성 시뮬레이션
 * 실제 생물체의 내부 환경 조절 메커니즘을 모방
 */

const EventEmitter = require('events');

class BiologicalHomeostasisSimulator extends EventEmitter {
    constructor() {
        super();
        
        // 생물학적 항상성 파라미터들
        this.homeostaticParameters = {
            // 심혈관계
            heartRate: { current: 72, optimal: 72, range: [60, 100], variability: 0.1 },
            bloodPressure: { systolic: 120, diastolic: 80, optimal: { systolic: 120, diastolic: 80 } },
            bloodOxygen: { current: 98, optimal: 98, range: [95, 100] },
            
            // 신경계
            cortisol: { current: 0.5, optimal: 0.3, range: [0.1, 1.0] }, // 스트레스 호르몬
            dopamine: { current: 0.7, optimal: 0.7, range: [0.3, 1.0] }, // 보상 시스템
            serotonin: { current: 0.6, optimal: 0.6, range: [0.2, 0.9] }, // 기분 조절
            
            // 대사계
            glucose: { current: 5.5, optimal: 5.5, range: [3.9, 7.8] }, // 혈당
            insulin: { current: 0.5, optimal: 0.5, range: [0.2, 0.8] },
            energy: { current: 0.7, optimal: 0.7, range: [0.1, 1.0] },
            
            // 면역계
            inflammation: { current: 0.2, optimal: 0.1, range: [0.0, 1.0] },
            immuneResponse: { current: 0.8, optimal: 0.8, range: [0.3, 1.0] },
            
            // 수면-각성 사이클
            circadianRhythm: { current: 0.5, optimal: 0.5, range: [0.0, 1.0] },
            sleepPressure: { current: 0.3, optimal: 0.3, range: [0.0, 1.0] },
            
            // 감각계
            sensorySensitivity: { current: 0.6, optimal: 0.6, range: [0.2, 1.0] },
            painThreshold: { current: 0.5, optimal: 0.5, range: [0.1, 0.9] }
        };
        
        // 항상성 조절 메커니즘
        this.regulatoryMechanisms = {
            autonomicNervousSystem: {
                sympathetic: 0.5,  // 교감신경계 (스트레스, 각성)
                parasympathetic: 0.5  // 부교감신경계 (휴식, 회복)
            },
            endocrineSystem: {
                hpaAxis: 0.5,  // 시상하부-뇌하수체-부신축
                hpgAxis: 0.5   // 시상하부-뇌하수체-생식선축
            }
        };
        
        // 환경적 영향 요인들
        this.environmentalFactors = {
            stress: 0.3,
            nutrition: 0.7,
            exercise: 0.5,
            social: 0.6,
            cognitive: 0.5
        };
        
        // 시뮬레이션 설정
        this.simulationSettings = {
            timeStep: 1000, // 1초마다 업데이트
            adaptationRate: 0.01, // 적응 속도
            noiseLevel: 0.05, // 자연적 변동성
            isRunning: false
        };
        
        // 이벤트 리스너 설정
        this.setupEventListeners();
        
        console.log('🧬 Biological Homeostasis Simulator initialized');
    }
    
    /**
     * 시뮬레이션 시작
     */
    startSimulation() {
        if (this.simulationSettings.isRunning) return;
        
        this.simulationSettings.isRunning = true;
        this.simulationInterval = setInterval(() => {
            this.updateHomeostasis();
        }, this.simulationSettings.timeStep);
        
        console.log('🔄 Biological homeostasis simulation started');
        this.emit('simulationStarted');
    }
    
    /**
     * 시뮬레이션 중지
     */
    stopSimulation() {
        if (!this.simulationSettings.isRunning) return;
        
        this.simulationSettings.isRunning = false;
        if (this.simulationInterval) {
            clearInterval(this.simulationInterval);
        }
        
        console.log('⏹️ Biological homeostasis simulation stopped');
        this.emit('simulationStopped');
    }
    
    /**
     * 항상성 업데이트 (핵심 메커니즘)
     */
    updateHomeostasis() {
        // 1. 환경적 영향 계산
        const environmentalImpact = this.calculateEnvironmentalImpact();
        
        // 2. 각 시스템별 항상성 조절
        this.regulateCardiovascularSystem(environmentalImpact);
        this.regulateNervousSystem(environmentalImpact);
        this.regulateMetabolicSystem(environmentalImpact);
        this.regulateImmuneSystem(environmentalImpact);
        this.regulateSleepWakeCycle(environmentalImpact);
        this.regulateSensorySystem(environmentalImpact);
        
        // 3. 전체적인 항상성 상태 평가
        const homeostasisStatus = this.evaluateHomeostasisStatus();
        
        // 4. 이벤트 발생
        this.emit('homeostasisUpdated', {
            parameters: this.homeostaticParameters,
            status: homeostasisStatus,
            timestamp: Date.now()
        });
        
        // 5. 항상성 이상 감지 시 알림
        if (homeostasisStatus.deviation > 0.3) {
            this.emit('homeostasisAlert', {
                type: 'deviation',
                severity: homeostasisStatus.deviation,
                affectedSystems: homeostasisStatus.affectedSystems
            });
        }
    }
    
    /**
     * 환경적 영향 계산
     */
    calculateEnvironmentalImpact() {
        const impact = {
            stress: this.environmentalFactors.stress,
            nutrition: this.environmentalFactors.nutrition,
            exercise: this.environmentalFactors.exercise,
            social: this.environmentalFactors.social,
            cognitive: this.environmentalFactors.cognitive
        };
        
        // 스트레스가 다른 시스템에 미치는 영향
        impact.cardiovascular = impact.stress * 0.8 + impact.exercise * 0.6;
        impact.neuroendocrine = impact.stress * 0.9 + impact.social * 0.4;
        impact.metabolic = impact.nutrition * 0.7 + impact.exercise * 0.5;
        impact.immune = impact.stress * 0.6 + impact.nutrition * 0.5;
        
        return impact;
    }
    
    /**
     * 심혈관계 조절
     */
    regulateCardiovascularSystem(impact) {
        const params = this.homeostaticParameters;
        
        // 심박수 조절
        const targetHR = params.heartRate.optimal + (impact.cardiovascular - 0.5) * 20;
        params.heartRate.current = this.adaptToTarget(
            params.heartRate.current, 
            targetHR, 
            params.heartRate.variability
        );
        
        // 혈압 조절
        const bpChange = (impact.cardiovascular - 0.5) * 10;
        params.bloodPressure.systolic = Math.max(90, Math.min(140, 
            params.bloodPressure.systolic + bpChange * 0.1));
        params.bloodPressure.diastolic = Math.max(60, Math.min(90, 
            params.bloodPressure.diastolic + bpChange * 0.1));
        
        // 혈중 산소 조절
        params.bloodOxygen.current = Math.max(95, Math.min(100,
            params.bloodOxygen.current + (impact.exercise - 0.5) * 2));
    }
    
    /**
     * 신경계 조절
     */
    regulateNervousSystem(impact) {
        const params = this.homeostaticParameters;
        
        // 코르티솔 (스트레스 호르몬) 조절
        const cortisolTarget = params.cortisol.optimal + impact.neuroendocrine * 0.4;
        params.cortisol.current = this.adaptToTarget(
            params.cortisol.current, 
            cortisolTarget, 
            0.05
        );
        
        // 도파민 (보상 시스템) 조절
        const dopamineTarget = params.dopamine.optimal + 
            (impact.social * 0.3) + (impact.cognitive * 0.2) - (impact.stress * 0.2);
        params.dopamine.current = this.adaptToTarget(
            params.dopamine.current, 
            dopamineTarget, 
            0.03
        );
        
        // 세로토닌 (기분 조절) 조절
        const serotoninTarget = params.serotonin.optimal + 
            (impact.social * 0.2) + (impact.nutrition * 0.1) - (impact.stress * 0.3);
        params.serotonin.current = this.adaptToTarget(
            params.serotonin.current, 
            serotoninTarget, 
            0.02
        );
        
        // 자율신경계 조절
        this.regulatoryMechanisms.autonomicNervousSystem.sympathetic = 
            Math.min(1.0, impact.stress * 1.2);
        this.regulatoryMechanisms.autonomicNervousSystem.parasympathetic = 
            Math.max(0.0, 1.0 - impact.stress * 1.2);
    }
    
    /**
     * 대사계 조절
     */
    regulateMetabolicSystem(impact) {
        const params = this.homeostaticParameters;
        
        // 혈당 조절
        const glucoseTarget = params.glucose.optimal + 
            (impact.nutrition - 0.5) * 2 - (impact.exercise - 0.5) * 1;
        params.glucose.current = this.adaptToTarget(
            params.glucose.current, 
            glucoseTarget, 
            0.1
        );
        
        // 인슐린 조절
        const insulinTarget = params.insulin.optimal + 
            (params.glucose.current - params.glucose.optimal) * 0.1;
        params.insulin.current = this.adaptToTarget(
            params.insulin.current, 
            insulinTarget, 
            0.05
        );
        
        // 에너지 레벨 조절
        const energyTarget = params.energy.optimal + 
            (impact.nutrition * 0.3) + (impact.exercise * 0.2) - (impact.stress * 0.2);
        params.energy.current = this.adaptToTarget(
            params.energy.current, 
            energyTarget, 
            0.02
        );
    }
    
    /**
     * 면역계 조절
     */
    regulateImmuneSystem(impact) {
        const params = this.homeostaticParameters;
        
        // 염증 반응 조절
        const inflammationTarget = params.inflammation.optimal + 
            (impact.stress * 0.4) + (impact.immune * 0.2);
        params.inflammation.current = this.adaptToTarget(
            params.inflammation.current, 
            inflammationTarget, 
            0.01
        );
        
        // 면역 반응 조절
        const immuneTarget = params.immuneResponse.optimal + 
            (impact.nutrition * 0.2) - (impact.stress * 0.3);
        params.immuneResponse.current = this.adaptToTarget(
            params.immuneResponse.current, 
            immuneTarget, 
            0.02
        );
    }
    
    /**
     * 수면-각성 사이클 조절
     */
    regulateSleepWakeCycle(impact) {
        const params = this.homeostaticParameters;
        
        // 일주기 리듬 조절
        const timeOfDay = (Date.now() / 1000 / 60 / 60) % 24; // 시간 (0-24)
        const circadianTarget = 0.5 + 0.3 * Math.sin((timeOfDay - 6) * Math.PI / 12);
        params.circadianRhythm.current = this.adaptToTarget(
            params.circadianRhythm.current, 
            circadianTarget, 
            0.01
        );
        
        // 수면 압력 조절
        const sleepPressureTarget = params.sleepPressure.optimal + 
            (1 - impact.cognitive) * 0.3 + (impact.stress * 0.2);
        params.sleepPressure.current = this.adaptToTarget(
            params.sleepPressure.current, 
            sleepPressureTarget, 
            0.01
        );
    }
    
    /**
     * 감각계 조절
     */
    regulateSensorySystem(impact) {
        const params = this.homeostaticParameters;
        
        // 감각 민감도 조절
        const sensitivityTarget = params.sensorySensitivity.optimal + 
            (impact.cognitive * 0.2) - (impact.stress * 0.3);
        params.sensorySensitivity.current = this.adaptToTarget(
            params.sensorySensitivity.current, 
            sensitivityTarget, 
            0.02
        );
        
        // 통증 역치 조절
        const painThresholdTarget = params.painThreshold.optimal + 
            (impact.stress * 0.2) - (params.cortisol.current * 0.3);
        params.painThreshold.current = this.adaptToTarget(
            params.painThreshold.current, 
            painThresholdTarget, 
            0.01
        );
    }
    
    /**
     * 목표값으로 적응
     */
    adaptToTarget(current, target, variability) {
        const adaptationRate = this.simulationSettings.adaptationRate;
        const noise = (Math.random() - 0.5) * this.simulationSettings.noiseLevel;
        
        return current + (target - current) * adaptationRate + noise;
    }
    
    /**
     * 항상성 상태 평가
     */
    evaluateHomeostasisStatus() {
        const params = this.homeostaticParameters;
        let totalDeviation = 0;
        let affectedSystems = [];
        
        // 각 시스템별 편차 계산
        const systems = {
            cardiovascular: ['heartRate', 'bloodPressure', 'bloodOxygen'],
            nervous: ['cortisol', 'dopamine', 'serotonin'],
            metabolic: ['glucose', 'insulin', 'energy'],
            immune: ['inflammation', 'immuneResponse'],
            sleep: ['circadianRhythm', 'sleepPressure'],
            sensory: ['sensorySensitivity', 'painThreshold']
        };
        
        Object.keys(systems).forEach(system => {
            let systemDeviation = 0;
            let paramCount = 0;
            
            systems[system].forEach(param => {
                if (params[param]) {
                    const current = params[param].current;
                    const optimal = params[param].optimal;
                    const range = params[param].range;
                    
                    if (range) {
                        const normalizedDeviation = Math.abs(current - optimal) / (range[1] - range[0]);
                        systemDeviation += normalizedDeviation;
                    } else {
                        const normalizedDeviation = Math.abs(current - optimal);
                        systemDeviation += normalizedDeviation;
                    }
                    paramCount++;
                }
            });
            
            if (paramCount > 0) {
                systemDeviation /= paramCount;
                totalDeviation += systemDeviation;
                
                if (systemDeviation > 0.2) {
                    affectedSystems.push(system);
                }
            }
        });
        
        const averageDeviation = totalDeviation / Object.keys(systems).length;
        
        return {
            deviation: averageDeviation,
            affectedSystems,
            overallHealth: averageDeviation < 0.1 ? 'excellent' : 
                          averageDeviation < 0.2 ? 'good' : 
                          averageDeviation < 0.3 ? 'fair' : 'poor'
        };
    }
    
    /**
     * 환경적 요인 업데이트
     */
    updateEnvironmentalFactors(factors) {
        Object.keys(factors).forEach(factor => {
            if (this.environmentalFactors.hasOwnProperty(factor)) {
                this.environmentalFactors[factor] = Math.max(0, Math.min(1, factors[factor]));
            }
        });
        
        this.emit('environmentalFactorsUpdated', this.environmentalFactors);
    }
    
    /**
     * 현재 항상성 상태 조회
     */
    getCurrentHomeostasisState() {
        return {
            parameters: { ...this.homeostaticParameters },
            mechanisms: { ...this.regulatoryMechanisms },
            environmental: { ...this.environmentalFactors },
            status: this.evaluateHomeostasisStatus(),
            timestamp: Date.now()
        };
    }
    
    /**
     * 특정 시스템 상태 조회
     */
    getSystemState(systemName) {
        const systems = {
            cardiovascular: ['heartRate', 'bloodPressure', 'bloodOxygen'],
            nervous: ['cortisol', 'dopamine', 'serotonin'],
            metabolic: ['glucose', 'insulin', 'energy'],
            immune: ['inflammation', 'immuneResponse'],
            sleep: ['circadianRhythm', 'sleepPressure'],
            sensory: ['sensorySensitivity', 'painThreshold']
        };
        
        if (!systems[systemName]) return null;
        
        const systemState = {};
        systems[systemName].forEach(param => {
            if (this.homeostaticParameters[param]) {
                systemState[param] = { ...this.homeostaticParameters[param] };
            }
        });
        
        return systemState;
    }
    
    /**
     * 이벤트 리스너 설정
     */
    setupEventListeners() {
        this.on('homeostasisAlert', (alert) => {
            console.log(`⚠️ Homeostasis Alert: ${alert.type} - Severity: ${alert.severity.toFixed(3)}`);
        });
    }
    
    /**
     * 시뮬레이션 통계 조회
     */
    getSimulationStats() {
        return {
            isRunning: this.simulationSettings.isRunning,
            timeStep: this.simulationSettings.timeStep,
            adaptationRate: this.simulationSettings.adaptationRate,
            currentState: this.getCurrentHomeostasisState(),
            timestamp: Date.now()
        };
    }
    
    /**
     * 시뮬레이션 종료
     */
    shutdown() {
        this.stopSimulation();
        this.removeAllListeners();
        console.log('🧬 Biological Homeostasis Simulator shutdown complete');
    }
}

module.exports = BiologicalHomeostasisSimulator;



const moment = require('moment');

class CardiovascularWarningManager {
    constructor() {
        this.userData = new Map();
        this.riskThresholds = {
            LOW: 0,
            MODERATE: 25,
            HIGH: 50,
            CRITICAL: 75
        };
        
        // Evidence-based risk factors and weights
        this.riskFactors = {
            // Cardiovascular conditions
            hypertension: { weight: 3, description: 'Hypertension (JNC 8 Guidelines, 2014)' },
            hyperlipidemia: { weight: 3, description: 'High LDL cholesterol (ACC/AHA 2019)' },
            diabetes: { weight: 4, description: 'Diabetes mellitus (ADA Standards of Care 2025)' },
            obesity: { weight: 2, description: 'Obesity and high BMI (WHO, 2020)' },
            
            // Lifestyle factors
            sedentary: { weight: 2, description: 'Sedentary behavior and lack of exercise (European Heart Journal, 2020)' },
            poorDiet: { weight: 2, description: 'Poor diet, high sodium intake (Circulation, 2021)' },
            smoking: { weight: 4, description: 'Smoking (Lancet, 2018)' },
            excessiveAlcohol: { weight: 3, description: 'Excessive alcohol (Lancet, 2018)' },
            sleepDeprivation: { weight: 3, description: 'Sleep deprivation <6 hours/night (Sleep Health, 2019)' },
            
            // Medication effects
            sedatives: { weight: 3, description: 'Chronic sedative use (American Journal of Cardiology, 2017)' },
            sleepMedications: { weight: 2, description: 'Sleep medications (American Journal of Cardiology, 2017)' },
            
            // Psychosocial stress
            socialIsolation: { weight: 2, description: 'Social isolation (Circulation, 2018)' },
            grief: { weight: 4, description: 'Grief and extreme psychological stress (Heart, 2019)' },
            workStress: { weight: 2, description: 'Work-related stress' },
            
            // Physiological metrics
            highBloodPressure: { weight: 3, description: 'Elevated blood pressure' },
            highHeartRate: { weight: 2, description: 'Elevated heart rate' },
            highBloodSugar: { weight: 3, description: 'Elevated blood sugar' },
            highCholesterol: { weight: 3, description: 'Elevated cholesterol' }
        };
    }

    _getUserData(userId) {
        if (!this.userData.has(userId)) {
            this.userData.set(userId, {
                physiologicalMetrics: [],
                medicationRecords: [],
                lifestyleData: [],
                psychosocialData: [],
                riskAssessments: [],
                alerts: []
            });
        }
        return this.userData.get(userId);
    }

    // ===== Physiological Metrics =====
    recordPhysiologicalMetrics(userId, metrics) {
        const user = this._getUserData(userId);
        const timestamp = moment().toISOString();
        
        const record = {
            timestamp,
            weight: this._num(metrics.weight),
            bmi: this._num(metrics.bmi),
            systolicBP: this._num(metrics.systolicBP),
            diastolicBP: this._num(metrics.diastolicBP),
            heartRate: this._num(metrics.heartRate),
            bloodSugar: this._num(metrics.bloodSugar),
            cholesterol: this._num(metrics.cholesterol),
            ldl: this._num(metrics.ldl),
            hdl: this._num(metrics.hdl)
        };

        user.physiologicalMetrics.push(record);
        
        // Keep only last 30 days of data
        const thirtyDaysAgo = moment().subtract(30, 'days');
        user.physiologicalMetrics = user.physiologicalMetrics.filter(
            record => moment(record.timestamp).isAfter(thirtyDaysAgo)
        );

        console.log(`💓 Physiological metrics recorded for ${userId}:`, record);
        return record;
    }

    // ===== Medication Records =====
    recordMedication(userId, medication) {
        const user = this._getUserData(userId);
        const timestamp = moment().toISOString();
        
        const record = {
            timestamp,
            name: medication.name,
            type: medication.type, // 'sedative', 'sleep_aid', 'cardiovascular', 'other'
            dosage: medication.dosage,
            frequency: medication.frequency,
            startDate: medication.startDate,
            isActive: medication.isActive !== false
        };

        user.medicationRecords.push(record);
        console.log(`💊 Medication recorded for ${userId}:`, record);
        return record;
    }

    // ===== Lifestyle Data =====
    recordLifestyleData(userId, lifestyle) {
        const user = this._getUserData(userId);
        const timestamp = moment().toISOString();
        
        const record = {
            timestamp,
            sleepHours: this._num(lifestyle.sleepHours),
            sleepQuality: this._num(lifestyle.sleepQuality),
            exerciseMinutes: this._num(lifestyle.exerciseMinutes),
            exerciseType: lifestyle.exerciseType,
            steps: this._num(lifestyle.steps),
            dietQuality: this._num(lifestyle.dietQuality),
            sodiumIntake: this._num(lifestyle.sodiumIntake),
            smokingStatus: lifestyle.smokingStatus, // 'never', 'former', 'current'
            alcoholConsumption: this._num(lifestyle.alcoholConsumption),
            stressLevel: this._num(lifestyle.stressLevel)
        };

        user.lifestyleData.push(record);
        
        // Keep only last 30 days of data
        const thirtyDaysAgo = moment().subtract(30, 'days');
        user.lifestyleData = user.lifestyleData.filter(
            record => moment(record.timestamp).isAfter(thirtyDaysAgo)
        );

        console.log(`🏃 Lifestyle data recorded for ${userId}:`, record);
        return record;
    }

    // ===== Psychosocial Data =====
    recordPsychosocialData(userId, psychosocial) {
        const user = this._getUserData(userId);
        const timestamp = moment().toISOString();
        
        const record = {
            timestamp,
            stressLevel: this._num(psychosocial.stressLevel),
            socialInteraction: psychosocial.socialInteraction, // 'frequent', 'moderate', 'rare', 'isolated'
            majorLifeEvents: psychosocial.majorLifeEvents || [],
            emotionalState: psychosocial.emotionalState, // 'calm', 'anxious', 'depressed', 'grieving'
            workStress: this._num(psychosocial.workStress),
            familyStress: this._num(psychosocial.familyStress),
            griefLevel: this._num(psychosocial.griefLevel)
        };

        user.psychosocialData.push(record);
        console.log(`🧠 Psychosocial data recorded for ${userId}:`, record);
        return record;
    }

    // ===== Risk Assessment =====
    assessCardiovascularRisk(userId) {
        const user = this._getUserData(userId);
        const timestamp = moment().toISOString();
        
        // Get latest data
        const latestPhysio = user.physiologicalMetrics[user.physiologicalMetrics.length - 1];
        const latestLifestyle = user.lifestyleData[user.lifestyleData.length - 1];
        const latestPsycho = user.psychosocialData[user.psychosocialData.length - 1];
        const activeMedications = user.medicationRecords.filter(med => med.isActive);

        let totalRiskScore = 0;
        const riskFactors = [];
        const recommendations = [];

        // Physiological risk assessment
        if (latestPhysio) {
            // Blood pressure
            if (latestPhysio.systolicBP >= 140 || latestPhysio.diastolicBP >= 90) {
                totalRiskScore += this.riskFactors.highBloodPressure.weight;
                riskFactors.push({
                    factor: 'High Blood Pressure',
                    weight: this.riskFactors.highBloodPressure.weight,
                    description: this.riskFactors.highBloodPressure.description,
                    value: `${latestPhysio.systolicBP}/${latestPhysio.diastolicBP} mmHg`
                });
                recommendations.push('Consult physician for blood pressure management');
            }

            // Heart rate
            if (latestPhysio.heartRate > 100) {
                totalRiskScore += this.riskFactors.highHeartRate.weight;
                riskFactors.push({
                    factor: 'Elevated Heart Rate',
                    weight: this.riskFactors.highHeartRate.weight,
                    description: this.riskFactors.highHeartRate.description,
                    value: `${latestPhysio.heartRate} bpm`
                });
            }

            // Blood sugar
            if (latestPhysio.bloodSugar >= 126) {
                totalRiskScore += this.riskFactors.highBloodSugar.weight;
                riskFactors.push({
                    factor: 'Elevated Blood Sugar',
                    weight: this.riskFactors.highBloodSugar.weight,
                    description: this.riskFactors.highBloodSugar.description,
                    value: `${latestPhysio.bloodSugar} mg/dL`
                });
                recommendations.push('Monitor blood sugar and consult endocrinologist');
            }

            // Cholesterol
            if (latestPhysio.ldl >= 160) {
                totalRiskScore += this.riskFactors.highCholesterol.weight;
                riskFactors.push({
                    factor: 'High LDL Cholesterol',
                    weight: this.riskFactors.highCholesterol.weight,
                    description: this.riskFactors.highCholesterol.description,
                    value: `${latestPhysio.ldl} mg/dL`
                });
                recommendations.push('Consider dietary changes and lipid-lowering therapy');
            }

            // BMI
            if (latestPhysio.bmi >= 30) {
                totalRiskScore += this.riskFactors.obesity.weight;
                riskFactors.push({
                    factor: 'Obesity',
                    weight: this.riskFactors.obesity.weight,
                    description: this.riskFactors.obesity.description,
                    value: `BMI: ${latestPhysio.bmi}`
                });
                recommendations.push('Work with healthcare provider on weight management plan');
            }
        }

        // Lifestyle risk assessment
        if (latestLifestyle) {
            // Sleep deprivation
            if (latestLifestyle.sleepHours < 6) {
                totalRiskScore += this.riskFactors.sleepDeprivation.weight;
                riskFactors.push({
                    factor: 'Sleep Deprivation',
                    weight: this.riskFactors.sleepDeprivation.weight,
                    description: this.riskFactors.sleepDeprivation.description,
                    value: `${latestLifestyle.sleepHours} hours`
                });
                recommendations.push('Prioritize sleep hygiene and aim for 7-9 hours per night');
            }

            // Sedentary behavior
            if (latestLifestyle.exerciseMinutes < 30) {
                totalRiskScore += this.riskFactors.sedentary.weight;
                riskFactors.push({
                    factor: 'Sedentary Behavior',
                    weight: this.riskFactors.sedentary.weight,
                    description: this.riskFactors.sedentary.description,
                    value: `${latestLifestyle.exerciseMinutes} minutes exercise`
                });
                recommendations.push('Increase physical activity to at least 30 minutes daily');
            }

            // Smoking
            if (latestLifestyle.smokingStatus === 'current') {
                totalRiskScore += this.riskFactors.smoking.weight;
                riskFactors.push({
                    factor: 'Current Smoking',
                    weight: this.riskFactors.smoking.weight,
                    description: this.riskFactors.smoking.description,
                    value: 'Active smoker'
                });
                recommendations.push('Consider smoking cessation programs and nicotine replacement therapy');
            }

            // High sodium intake
            if (latestLifestyle.sodiumIntake > 2300) {
                totalRiskScore += this.riskFactors.poorDiet.weight;
                riskFactors.push({
                    factor: 'High Sodium Intake',
                    weight: this.riskFactors.poorDiet.weight,
                    description: this.riskFactors.poorDiet.description,
                    value: `${latestLifestyle.sodiumIntake} mg`
                });
                recommendations.push('Reduce sodium intake to less than 2,300mg per day');
            }
        }

        // Medication risk assessment
        activeMedications.forEach(med => {
            if (med.type === 'sedative') {
                totalRiskScore += this.riskFactors.sedatives.weight;
                riskFactors.push({
                    factor: 'Sedative Use',
                    weight: this.riskFactors.sedatives.weight,
                    description: this.riskFactors.sedatives.description,
                    value: med.name
                });
                recommendations.push('Review sedative use with physician, consider alternatives');
            }
            
            if (med.type === 'sleep_aid') {
                totalRiskScore += this.riskFactors.sleepMedications.weight;
                riskFactors.push({
                    factor: 'Sleep Medication Use',
                    weight: this.riskFactors.sleepMedications.weight,
                    description: this.riskFactors.sleepMedications.description,
                    value: med.name
                });
            }
        });

        // Psychosocial risk assessment
        if (latestPsycho) {
            // Social isolation
            if (latestPsycho.socialInteraction === 'isolated') {
                totalRiskScore += this.riskFactors.socialIsolation.weight;
                riskFactors.push({
                    factor: 'Social Isolation',
                    weight: this.riskFactors.socialIsolation.weight,
                    description: this.riskFactors.socialIsolation.description,
                    value: 'Socially isolated'
                });
                recommendations.push('Increase social connections and community engagement');
            }

            // Grief and extreme stress
            if (latestPsycho.griefLevel >= 8 || latestPsycho.stressLevel >= 8) {
                totalRiskScore += this.riskFactors.grief.weight;
                riskFactors.push({
                    factor: 'Extreme Psychological Stress',
                    weight: this.riskFactors.grief.weight,
                    description: this.riskFactors.grief.description,
                    value: `Grief: ${latestPsycho.griefLevel}/10, Stress: ${latestPsycho.stressLevel}/10`
                });
                recommendations.push('Seek professional mental health support and stress management');
            }

            // Work stress
            if (latestPsycho.workStress >= 7) {
                totalRiskScore += this.riskFactors.workStress.weight;
                riskFactors.push({
                    factor: 'Work-Related Stress',
                    weight: this.riskFactors.workStress.weight,
                    description: this.riskFactors.workStress.description,
                    value: `${latestPsycho.workStress}/10`
                });
                recommendations.push('Implement work-life balance strategies and stress reduction techniques');
            }
        }

        // Determine risk level
        let riskLevel = 'LOW';
        if (totalRiskScore >= this.riskThresholds.CRITICAL) {
            riskLevel = 'CRITICAL';
        } else if (totalRiskScore >= this.riskThresholds.HIGH) {
            riskLevel = 'HIGH';
        } else if (totalRiskScore >= this.riskThresholds.MODERATE) {
            riskLevel = 'MODERATE';
        }

        // Generate alert if risk is elevated
        let alert = null;
        if (riskLevel === 'HIGH' || riskLevel === 'CRITICAL') {
            alert = {
                timestamp,
                level: riskLevel,
                message: `Your acute myocardial infarction risk is elevated today (${riskLevel} risk level).`,
                urgent: riskLevel === 'CRITICAL',
                recommendations: recommendations.slice(0, 3) // Top 3 recommendations
            };
            user.alerts.push(alert);
        }

        const assessment = {
            timestamp,
            totalRiskScore,
            riskLevel,
            riskFactors,
            recommendations,
            alert
        };

        user.riskAssessments.push(assessment);
        console.log(`⚠️ Risk assessment for ${userId}: ${riskLevel} (${totalRiskScore} points)`);
        
        return assessment;
    }

    // ===== Scenario Simulation =====
    simulateRiskScenario(userId, scenario) {
        const user = this._getUserData(userId);
        const baseAssessment = this.assessCardiovascularRisk(userId);
        const baseScore = baseAssessment.totalRiskScore;
        
        let scenarioScore = baseScore;
        const scenarioChanges = [];

        // Simulate lifestyle changes
        if (scenario.skipExercise) {
            scenarioScore += this.riskFactors.sedentary.weight;
            scenarioChanges.push(`Skipping exercise: +${this.riskFactors.sedentary.weight} points`);
        }

        if (scenario.sleepLess) {
            scenarioScore += this.riskFactors.sleepDeprivation.weight;
            scenarioChanges.push(`Sleeping <6 hours: +${this.riskFactors.sleepDeprivation.weight} points`);
        }

        if (scenario.increaseStress) {
            scenarioScore += this.riskFactors.workStress.weight;
            scenarioChanges.push(`Increased stress: +${this.riskFactors.workStress.weight} points`);
        }

        if (scenario.poorDiet) {
            scenarioScore += this.riskFactors.poorDiet.weight;
            scenarioChanges.push(`Poor diet: +${this.riskFactors.poorDiet.weight} points`);
        }

        // Calculate percentage change
        const percentageChange = baseScore > 0 ? ((scenarioScore - baseScore) / baseScore) * 100 : 0;

        const simulation = {
            timestamp: moment().toISOString(),
            baseScore,
            scenarioScore,
            percentageChange,
            scenarioChanges,
            riskIncrease: scenarioScore > baseScore,
            message: `Scenario simulation: ${scenarioChanges.length > 0 ? 
                `${scenarioChanges.join(', ')} increases risk by ${Math.abs(percentageChange).toFixed(1)}%` : 
                'No significant risk change'}`
        };

        console.log(`🎭 Risk simulation for ${userId}: ${simulation.message}`);
        return simulation;
    }

    // ===== Get User Data =====
    getUserRiskProfile(userId) {
        const user = this._getUserData(userId);
        const latestAssessment = user.riskAssessments[user.riskAssessments.length - 1];
        const recentAlerts = user.alerts.filter(alert => 
            moment(alert.timestamp).isAfter(moment().subtract(7, 'days'))
        );

        return {
            userId,
            currentRiskLevel: latestAssessment?.riskLevel || 'UNKNOWN',
            currentRiskScore: latestAssessment?.totalRiskScore || 0,
            recentAlerts: recentAlerts.length,
            lastAssessment: latestAssessment?.timestamp,
            dataPoints: {
                physiological: user.physiologicalMetrics.length,
                lifestyle: user.lifestyleData.length,
                psychosocial: user.psychosocialData.length,
                medications: user.medicationRecords.filter(med => med.isActive).length
            }
        };
    }

    getRiskTrends(userId, days = 30) {
        const user = this._getUserData(userId);
        const cutoffDate = moment().subtract(days, 'days');
        
        const recentAssessments = user.riskAssessments.filter(assessment =>
            moment(assessment.timestamp).isAfter(cutoffDate)
        );

        if (recentAssessments.length < 2) {
            return { message: 'Insufficient data for trend analysis' };
        }

        const trends = recentAssessments.map(assessment => ({
            date: moment(assessment.timestamp).format('YYYY-MM-DD'),
            riskScore: assessment.totalRiskScore,
            riskLevel: assessment.riskLevel
        }));

        const averageRisk = trends.reduce((sum, t) => sum + t.riskScore, 0) / trends.length;
        const trendDirection = trends[trends.length - 1].riskScore > trends[0].riskScore ? 'increasing' : 'decreasing';

        return {
            period: `${days} days`,
            trends,
            averageRisk: Math.round(averageRisk),
            trendDirection,
            assessmentCount: trends.length
        };
    }

    // ===== Utility Methods =====
    _num(value) {
        if (value === null || value === undefined || value === '') return null;
        const n = Number(value);
        return Number.isFinite(n) ? n : null;
    }

    _round(value, decimals = 2) {
        if (value === null || value === undefined || !Number.isFinite(value)) return null;
        const p = Math.pow(10, decimals);
        return Math.round(value * p) / p;
    }
}

module.exports = CardiovascularWarningManager;

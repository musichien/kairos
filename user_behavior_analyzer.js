/**
 * User Behavior Analyzer - 실시간 사용자 행동 분석 및 개인화 시스템
 */

const fs = require('fs').promises;
const path = require('path');

class UserBehaviorAnalyzer {
    constructor() {
        this.userProfiles = new Map();
        this.behaviorPatterns = new Map();
        this.interactionHistory = new Map();
        
        this.dataPath = path.join(__dirname, 'user_behavior_data');
        this.ensureDataDirectory();
    }

    async ensureDataDirectory() {
        try {
            await fs.mkdir(this.dataPath, { recursive: true });
        } catch (error) {
            console.log('📁 User behavior data directory already exists');
        }
    }

    recordUserBehavior(userId, behaviorType, data) {
        if (!this.userProfiles.has(userId)) {
            this.createUserProfile(userId);
        }

        const timestamp = new Date().toISOString();
        const behaviorRecord = {
            timestamp,
            type: behaviorType,
            data,
            sessionId: this.getCurrentSessionId(userId)
        };

        if (!this.interactionHistory.has(userId)) {
            this.interactionHistory.set(userId, []);
        }
        this.interactionHistory.get(userId).push(behaviorRecord);
        this.updateUserProfile(userId, behaviorType, data);

        return behaviorRecord;
    }

    createUserProfile(userId) {
        const profile = {
            userId,
            createdAt: new Date().toISOString(),
            lastActive: new Date().toISOString(),
            totalInteractions: 0,
            preferredFeatures: [],
            cognitiveLevel: 'beginner',
            trustLevel: 'medium'
        };

        this.userProfiles.set(userId, profile);
        this.behaviorPatterns.set(userId, {
            featureUsage: {},
            timePatterns: {},
            satisfactionTrends: []
        });

        return profile;
    }

    updateUserProfile(userId, behaviorType, data) {
        const profile = this.userProfiles.get(userId);
        if (!profile) return;

        profile.lastActive = new Date().toISOString();
        profile.totalInteractions++;

        if (behaviorType === 'feature_usage' && data.feature) {
            if (!profile.preferredFeatures.includes(data.feature)) {
                profile.preferredFeatures.push(data.feature);
            }
        }
    }

    generatePersonalizedSettings(userId) {
        const profile = this.userProfiles.get(userId);
        if (!profile) {
            return this.getDefaultPersonalization();
        }

        return {
            responseStyle: this.determineResponseStyle(profile),
            detailLevel: this.determineDetailLevel(profile),
            culturalSensitivity: 'high',
            memoryIntegration: 'enabled',
            cognitiveTraining: 'adaptive',
            featureRecommendations: this.generateFeatureRecommendations(profile)
        };
    }

    generatePersonalizedResponse(userId) {
        return this.generatePersonalizedSettings(userId);
    }

    determineResponseStyle(profile) {
        if (profile.cognitiveLevel === 'advanced') return 'detailed';
        else if (profile.cognitiveLevel === 'beginner') return 'patient';
        else return 'balanced';
    }

    determineDetailLevel(profile) {
        if (profile.cognitiveLevel === 'advanced') return 'very_high';
        else if (profile.cognitiveLevel === 'beginner') return 'high';
        else return 'medium';
    }

    generateFeatureRecommendations(profile) {
        const recommendations = [];
        const advancedFeatures = ['brain_research', 'collective_modeling', 'embodied_identity'];
        
        advancedFeatures.forEach(feature => {
            if (!profile.preferredFeatures.includes(feature) && profile.cognitiveLevel === 'advanced') {
                recommendations.push({
                    feature,
                    reason: '고급 사용자에게 적합한 기능',
                    priority: 'high'
                });
            }
        });

        return recommendations.slice(0, 3);
    }

    getDefaultPersonalization() {
        return {
            responseStyle: 'balanced',
            detailLevel: 'medium',
            culturalSensitivity: 'high',
            memoryIntegration: 'enabled',
            cognitiveTraining: 'adaptive',
            featureRecommendations: []
        };
    }

    getCurrentSessionId(userId) {
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        return `${userId}_${dateStr}_${Math.floor(now.getHours() / 6)}`;
    }
}

module.exports = UserBehaviorAnalyzer;

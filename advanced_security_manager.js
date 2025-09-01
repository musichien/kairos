/**
 * Advanced Security Manager - 고급 보안 및 프라이버시 관리 시스템
 * 
 * 이 모듈은 데이터 보호, 접근 제어, 감사 로깅, 암호화 등을 통해
 * 시스템의 보안을 강화하고 사용자 프라이버시를 보호합니다.
 */

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class AdvancedSecurityManager {
    constructor() {
        this.securityConfig = {
            encryptionEnabled: true,
            auditLogging: true,
            accessControl: true,
            rateLimiting: true,
            dataRetention: 90, // 일
            maxLoginAttempts: 5,
            sessionTimeout: 3600, // 초
            encryptionAlgorithm: 'aes-256-gcm',
            hashAlgorithm: 'sha256',
            jwtSecret: process.env.JWT_SECRET || this.generateSecureSecret(),
            encryptionKey: process.env.ENCRYPTION_KEY || this.generateEncryptionKey()
        };
        
        this.activeSessions = new Map();
        this.failedLoginAttempts = new Map();
        this.accessLogs = [];
        this.securityEvents = [];
        
        this.dataPath = path.join(__dirname, 'security_data');
        this.ensureSecurityDirectory();
        this.loadSecurityData();
        this.initializeSecurityPolicies();
    }

    async ensureSecurityDirectory() {
        try {
            await fs.mkdir(this.dataPath, { recursive: true });
        } catch (error) {
            console.log('🔒 Security data directory already exists');
        }
    }

    async loadSecurityData() {
        try {
            const files = await fs.readdir(this.dataPath);
            for (const file of files) {
                if (file.endsWith('.json')) {
                    const data = await fs.readFile(path.join(this.dataPath, file), 'utf8');
                    const securityData = JSON.parse(data);
                    this.loadSecurityDataFromFile(securityData);
                }
            }
        } catch (error) {
            console.log('🔒 No security data found, starting fresh');
        }
    }

    loadSecurityDataFromFile(securityData) {
        if (securityData.accessLogs) {
            this.accessLogs.push(...securityData.accessLogs);
        }
        if (securityData.securityEvents) {
            this.securityEvents.push(...securityData.securityEvents);
        }
    }

    initializeSecurityPolicies() {
        // 보안 정책 초기화
        this.securityPolicies = {
            dataClassification: {
                public: { encryption: false, access: 'unrestricted' },
                internal: { encryption: true, access: 'authenticated' },
                confidential: { encryption: true, access: 'authorized' },
                restricted: { encryption: true, access: 'admin_only' }
            },
            accessLevels: {
                guest: ['public'],
                user: ['public', 'internal'],
                premium: ['public', 'internal', 'confidential'],
                admin: ['public', 'internal', 'confidential', 'restricted']
            }
        };
    }

    // JWT 토큰 생성 (Node.js 내장 모듈 사용)
    generateJWT(userId, userRole, additionalClaims = {}) {
        try {
            const payload = {
                userId,
                role: userRole,
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + this.securityConfig.sessionTimeout,
                ...additionalClaims
            };
            
            const header = {
                alg: 'HS256',
                typ: 'JWT'
            };
            
            const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
            const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
            
            const signature = crypto.createHmac('sha256', this.securityConfig.jwtSecret)
                .update(`${encodedHeader}.${encodedPayload}`)
                .digest('base64url');
            
            return `${encodedHeader}.${encodedPayload}.${signature}`;
        } catch (error) {
            console.error('JWT 생성 오류:', error);
            return null;
        }
    }

    // JWT 토큰 검증 (Node.js 내장 모듈 사용)
    verifyJWT(token) {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) {
                return null;
            }
            
            const [encodedHeader, encodedPayload, signature] = parts;
            
            const expectedSignature = crypto.createHmac('sha256', this.securityConfig.jwtSecret)
                .update(`${encodedHeader}.${encodedPayload}`)
                .digest('base64url');
            
            if (signature !== expectedSignature) {
                return null;
            }
            
            const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString());
            
            // 만료 시간 확인
            if (payload.exp && Date.now() >= payload.exp * 1000) {
                return null;
            }
            
            return payload;
        } catch (error) {
            console.error('JWT 검증 오류:', error);
            return null;
        }
    }

    // 보안 이벤트 기록
    logSecurityEvent(eventType, details, severity = 'info', userId = null) {
        const securityEvent = {
            timestamp: new Date().toISOString(),
            eventType,
            details,
            severity,
            userId,
            ipAddress: details.ipAddress || 'unknown',
            userAgent: details.userAgent || 'unknown',
            sessionId: details.sessionId || null
        };

        this.securityEvents.push(securityEvent);
        return securityEvent;
    }

    // 접근 로그 기록
    logAccess(userId, action, resource, success, details = {}) {
        const accessLog = {
            timestamp: new Date().toISOString(),
            userId,
            action,
            resource,
            success,
            ipAddress: details.ipAddress || 'unknown',
            userAgent: details.userAgent || 'unknown',
            sessionId: details.sessionId || null,
            responseTime: details.responseTime || 0,
            dataSize: details.dataSize || 0
        };

        this.accessLogs.push(accessLog);
        return accessLog;
    }

    // 보안 상태 확인
    getSecurityStatus() {
        return {
            encryptionEnabled: this.securityConfig.encryptionEnabled,
            auditLogging: this.securityConfig.auditLogging,
            accessControl: this.securityConfig.accessControl,
            activeSessions: this.activeSessions.size,
            recentSecurityEvents: this.securityEvents.slice(-10),
            systemHealth: 'healthy'
        };
    }

    // 보안 감사 보고서 생성
    generateSecurityAuditReport(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        const relevantEvents = this.securityEvents.filter(event => {
            const eventDate = new Date(event.timestamp);
            return eventDate >= start && eventDate <= end;
        });

        const relevantLogs = this.accessLogs.filter(log => {
            const logDate = new Date(log.timestamp);
            return logDate >= start && logDate <= end;
        });

        return {
            period: { start: startDate, end: endDate },
            summary: {
                totalSecurityEvents: relevantEvents.length,
                totalAccessLogs: relevantLogs.length,
                highSeverityEvents: relevantEvents.filter(e => e.severity === 'high').length,
                criticalEvents: relevantEvents.filter(e => e.severity === 'critical').length
            },
            securityEvents: relevantEvents,
            accessLogs: relevantLogs
        };
    }

    // 보안 알림 조회
    getSecurityAlerts() {
        const alerts = [];
        
        // 최근 보안 이벤트 분석
        const recentEvents = this.securityEvents.slice(-24);
        
        // 높은 심각도 이벤트 확인
        const highSeverityEvents = recentEvents.filter(e => e.severity === 'high' || e.severity === 'critical');
        if (highSeverityEvents.length > 0) {
            alerts.push({
                level: 'high',
                message: `${highSeverityEvents.length}개의 높은 심각도 보안 이벤트가 발생했습니다.`,
                events: highSeverityEvents
            });
        }

        return alerts;
    }

    // 보안 알림 생성 (generateAlerts 별칭)
    generateAlerts() {
        return this.getSecurityAlerts();
    }

    // 보안 시크릿 생성
    generateSecureSecret() {
        return crypto.randomBytes(64).toString('hex');
    }

    // 암호화 키 생성
    generateEncryptionKey() {
        return crypto.randomBytes(32).toString('hex');
    }
}

module.exports = AdvancedSecurityManager;

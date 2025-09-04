const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

/**
 * 🔐 Security Manager for Mnemosyne
 * Handles data encryption, access control, authentication, and data integrity
 */
class SecurityManager {
  constructor() {
    this.algorithm = 'aes-256-gcm';
    this.keyLength = 32;
    this.ivLength = 16;
    this.tagLength = 16;
    this.secretKey = process.env.MNEMOSYNE_SECRET_KEY || this.generateSecretKey();
    this.accessTokens = new Map();
    this.userPermissions = new Map();
    
    console.log('🔐 Security Manager initialized');
  }

  // 비밀 키 생성
  generateSecretKey() {
    const key = crypto.randomBytes(this.keyLength);
    console.log('⚠️  Generated new secret key. Set MNEMOSYNE_SECRET_KEY environment variable for production.');
    return key;
  }

  // 데이터 암호화
  encryptData(data) {
    try {
      const iv = crypto.randomBytes(this.ivLength);
      const cipher = crypto.createCipher(this.algorithm, this.secretKey);
      cipher.setAAD(Buffer.from('mnemosyne'));
      
      let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const tag = cipher.getAuthTag();
      
      return {
        encrypted: encrypted,
        iv: iv.toString('hex'),
        tag: tag.toString('hex'),
        algorithm: this.algorithm
      };
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Data encryption failed');
    }
  }

  // 데이터 복호화
  decryptData(encryptedData) {
    try {
      const decipher = crypto.createDecipher(this.algorithm, this.secretKey);
      decipher.setAAD(Buffer.from('mnemosyne'));
      decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));
      
      let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Data decryption failed');
    }
  }

  // 해시 생성
  generateHash(data) {
    return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
  }

  // 데이터 무결성 검증
  verifyDataIntegrity(data, expectedHash) {
    const actualHash = this.generateHash(data);
    return actualHash === expectedHash;
  }

  // 접근 토큰 생성
  generateAccessToken(userId, permissions = ['read']) {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24시간
    
    this.accessTokens.set(token, {
      userId: userId,
      permissions: permissions,
      expiresAt: expiresAt,
      createdAt: Date.now()
    });
    
    return token;
  }

  // 접근 토큰 검증
  validateAccessToken(token, requiredPermissions = []) {
    const tokenData = this.accessTokens.get(token);
    
    if (!tokenData) {
      return { valid: false, reason: 'Token not found' };
    }
    
    if (Date.now() > tokenData.expiresAt) {
      this.accessTokens.delete(token);
      return { valid: false, reason: 'Token expired' };
    }
    
    // 권한 검증
    if (requiredPermissions.length > 0) {
      const hasPermission = requiredPermissions.every(permission => 
        tokenData.permissions.includes(permission)
      );
      
      if (!hasPermission) {
        return { valid: false, reason: 'Insufficient permissions' };
      }
    }
    
    return { valid: true, userId: tokenData.userId, permissions: tokenData.permissions };
  }

  // 사용자 권한 설정
  setUserPermissions(userId, permissions) {
    this.userPermissions.set(userId, permissions);
  }

  // 사용자 권한 확인
  checkUserPermissions(userId, requiredPermissions = []) {
    const userPerms = this.userPermissions.get(userId) || [];
    
    if (requiredPermissions.length === 0) {
      return true;
    }
    
    return requiredPermissions.every(permission => userPerms.includes(permission));
  }

  // 접근 제어
  enforceAccessControl(userId, resource, action) {
    const userPerms = this.userPermissions.get(userId) || [];
    
    // 기본 권한 규칙
    const accessRules = {
      'memory': {
        'read': ['read', 'admin'],
        'write': ['write', 'admin'],
        'delete': ['admin']
      },
      'mnemosyne': {
        'read': ['read', 'write', 'admin'],
        'write': ['write', 'admin'],
        'delete': ['admin']
      },
      'security': {
        'read': ['admin'],
        'write': ['admin'],
        'delete': ['admin']
      }
    };
    
    const resourceRules = accessRules[resource] || {};
    const requiredPermissions = resourceRules[action] || [];
    
    return this.checkUserPermissions(userId, requiredPermissions);
  }

  // 보안 감사 로그
  logSecurityEvent(event) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event: event.type,
      userId: event.userId,
      resource: event.resource,
      action: event.action,
      ip: event.ip,
      userAgent: event.userAgent,
      success: event.success,
      details: event.details
    };
    
    console.log('🔐 Security Event:', logEntry);
    
    // 로그 파일에 저장
    this.saveSecurityLog(logEntry);
  }

  // 보안 로그 저장
  async saveSecurityLog(logEntry) {
    try {
      const logDir = path.join(__dirname, 'security_logs');
      await fs.mkdir(logDir, { recursive: true });
      
      const logFile = path.join(logDir, `security_${new Date().toISOString().split('T')[0]}.log`);
      
      let logs = [];
      try {
        const existingLogs = await fs.readFile(logFile, 'utf8');
        logs = JSON.parse(existingLogs);
      } catch (error) {
        // 파일이 없거나 읽을 수 없는 경우 빈 배열로 시작
      }
      
      logs.push(logEntry);
      await fs.writeFile(logFile, JSON.stringify(logs, null, 2), 'utf8');
    } catch (error) {
      console.error('Security log save error:', error);
    }
  }

  // 데이터 백업 암호화
  async createEncryptedBackup(data, backupPath) {
    try {
      const encryptedData = this.encryptData(data);
      const backup = {
        timestamp: new Date().toISOString(),
        data: encryptedData,
        integrityHash: this.generateHash(data)
      };
      
      await fs.writeFile(backupPath, JSON.stringify(backup, null, 2), 'utf8');
      return backupPath;
    } catch (error) {
      console.error('Encrypted backup creation error:', error);
      throw new Error('Encrypted backup creation failed');
    }
  }

  // 암호화된 백업 복원
  async restoreEncryptedBackup(backupPath) {
    try {
      const backupData = await fs.readFile(backupPath, 'utf8');
      const backup = JSON.parse(backupData);
      
      // 데이터 무결성 검증
      if (!this.verifyDataIntegrity(backup.data, backup.integrityHash)) {
        throw new Error('Backup integrity check failed');
      }
      
      // 데이터 복호화
      const decryptedData = this.decryptData(backup.data);
      return decryptedData;
    } catch (error) {
      console.error('Encrypted backup restoration error:', error);
      throw new Error('Encrypted backup restoration failed');
    }
  }

  // 보안 정책 검증
  validateSecurityPolicy(data) {
    const policy = {
      maxDataSize: 10 * 1024 * 1024, // 10MB
      allowedDataTypes: ['text', 'json', 'number', 'boolean'],
      sensitiveFields: ['password', 'token', 'key', 'secret']
    };
    
    const violations = [];
    
    // 데이터 크기 검증
    const dataSize = JSON.stringify(data).length;
    if (dataSize > policy.maxDataSize) {
      violations.push(`Data size ${dataSize} exceeds limit ${policy.maxDataSize}`);
    }
    
    // 민감한 필드 검증
    const checkSensitiveFields = (obj, path = '') => {
      for (const [key, value] of Object.entries(obj)) {
        const currentPath = path ? `${path}.${key}` : key;
        
        if (policy.sensitiveFields.some(field => key.toLowerCase().includes(field))) {
          violations.push(`Sensitive field detected: ${currentPath}`);
        }
        
        if (typeof value === 'object' && value !== null) {
          checkSensitiveFields(value, currentPath);
        }
      }
    };
    
    checkSensitiveFields(data);
    
    return {
      valid: violations.length === 0,
      violations: violations
    };
  }

  // 보안 통계
  getSecurityStats() {
    const stats = {
      activeTokens: this.accessTokens.size,
      registeredUsers: this.userPermissions.size,
      totalSecurityEvents: 0, // 로그 파일에서 계산
      lastSecurityEvent: null
    };
    
    return stats;
  }

  // 토큰 정리 (만료된 토큰 제거)
  cleanupExpiredTokens() {
    const now = Date.now();
    let cleanedCount = 0;
    
    for (const [token, data] of this.accessTokens.entries()) {
      if (now > data.expiresAt) {
        this.accessTokens.delete(token);
        cleanedCount++;
      }
    }
    
    if (cleanedCount > 0) {
      console.log(`🔐 Cleaned up ${cleanedCount} expired tokens`);
    }
    
    return cleanedCount;
  }

  // 정기 정리 작업 시작
  startCleanupScheduler() {
    setInterval(() => {
      this.cleanupExpiredTokens();
    }, 60 * 60 * 1000); // 1시간마다
    
    console.log('🔐 Security cleanup scheduler started');
  }

  // 감사 이벤트 로깅
  async logAuditEvent(eventType, userId, details = {}) {
    try {
      const auditLog = {
        timestamp: new Date().toISOString(),
        eventType: eventType,
        userId: userId,
        details: details,
        ip: details.ip || 'unknown'
      };
      
      // 감사 로그를 파일에 저장
      const auditDir = path.join(__dirname, 'audit_logs');
      await fs.mkdir(auditDir, { recursive: true });
      
      const auditFile = path.join(auditDir, `audit_${new Date().toISOString().split('T')[0]}.json`);
      
      let logs = [];
      try {
        const existingData = await fs.readFile(auditFile, 'utf8');
        logs = JSON.parse(existingData);
      } catch (error) {
        // 파일이 없거나 읽을 수 없는 경우 빈 배열로 시작
      }
      
      logs.push(auditLog);
      await fs.writeFile(auditFile, JSON.stringify(logs, null, 2));
      
      console.log(`🔒 Audit Event: ${eventType} - User: ${userId}`);
      return true;
    } catch (error) {
      console.error('Audit logging failed:', error);
      return false;
    }
  }
}

module.exports = SecurityManager;

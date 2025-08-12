const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');

/**
 * 🔒 Kairos Security Module
 * 
 * 프라이버시 중심의 온디바이스 처리를 위한 종합 보안 시스템
 * - 데이터 암호화/복호화
 * - 메모리 파일 보안
 * - 접근 제어 및 인증
 * - 감사 로그
 */

class SecurityManager {
  constructor() {
    this.algorithm = 'aes-256-gcm';
    this.keyLength = 32;
    this.ivLength = 16;
    this.saltLength = 64;
    this.tagLength = 16;
    
    // 환경 변수에서 암호화 키 가져오기 (없으면 생성)
    this.encryptionKey = process.env.KAIROS_ENCRYPTION_KEY || this.generateEncryptionKey();
    this.masterKey = process.env.KAIROS_MASTER_KEY || this.generateMasterKey();
    
    // 보안 설정
    this.securityConfig = {
      maxLoginAttempts: 5,
      lockoutDuration: 15 * 60 * 1000, // 15분
      sessionTimeout: 24 * 60 * 60 * 1000, // 24시간
      passwordMinLength: 8,
      requireSpecialChars: true,
      encryptionEnabled: true,
      auditLogging: true
    };
    
    // 감사 로그 디렉토리
    this.auditLogDir = path.join(__dirname, 'logs', 'audit');
    this.ensureAuditLogDir();
    
    // 실패한 로그인 시도 추적
    this.failedAttempts = new Map();
    
    console.log('🔒 보안 매니저 초기화 완료');
  }

  // 감사 로그 디렉토리 생성
  async ensureAuditLogDir() {
    try {
      await fs.access(this.auditLogDir);
    } catch (error) {
      await fs.mkdir(this.auditLogDir, { recursive: true });
      console.log('📁 감사 로그 디렉토리 생성됨:', this.auditLogDir);
    }
  }

  // 암호화 키 생성
  generateEncryptionKey() {
    const key = crypto.randomBytes(this.keyLength);
    console.log('🔑 새로운 암호화 키 생성됨');
    return key.toString('hex');
  }

  // 마스터 키 생성
  generateMasterKey() {
    const key = crypto.randomBytes(this.keyLength);
    console.log('🔑 새로운 마스터 키 생성됨');
    return key.toString('hex');
  }

  // 데이터 암호화
  encryptData(data) {
    if (!this.securityConfig.encryptionEnabled) {
      return data;
    }

    try {
      const iv = crypto.randomBytes(this.ivLength);
      const salt = crypto.randomBytes(this.saltLength);
      
      // 키 유도
      const key = crypto.pbkdf2Sync(
        this.encryptionKey, 
        salt, 
        100000, // 반복 횟수
        this.keyLength, 
        'sha512'
      );
      
      const cipher = crypto.createCipher(this.algorithm, key);
      cipher.setAAD(Buffer.from('kairos-memory-data', 'utf8'));
      
      let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const tag = cipher.getAuthTag();
      
      return {
        encrypted: encrypted,
        iv: iv.toString('hex'),
        salt: salt.toString('hex'),
        tag: tag.toString('hex'),
        algorithm: this.algorithm,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('🔒 데이터 암호화 실패:', error);
      throw new Error('데이터 암호화 중 오류가 발생했습니다.');
    }
  }

  // 데이터 복호화
  decryptData(encryptedData) {
    if (!this.securityConfig.encryptionEnabled) {
      return encryptedData;
    }

    try {
      const { encrypted, iv, salt, tag, algorithm } = encryptedData;
      
      if (algorithm !== this.algorithm) {
        throw new Error('지원하지 않는 암호화 알고리즘입니다.');
      }
      
      // 키 유도
      const key = crypto.pbkdf2Sync(
        this.encryptionKey, 
        Buffer.from(salt, 'hex'), 
        100000, 
        this.keyLength, 
        'sha512'
      );
      
      const decipher = crypto.createDecipher(this.algorithm, key);
      decipher.setAAD(Buffer.from('kairos-memory-data', 'utf8'));
      decipher.setAuthTag(Buffer.from(tag, 'hex'));
      
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('🔒 데이터 복호화 실패:', error);
      throw new Error('데이터 복호화 중 오류가 발생했습니다.');
    }
  }

  // 안전한 메모리 파일 저장
  async saveSecureMemory(userId, memory) {
    try {
      const filePath = path.join(__dirname, 'memories', `${userId}.enc`);
      
      // 메모리 데이터 암호화
      const encryptedMemory = this.encryptData(memory);
      
      // 파일에 저장
      await fs.writeFile(filePath, JSON.stringify(encryptedMemory, null, 2), 'utf8');
      
      // 감사 로그 기록
      await this.logAuditEvent('MEMORY_SAVE', userId, {
        fileSize: JSON.stringify(encryptedMemory).length,
        encryptionEnabled: this.securityConfig.encryptionEnabled
      });
      
      return true;
    } catch (error) {
      console.error('🔒 안전한 메모리 저장 실패:', error);
      throw error;
    }
  }

  // 안전한 메모리 파일 로드
  async loadSecureMemory(userId) {
    try {
      const filePath = path.join(__dirname, 'memories', `${userId}.enc`);
      
      // 파일 읽기
      const data = await fs.readFile(filePath, 'utf8');
      const encryptedMemory = JSON.parse(data);
      
      // 데이터 복호화
      const memory = this.decryptData(encryptedMemory);
      
      // 감사 로그 기록
      await this.logAuditEvent('MEMORY_LOAD', userId, {
        fileSize: data.length,
        encryptionEnabled: this.securityConfig.encryptionEnabled
      });
      
      return memory;
    } catch (error) {
      if (error.code === 'ENOENT') {
        // 파일이 없으면 기본 메모리 생성
        return this.createDefaultMemory(userId);
      }
      console.error('🔒 안전한 메모리 로드 실패:', error);
      throw error;
    }
  }

  // 기본 메모리 생성
  async createDefaultMemory(userId) {
    const defaultMemory = {
      userId: userId,
      conversations: [],
      facts: [],
      preferences: [],
      lifeEvents: [],
      emotionalStates: [],
      relationships: [],
      goals: [],
      interests: [],
      memories: [],
      contextPatterns: [],
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      securityMetadata: {
        createdWith: 'SecurityManager',
        encryptionVersion: '1.0',
        lastSecurityUpdate: new Date().toISOString()
      }
    };
    
    await this.saveSecureMemory(userId, defaultMemory);
    return defaultMemory;
  }

  // 비밀번호 해싱
  async hashPassword(password) {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  // 비밀번호 검증
  async verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  // 비밀번호 강도 검증
  validatePasswordStrength(password) {
    const minLength = this.securityConfig.passwordMinLength;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const errors = [];
    
    if (password.length < minLength) {
      errors.push(`비밀번호는 최소 ${minLength}자 이상이어야 합니다.`);
    }
    if (!hasUpperCase) {
      errors.push('대문자를 포함해야 합니다.');
    }
    if (!hasLowerCase) {
      errors.push('소문자를 포함해야 합니다.');
    }
    if (!hasNumbers) {
      errors.push('숫자를 포함해야 합니다.');
    }
    if (this.securityConfig.requireSpecialChars && !hasSpecialChars) {
      errors.push('특수문자를 포함해야 합니다.');
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors,
      strength: this.calculatePasswordStrength(password)
    };
  }

  // 비밀번호 강도 계산
  calculatePasswordStrength(password) {
    let score = 0;
    
    // 길이 점수
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;
    
    // 문자 종류 점수
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
    
    // 중복 문자 감점
    const uniqueChars = new Set(password).size;
    if (uniqueChars < password.length * 0.7) score -= 1;
    
    if (score <= 2) return 'weak';
    if (score <= 4) return 'medium';
    if (score <= 6) return 'strong';
    return 'very_strong';
  }

  // 로그인 시도 제한
  checkLoginAttempts(userId) {
    const attempts = this.failedAttempts.get(userId) || { count: 0, lastAttempt: 0 };
    const now = Date.now();
    
    // 잠금 시간이 지났으면 초기화
    if (now - attempts.lastAttempt > this.securityConfig.lockoutDuration) {
      this.failedAttempts.delete(userId);
      return { allowed: true, remainingAttempts: this.securityConfig.maxLoginAttempts };
    }
    
    // 최대 시도 횟수 초과
    if (attempts.count >= this.securityConfig.maxLoginAttempts) {
      return { 
        allowed: false, 
        remainingAttempts: 0,
        lockoutTime: this.securityConfig.lockoutDuration - (now - attempts.lastAttempt)
      };
    }
    
    return { 
      allowed: true, 
      remainingAttempts: this.securityConfig.maxLoginAttempts - attempts.count 
    };
  }

  // 로그인 실패 기록
  recordFailedLogin(userId) {
    const attempts = this.failedAttempts.get(userId) || { count: 0, lastAttempt: 0 };
    attempts.count += 1;
    attempts.lastAttempt = Date.now();
    this.failedAttempts.set(userId, attempts);
    
    // 감사 로그 기록
    this.logAuditEvent('LOGIN_FAILED', userId, {
      attemptCount: attempts.count,
      ipAddress: 'local'
    });
  }

  // 로그인 성공 기록
  recordSuccessfulLogin(userId) {
    this.failedAttempts.delete(userId);
    
    // 감사 로그 기록
    this.logAuditEvent('LOGIN_SUCCESS', userId, {
      ipAddress: 'local'
    });
  }

  // 감사 로그 기록
  async logAuditEvent(eventType, userId, details = {}) {
    if (!this.securityConfig.auditLogging) return;
    
    try {
      const logEntry = {
        timestamp: new Date().toISOString(),
        eventType: eventType,
        userId: userId,
        details: details,
        sessionId: this.generateSessionId(),
        ipAddress: 'local',
        userAgent: 'Kairos-Local'
      };
      
      const logFile = path.join(this.auditLogDir, `audit-${new Date().toISOString().split('T')[0]}.log`);
      const logLine = JSON.stringify(logEntry) + '\n';
      
      await fs.appendFile(logFile, logLine, 'utf8');
    } catch (error) {
      console.error('🔒 감사 로그 기록 실패:', error);
    }
  }

  // 세션 ID 생성
  generateSessionId() {
    return crypto.randomBytes(32).toString('hex');
  }

  // 데이터 무결성 검증
  validateDataIntegrity(data) {
    try {
      // 필수 필드 검증
      const requiredFields = ['userId', 'conversations', 'facts', 'preferences'];
      for (const field of requiredFields) {
        if (!data.hasOwnProperty(field)) {
          return { isValid: false, error: `필수 필드 누락: ${field}` };
        }
      }
      
      // 데이터 타입 검증
      if (!Array.isArray(data.conversations)) {
        return { isValid: false, error: 'conversations는 배열이어야 합니다.' };
      }
      
      if (!Array.isArray(data.facts)) {
        return { isValid: false, error: 'facts는 배열이어야 합니다.' };
      }
      
      // 데이터 크기 제한 검증
      if (data.conversations.length > 1000) {
        return { isValid: false, error: '대화 기록이 너무 많습니다.' };
      }
      
      return { isValid: true };
    } catch (error) {
      return { isValid: false, error: error.message };
    }
  }

  // 보안 설정 업데이트
  updateSecurityConfig(newConfig) {
    this.securityConfig = { ...this.securityConfig, ...newConfig };
    
    // 감사 로그 기록
    this.logAuditEvent('SECURITY_CONFIG_UPDATE', 'system', {
      changes: newConfig
    });
  }

  // 보안 상태 리포트
  getSecurityStatus() {
    return {
      encryptionEnabled: this.securityConfig.encryptionEnabled,
      auditLogging: this.securityConfig.auditLogging,
      failedAttemptsCount: this.failedAttempts.size,
      securityConfig: this.securityConfig,
      encryptionAlgorithm: this.algorithm,
      keyLength: this.keyLength
    };
  }

  // 메모리 파일 백업 (암호화된 상태로)
  async backupMemory(userId, backupPath) {
    try {
      const memory = await this.loadSecureMemory(userId);
      const backupData = {
        userId: userId,
        data: memory,
        backupTimestamp: new Date().toISOString(),
        version: '1.0',
        checksum: this.generateChecksum(JSON.stringify(memory))
      };
      
      const encryptedBackup = this.encryptData(backupData);
      await fs.writeFile(backupPath, JSON.stringify(encryptedBackup, null, 2), 'utf8');
      
      // 감사 로그 기록
      await this.logAuditEvent('MEMORY_BACKUP', userId, {
        backupPath: backupPath,
        backupSize: JSON.stringify(encryptedBackup).length
      });
      
      return true;
    } catch (error) {
      console.error('🔒 메모리 백업 실패:', error);
      throw error;
    }
  }

  // 체크섬 생성
  generateChecksum(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  // 메모리 파일 복원
  async restoreMemory(userId, backupPath) {
    try {
      const backupData = await fs.readFile(backupPath, 'utf8');
      const encryptedBackup = JSON.parse(backupData);
      const backup = this.decryptData(encryptedBackup);
      
      // 체크섬 검증
      const expectedChecksum = backup.checksum;
      const actualChecksum = this.generateChecksum(JSON.stringify(backup.data));
      
      if (expectedChecksum !== actualChecksum) {
        throw new Error('백업 파일의 무결성이 손상되었습니다.');
      }
      
      // 메모리 복원
      await this.saveSecureMemory(userId, backup.data);
      
      // 감사 로그 기록
      await this.logAuditEvent('MEMORY_RESTORE', userId, {
        backupPath: backupPath,
        restoreTimestamp: new Date().toISOString()
      });
      
      return true;
    } catch (error) {
      console.error('🔒 메모리 복원 실패:', error);
      throw error;
    }
  }

  // 안전한 메모리 삭제
  async secureDeleteMemory(userId) {
    try {
      const filePath = path.join(__dirname, 'memories', `${userId}.enc`);
      
      // 파일을 여러 번 덮어쓰기 (DoD 5220.22-M 표준)
      const fileSize = (await fs.stat(filePath)).size;
      const randomData = crypto.randomBytes(fileSize);
      
      // 3번 덮어쓰기
      for (let i = 0; i < 3; i++) {
        await fs.writeFile(filePath, randomData);
        await fs.writeFile(filePath, Buffer.alloc(fileSize, 0));
        await fs.writeFile(filePath, Buffer.alloc(fileSize, 0xFF));
      }
      
      // 파일 삭제
      await fs.unlink(filePath);
      
      // 감사 로그 기록
      await this.logAuditEvent('MEMORY_DELETE', userId, {
        deletionMethod: 'secure_overwrite',
        overwriteCount: 3
      });
      
      return true;
    } catch (error) {
      console.error('🔒 안전한 메모리 삭제 실패:', error);
      throw error;
    }
  }
}

module.exports = SecurityManager;

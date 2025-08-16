# 🔒 Kairos Security & Privacy Guide

## 🌟 Overview

The Kairos AI Memory Support Server is designed with **privacy-centric on-device processing** as a core value. This guide provides detailed explanations of Kairos's security features and privacy protection measures.

## 🛡️ Core Security Principles

### 1. **On-Device Processing**
- All data is processed only on the user's local device
- No personal information is transmitted to external servers
- All functions operate without internet connection

### 2. **Data Encryption**
- All memory data encrypted using AES-256-GCM algorithm
- Secure key generation through key derivation function (PBKDF2)
- Authenticated encryption ensures data integrity

### 3. **Access Control**
- Strong authentication system
- Login attempt limitations and account lockout
- Session management and automatic logout

### 4. **Audit Logging**
- Records all security-related events
- Access pattern analysis
- Security incident tracking

## 🔐 Detailed Security Features

### **Data Encryption System**

#### Encryption Algorithm
- **Algorithm**: AES-256-GCM (Galois/Counter Mode)
- **Key Length**: 256-bit
- **IV Length**: 128-bit
- **Authentication Tag**: 128-bit

#### Encryption Process
```javascript
// 1. Generate random IV and Salt
const iv = crypto.randomBytes(16);
const salt = crypto.randomBytes(64);

// 2. Key derivation (PBKDF2)
const key = crypto.pbkdf2Sync(
  encryptionKey, 
  salt, 
  100000, // iterations
  32,     // key length
  'sha512'
);

// 3. Encryption
const cipher = crypto.createCipher('aes-256-gcm', key);
cipher.setAAD(Buffer.from('kairos-memory-data', 'utf8'));

let encrypted = cipher.update(data, 'utf8', 'hex');
encrypted += cipher.final('hex');
const tag = cipher.getAuthTag();
```

#### Encrypted Data Structure
```json
{
  "encrypted": "encrypted_data",
  "iv": "initialization_vector_hex",
  "salt": "salt_hex",
  "tag": "authentication_tag_hex",
  "algorithm": "aes-256-gcm",
  "timestamp": "2025-08-11T23:07:33.508Z"
}
```

### **Access Control System**

#### Authentication Process
1. **Token Verification**: Bearer token-based authentication
2. **Session Management**: Automatic session expiration
3. **Access Logging**: Records all authentication attempts

#### Login Attempt Limitations
- **Maximum Attempts**: 5 times
- **Lockout Duration**: 15 minutes
- **Auto Unlock**: Automatically unlocked after lockout period

#### Password Policy
- **Minimum Length**: 8 characters
- **Required Elements**: Uppercase, lowercase, numbers, special characters
- **Strength Validation**: Real-time password strength measurement

### **Audit Logging System**

#### Recorded Events
- **Authentication Events**: Login success/failure
- **Memory Access**: Read/write/delete operations
- **Security Settings**: Configuration changes
- **System Events**: Backup/restore operations

#### Log Structure
```json
{
  "timestamp": "2025-08-11T23:07:33.508Z",
  "eventType": "MEMORY_SAVE",
  "userId": "user_001",
  "details": {
    "fileSize": 2048,
    "encryptionEnabled": true
  },
  "sessionId": "session_1234567890",
  "ipAddress": "local",
  "userAgent": "Kairos-Local"
}
```

## 🔧 Security Configuration

### **Environment Variable Setup**

#### Required Security Keys
```bash
# API authentication key (must be changed)
SECRET_KEY=your-super-secret-key-change-this-immediately

# Data encryption key (32 bytes)
KAIROS_ENCRYPTION_KEY=your-32-byte-encryption-key-here

# Master key (32 bytes)
KAIROS_MASTER_KEY=your-32-byte-master-key-here
```

#### Security Settings
```bash
# Login limitations
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_DURATION=900000

# Encryption settings
ENCRYPTION_ENABLED=true
AUDIT_LOGGING=true

# Request limitations
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000
```

### **Security API Endpoints**

#### Security Status Check
```bash
GET /api/security/status
Authorization: Bearer your-secret-key-here
```

#### Security Configuration Update
```bash
POST /api/security/config
Authorization: Bearer your-secret-key-here
Content-Type: application/json

{
  "encryptionEnabled": true,
  "auditLogging": true,
  "maxLoginAttempts": 5,
  "lockoutDuration": 900000
}
```

#### Memory Backup
```bash
POST /api/security/backup/:userId
Authorization: Bearer your-secret-key-here
```

#### Secure Memory Deletion
```bash
DELETE /api/security/memory/:userId
Authorization: Bearer your-secret-key-here
```

## 🛡️ Privacy Protection Measures

### **Data Lifecycle Management**

#### 1. **Data Creation**
- Data created only locally
- Immediately encrypted and stored
- Minimized metadata

#### 2. **Data Storage**
- Stored locally in encrypted state
- Restricted file system permissions
- Regular integrity verification

#### 3. **Data Processing**
- Decrypted only in memory
- Memory cleared immediately after processing
- Swap file prevention

#### 4. **Data Deletion**
- Complies with DoD 5220.22-M standard
- 3-time overwrite before deletion
- Deletion confirmation and log recording

### **Network Security**

#### CORS Policy
```javascript
// Restrictive settings for production environment
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://your-domain.com'
];
```

#### Request Limitations
- **Rate Limiting**: 100 requests per 15 minutes
- **Request Size**: Maximum 10MB
- **Timeout**: 30 seconds

#### Security Headers
```javascript
// Security header settings through Helmet.js
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "http://localhost:11434"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

## 🔍 Security Monitoring

### **Real-time Monitoring**

#### Security Status Dashboard
- Encryption status verification
- Real-time audit log monitoring
- Access pattern analysis
- Security event notifications

#### Log Analysis
```bash
# Check audit logs
tail -f logs/audit/audit-2025-08-11.log

# Filter security events
grep "AUTH_FAILED" logs/audit/*.log

# Analyze access patterns
grep "MEMORY_ACCESS" logs/audit/*.log | wc -l
```

### **Security Testing**

#### Encryption Testing
```bash
# Test data encryption/decryption
curl -X POST http://localhost:3000/api/security/test-encryption \
  -H "Authorization: Bearer your-secret-key-here" \
  -H "Content-Type: application/json" \
  -d '{"testData": "sensitive information"}'
```

#### Authentication Testing
```bash
# Attempt access with wrong token
curl -X GET http://localhost:3000/api/security/status \
  -H "Authorization: Bearer wrong-token"
```

## 🚨 Security Incident Response

### **Security Incident Types**

#### 1. **Unauthorized Access Attempts**
- **Detection**: Monitor login failure counts
- **Response**: Account lockout and notifications
- **Recovery**: Unlock after administrator verification

#### 2. **Data Integrity Damage**
- **Detection**: Checksum verification
- **Response**: Restore from backup
- **Recovery**: Analyze and fix damage causes

#### 3. **Encryption Key Exposure**
- **Detection**: Analyze key usage patterns
- **Response**: Immediate key replacement
- **Recovery**: Re-encrypt all data

### **Emergency Response Procedures**

#### Step 1: Incident Confirmation
```bash
# Check security status
curl -X GET http://localhost:3000/api/security/status \
  -H "Authorization: Bearer your-secret-key-here"
```

#### Step 2: Impact Assessment
```bash
# Check recent security events
grep "$(date +%Y-%m-%d)" logs/audit/*.log
```

#### Step 3: Response Actions
```bash
# Temporary security enhancement
curl -X POST http://localhost:3000/api/security/config \
  -H "Authorization: Bearer your-secret-key-here" \
  -H "Content-Type: application/json" \
  -d '{"maxLoginAttempts": 3, "lockoutDuration": 1800000}'
```

## 📋 Security Checklist

### **Installation Security Setup**

- [ ] Create environment variable file (.env) and set security keys
- [ ] Change default security keys
- [ ] Verify CORS settings
- [ ] Check firewall settings
- [ ] Set log directory permissions

### **Regular Security Checks**

- [ ] Weekly security status checks
- [ ] Monthly audit log review
- [ ] Quarterly encryption key replacement
- [ ] Backup file integrity verification
- [ ] Apply security patches

### **Production Environment Setup**

- [ ] Apply HTTPS
- [ ] Implement strong password policy
- [ ] Activate login attempt limitations
- [ ] Set audit log retention policy
- [ ] Document backup and recovery procedures

## 🔧 Security Tools and Utilities

### **Security Key Generation**

#### Encryption Key Generation
```bash
# Generate 32-byte random key
openssl rand -hex 32

# Or generate with Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Master Key Generation
```bash
# Generate 32-byte master key
openssl rand -hex 32
```

### **Backup and Recovery**

#### Automatic Backup Script
```bash
#!/bin/bash
# daily-backup.sh

DATE=$(date +%Y%m%d)
BACKUP_DIR="./backups"
USER_ID="user_001"

# Execute backup
curl -X POST "http://localhost:3000/api/security/backup/$USER_ID" \
  -H "Authorization: Bearer your-secret-key-here"

# Delete old backups (30+ days)
find $BACKUP_DIR -name "*.enc" -mtime +30 -delete
```

#### Recovery Script
```bash
#!/bin/bash
# restore-backup.sh

USER_ID="user_001"
BACKUP_PATH="./backups/user_001_backup_20250811.enc"

# Execute recovery
curl -X POST "http://localhost:3000/api/security/restore/$USER_ID" \
  -H "Authorization: Bearer your-secret-key-here" \
  -H "Content-Type: application/json" \
  -d "{\"backupPath\": \"$BACKUP_PATH\"}"
```

## 📚 Additional Security Resources

### **Security Standards and Guidelines**
- **OWASP Top 10**: Web application security risks
- **NIST Cybersecurity Framework**: Cybersecurity framework
- **GDPR**: Personal data protection regulations
- **ISO 27001**: Information security management system

### **Encryption Standards**
- **AES-256-GCM**: Authenticated encryption
- **PBKDF2**: Key derivation function
- **SHA-256**: Hash function
- **DoD 5220.22-M**: Data deletion standard

### **Security Tools**
- **Helmet.js**: Security header configuration
- **Express Rate Limit**: Request limitations
- **Express Validator**: Input validation
- **Bcrypt**: Password hashing

---

**"Privacy is a fundamental right and the foundation of trust."**

*Kairos Project - Privacy-First AI Technology*

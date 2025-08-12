# 🔒 Kairos Security & Privacy Guide

## 🌟 개요

Kairos AI Memory Support Server는 **프라이버시 중심의 온디바이스 처리**를 핵심 가치로 하여 설계되었습니다. 이 가이드는 Kairos의 보안 기능과 프라이버시 보호 방안을 상세히 설명합니다.

## 🛡️ 핵심 보안 원칙

### 1. **온디바이스 처리 (On-Device Processing)**
- 모든 데이터는 사용자의 로컬 디바이스에서만 처리
- 외부 서버로 개인정보 전송 없음
- 인터넷 연결 없이도 모든 기능 동작

### 2. **데이터 암호화 (Data Encryption)**
- AES-256-GCM 알고리즘으로 모든 메모리 데이터 암호화
- 키 유도 함수(PBKDF2)를 통한 안전한 키 생성
- 인증된 암호화(Authenticated Encryption)로 무결성 보장

### 3. **접근 제어 (Access Control)**
- 강력한 인증 시스템
- 로그인 시도 제한 및 계정 잠금
- 세션 관리 및 자동 로그아웃

### 4. **감사 로그 (Audit Logging)**
- 모든 보안 관련 이벤트 기록
- 접근 패턴 분석
- 보안 사고 추적

## 🔐 보안 기능 상세

### **데이터 암호화 시스템**

#### 암호화 알고리즘
- **알고리즘**: AES-256-GCM (Galois/Counter Mode)
- **키 길이**: 256비트
- **IV 길이**: 128비트
- **인증 태그**: 128비트

#### 암호화 과정
```javascript
// 1. 랜덤 IV 및 Salt 생성
const iv = crypto.randomBytes(16);
const salt = crypto.randomBytes(64);

// 2. 키 유도 (PBKDF2)
const key = crypto.pbkdf2Sync(
  encryptionKey, 
  salt, 
  100000, // 반복 횟수
  32,     // 키 길이
  'sha512'
);

// 3. 암호화
const cipher = crypto.createCipher('aes-256-gcm', key);
cipher.setAAD(Buffer.from('kairos-memory-data', 'utf8'));

let encrypted = cipher.update(data, 'utf8', 'hex');
encrypted += cipher.final('hex');
const tag = cipher.getAuthTag();
```

#### 암호화된 데이터 구조
```json
{
  "encrypted": "암호화된 데이터",
  "iv": "초기화 벡터 (hex)",
  "salt": "솔트 (hex)",
  "tag": "인증 태그 (hex)",
  "algorithm": "aes-256-gcm",
  "timestamp": "2025-08-11T23:07:33.508Z"
}
```

### **접근 제어 시스템**

#### 인증 프로세스
1. **토큰 검증**: Bearer 토큰 기반 인증
2. **세션 관리**: 자동 세션 만료
3. **접근 로그**: 모든 인증 시도 기록

#### 로그인 시도 제한
- **최대 시도 횟수**: 5회
- **잠금 시간**: 15분
- **자동 해제**: 잠금 시간 후 자동 해제

#### 비밀번호 정책
- **최소 길이**: 8자
- **필수 요소**: 대문자, 소문자, 숫자, 특수문자
- **강도 검증**: 실시간 비밀번호 강도 측정

### **감사 로그 시스템**

#### 기록되는 이벤트
- **인증 이벤트**: 로그인 성공/실패
- **메모리 접근**: 읽기/쓰기/삭제
- **보안 설정**: 설정 변경
- **시스템 이벤트**: 백업/복원

#### 로그 구조
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

## 🔧 보안 설정

### **환경 변수 설정**

#### 필수 보안 키
```bash
# API 인증 키 (반드시 변경하세요)
SECRET_KEY=your-super-secret-key-change-this-immediately

# 데이터 암호화 키 (32바이트)
KAIROS_ENCRYPTION_KEY=your-32-byte-encryption-key-here

# 마스터 키 (32바이트)
KAIROS_MASTER_KEY=your-32-byte-master-key-here
```

#### 보안 설정
```bash
# 로그인 제한
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_DURATION=900000

# 암호화 설정
ENCRYPTION_ENABLED=true
AUDIT_LOGGING=true

# 요청 제한
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000
```

### **보안 API 엔드포인트**

#### 보안 상태 조회
```bash
GET /api/security/status
Authorization: Bearer your-secret-key-here
```

#### 보안 설정 업데이트
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

#### 메모리 백업
```bash
POST /api/security/backup/:userId
Authorization: Bearer your-secret-key-here
```

#### 안전한 메모리 삭제
```bash
DELETE /api/security/memory/:userId
Authorization: Bearer your-secret-key-here
```

## 🛡️ 프라이버시 보호 방안

### **데이터 수명주기 관리**

#### 1. **데이터 생성**
- 로컬에서만 데이터 생성
- 즉시 암호화하여 저장
- 메타데이터 최소화

#### 2. **데이터 저장**
- 암호화된 상태로 로컬 저장
- 파일 시스템 권한 제한
- 정기적인 무결성 검증

#### 3. **데이터 처리**
- 메모리 내에서만 복호화
- 처리 후 즉시 메모리 정리
- 스왑 파일 방지

#### 4. **데이터 삭제**
- DoD 5220.22-M 표준 준수
- 3회 덮어쓰기 후 삭제
- 삭제 확인 및 로그 기록

### **네트워크 보안**

#### CORS 정책
```javascript
// 프로덕션 환경에서 제한적 설정
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://your-domain.com'
];
```

#### 요청 제한
- **Rate Limiting**: 15분당 100개 요청
- **Request Size**: 최대 10MB
- **Timeout**: 30초

#### 보안 헤더
```javascript
// Helmet.js를 통한 보안 헤더 설정
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

## 🔍 보안 모니터링

### **실시간 모니터링**

#### 보안 상태 대시보드
- 암호화 상태 확인
- 감사 로그 실시간 모니터링
- 접근 패턴 분석
- 보안 이벤트 알림

#### 로그 분석
```bash
# 감사 로그 확인
tail -f logs/audit/audit-2025-08-11.log

# 보안 이벤트 필터링
grep "AUTH_FAILED" logs/audit/*.log

# 접근 패턴 분석
grep "MEMORY_ACCESS" logs/audit/*.log | wc -l
```

### **보안 테스트**

#### 암호화 테스트
```bash
# 데이터 암호화/복호화 테스트
curl -X POST http://localhost:3000/api/security/test-encryption \
  -H "Authorization: Bearer your-secret-key-here" \
  -H "Content-Type: application/json" \
  -d '{"testData": "sensitive information"}'
```

#### 인증 테스트
```bash
# 잘못된 토큰으로 접근 시도
curl -X GET http://localhost:3000/api/security/status \
  -H "Authorization: Bearer wrong-token"
```

## 🚨 보안 사고 대응

### **보안 사고 유형**

#### 1. **무단 접근 시도**
- **감지**: 로그인 실패 횟수 모니터링
- **대응**: 계정 잠금 및 알림
- **복구**: 관리자 확인 후 잠금 해제

#### 2. **데이터 무결성 손상**
- **감지**: 체크섬 검증
- **대응**: 백업에서 복원
- **복구**: 손상 원인 분석 및 수정

#### 3. **암호화 키 노출**
- **감지**: 키 사용 패턴 분석
- **대응**: 즉시 키 교체
- **복구**: 모든 데이터 재암호화

### **응급 대응 절차**

#### 1단계: 사고 확인
```bash
# 보안 상태 확인
curl -X GET http://localhost:3000/api/security/status \
  -H "Authorization: Bearer your-secret-key-here"
```

#### 2단계: 영향 범위 평가
```bash
# 최근 보안 이벤트 확인
grep "$(date +%Y-%m-%d)" logs/audit/*.log
```

#### 3단계: 대응 조치
```bash
# 임시 보안 강화
curl -X POST http://localhost:3000/api/security/config \
  -H "Authorization: Bearer your-secret-key-here" \
  -H "Content-Type: application/json" \
  -d '{"maxLoginAttempts": 3, "lockoutDuration": 1800000}'
```

## 📋 보안 체크리스트

### **설치 시 보안 설정**

- [ ] 환경 변수 파일(.env) 생성 및 보안 키 설정
- [ ] 기본 보안 키 변경
- [ ] CORS 설정 확인
- [ ] 방화벽 설정 확인
- [ ] 로그 디렉토리 권한 설정

### **정기 보안 점검**

- [ ] 보안 상태 주간 점검
- [ ] 감사 로그 월간 검토
- [ ] 암호화 키 분기별 교체
- [ ] 백업 파일 무결성 검증
- [ ] 보안 패치 적용

### **프로덕션 환경 설정**

- [ ] HTTPS 적용
- [ ] 강력한 비밀번호 정책 적용
- [ ] 로그인 시도 제한 활성화
- [ ] 감사 로그 보관 정책 설정
- [ ] 백업 및 복구 절차 문서화

## 🔧 보안 도구 및 유틸리티

### **보안 키 생성**

#### 암호화 키 생성
```bash
# 32바이트 랜덤 키 생성
openssl rand -hex 32

# 또는 Node.js로 생성
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### 마스터 키 생성
```bash
# 32바이트 마스터 키 생성
openssl rand -hex 32
```

### **백업 및 복구**

#### 자동 백업 스크립트
```bash
#!/bin/bash
# daily-backup.sh

DATE=$(date +%Y%m%d)
BACKUP_DIR="./backups"
USER_ID="user_001"

# 백업 실행
curl -X POST "http://localhost:3000/api/security/backup/$USER_ID" \
  -H "Authorization: Bearer your-secret-key-here"

# 오래된 백업 삭제 (30일 이상)
find $BACKUP_DIR -name "*.enc" -mtime +30 -delete
```

#### 복구 스크립트
```bash
#!/bin/bash
# restore-backup.sh

USER_ID="user_001"
BACKUP_PATH="./backups/user_001_backup_20250811.enc"

# 복구 실행
curl -X POST "http://localhost:3000/api/security/restore/$USER_ID" \
  -H "Authorization: Bearer your-secret-key-here" \
  -H "Content-Type: application/json" \
  -d "{\"backupPath\": \"$BACKUP_PATH\"}"
```

## 📚 추가 보안 리소스

### **보안 표준 및 가이드라인**
- **OWASP Top 10**: 웹 애플리케이션 보안 위험
- **NIST Cybersecurity Framework**: 사이버보안 프레임워크
- **GDPR**: 개인정보보호 규정
- **ISO 27001**: 정보보안 관리체계

### **암호화 표준**
- **AES-256-GCM**: 인증된 암호화
- **PBKDF2**: 키 유도 함수
- **SHA-256**: 해시 함수
- **DoD 5220.22-M**: 데이터 삭제 표준

### **보안 도구**
- **Helmet.js**: 보안 헤더 설정
- **Express Rate Limit**: 요청 제한
- **Express Validator**: 입력 검증
- **Bcrypt**: 비밀번호 해싱

---

**"프라이버시는 기본권이자 신뢰의 기반입니다."**

*Kairos Project - Privacy-First AI Technology*

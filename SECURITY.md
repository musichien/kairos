# 🔒 보안 가이드

## 현재 보안 상태

### ⚠️ 보안 위험 요소

1. **ngrok 터널 공개**
   - 모든 요청이 ngrok 로그에 기록됨
   - 대화 내용이 외부에 노출될 수 있음

2. **클라이언트 사이드 인증**
   - 비밀번호가 JavaScript 코드에 평문으로 저장
   - 브라우저 개발자 도구에서 확인 가능

3. **API 키 노출**
   - 토큰이 클라이언트 코드에 하드코딩
   - 누구나 API 호출 가능

## 🛡️ 보안 강화 권장사항

### 1. 프로덕션 환경 사용
```bash
# VPS나 클라우드 서버에 직접 배포
# 도메인과 SSL 인증서 설정
# 방화벽으로 접근 제한
```

### 2. 환경 변수 사용
```bash
# .env 파일 생성 (git에 커밋하지 않음)
SECRET_KEY=your-super-secret-key
ALLOWED_ORIGINS=https://your-domain.com
```

### 3. 서버 사이드 인증
```javascript
// 서버에서 토큰 검증
function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (token !== process.env.SECRET_KEY) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  next();
}
```

### 4. HTTPS 강제
```javascript
// HTTPS 리다이렉트
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});
```

### 5. 요청 제한
```javascript
// Rate limiting 추가
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100 // IP당 최대 요청 수
});
app.use('/v1/chat/completions', limiter);
```

## 🚨 개인정보 보호 주의사항

### 질문 내용에 주의
- **민감한 정보**: 개인정보, 비밀번호, 신용카드 번호 등
- **업무 기밀**: 회사 내부 정보, 전략 등
- **의료 정보**: 건강 상태, 진료 기록 등

### 권장사항
- ✅ **일반적인 질문**: 학습, 창작, 분석 등
- ❌ **민감한 정보**: 개인정보, 기밀사항 등

## 🔐 현재 사용 권장사항

### 개발/테스트용으로만 사용
- 로컬 환경에서만 접근
- ngrok 사용 시 임시로만 사용
- 민감한 정보는 질문하지 않음

### 보안 강화 후 사용
- 위의 보안 강화 방안 적용
- 프로덕션 환경에 배포
- 정기적인 보안 업데이트

## 📞 보안 이슈 신고

보안 취약점을 발견하시면 즉시 연락해 주세요. 
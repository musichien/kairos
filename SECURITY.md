# 🔒 Security Guide

## Current Security Status

### ⚠️ Security Risk Factors

1. **ngrok Tunnel Exposure**
   - All requests are logged in ngrok logs
   - Conversation content may be exposed externally

2. **Client-Side Authentication**
   - Passwords stored in plain text in JavaScript code
   - Accessible through browser developer tools

3. **API Key Exposure**
   - Tokens hardcoded in client code
   - Anyone can make API calls

## 🛡️ Security Enhancement Recommendations

### 1. Use Production Environment
```bash
# Deploy directly to VPS or cloud server
# Set up domain and SSL certificate
# Restrict access with firewall
```

### 2. Use Environment Variables
```bash
# Create .env file (do not commit to git)
SECRET_KEY=your-super-secret-key
ALLOWED_ORIGINS=https://your-domain.com
```

### 3. Server-Side Authentication
```javascript
// Verify tokens on server
function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (token !== process.env.SECRET_KEY) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  next();
}
```

### 4. Force HTTPS
```javascript
// HTTPS redirect
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});
```

### 5. Request Limiting
```javascript
// Add rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // Maximum requests per IP
});
app.use('/v1/chat/completions', limiter);
```

## 🚨 Privacy Protection Warnings

### Be Careful with Question Content
- **Sensitive Information**: Personal information, passwords, credit card numbers, etc.
- **Business Secrets**: Company internal information, strategies, etc.
- **Medical Information**: Health status, medical records, etc.

### Recommendations
- ✅ **General Questions**: Learning, creation, analysis, etc.
- ❌ **Sensitive Information**: Personal data, confidential matters, etc.

## 🔐 Current Usage Recommendations

### Use Only for Development/Testing
- Access only in local environment
- Use ngrok only temporarily
- Do not ask sensitive information

### Use After Security Enhancement
- Apply the security enhancement measures above
- Deploy to production environment
- Regular security updates

## 📞 Security Issue Reporting

If you discover a security vulnerability, please contact us immediately. 
# 🚀 Kairos Development Setup Guide

## ⚠️ **CRITICAL SECURITY NOTICE**

**NEVER use development mode settings in production environments!**

The development mode bypasses authentication and security measures for easier testing and development. This is **ONLY** intended for local development and testing purposes.

## 🔧 Development Environment Configuration

### 1. **Authentication Bypass for Development**

The Kairos server includes an authentication bypass mechanism for development purposes:

```javascript
// In server.js - authenticateToken middleware
if (process.env.NODE_ENV === 'development' || req.headers['x-bypass-auth'] === 'true') {
  console.log('🔓 개발 환경: 인증 우회됨');
  return next();
}
```

### 2. **Setting Development Mode**

#### **Method 1: Environment Variable (Recommended)**
```bash
# Windows PowerShell
$env:NODE_ENV="development"
node server.js

# Windows Command Prompt
set NODE_ENV=development
node server.js

# Linux/macOS
export NODE_ENV=development
node server.js
```

#### **Method 2: Header Bypass**
```bash
# Using curl
curl -H "x-bypass-auth: true" http://localhost:3000/api/consciousness/self-model/test_user

# Using PowerShell
Invoke-RestMethod -Uri "http://localhost:3000/api/consciousness/self-model/test_user" -Headers @{"x-bypass-auth"="true"}
```

### 3. **Development vs Production Security**

| Feature | Development Mode | Production Mode |
|---------|------------------|-----------------|
| Authentication | ❌ Bypassed | ✅ Required (JWT) |
| API Access | 🔓 Open | 🔒 Token Required |
| Security Logging | ⚠️ Minimal | 📊 Full Audit |
| Error Details | 🔍 Verbose | 🛡️ Sanitized |

## 🛡️ **Production Security Requirements**

### **NEVER deploy with these settings:**

1. **Environment Variables:**
   ```bash
   # ❌ NEVER in production
   NODE_ENV=development
   x-bypass-auth=true
   ```

2. **Required Production Settings:**
   ```bash
   # ✅ Required for production
   NODE_ENV=production
   MNEMOSYNE_SECRET_KEY=your-secure-secret-key
   JWT_SECRET=your-jwt-secret
   ```

### **Production Authentication Flow:**

```bash
# 1. Login to get JWT token
curl -X POST http://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "your_username", "password": "your_password"}'

# 2. Use token for API calls
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://your-domain.com/api/consciousness/self-model/user_id
```

## 🔍 **Testing Core Consciousness System APIs**

### **Development Mode Testing:**

```bash
# Set development mode
$env:NODE_ENV="development"

# Start server
node server.js

# Test consciousness status (no auth required)
curl http://localhost:3000/api/consciousness/status

# Test self-model (no auth required)
curl http://localhost:3000/api/consciousness/self-model/test_user

# Test dialogue generation (no auth required)
curl -X POST http://localhost:3000/api/consciousness/dialogue \
  -H "Content-Type: application/json" \
  -d '{"userId": "test_user", "userQuery": "Hello", "baseResponse": "Hi there!"}'
```

### **Production Mode Testing:**

```bash
# Set production mode
$env:NODE_ENV="production"

# Start server
node server.js

# Login first
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "test_user", "password": "test_password"}'

# Use returned token
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/consciousness/status
```

## 📋 **Development Checklist**

### **Before Development:**
- [ ] Set `NODE_ENV=development`
- [ ] Verify authentication bypass is working
- [ ] Check that all Core Consciousness APIs are accessible

### **Before Production Deployment:**
- [ ] Set `NODE_ENV=production`
- [ ] Configure secure `MNEMOSYNE_SECRET_KEY`
- [ ] Configure secure `JWT_SECRET`
- [ ] Remove all `x-bypass-auth` headers
- [ ] Test authentication flow
- [ ] Verify security logging is active
- [ ] Run security audit

## 🚨 **Security Warnings**

### **Development Mode Risks:**
- **No Authentication**: Anyone can access all APIs
- **No Rate Limiting**: APIs can be abused
- **Verbose Logging**: Sensitive data may be logged
- **Debug Information**: Internal system details exposed

### **Production Requirements:**
- **Strong Authentication**: JWT tokens with expiration
- **Rate Limiting**: Prevent API abuse
- **Input Validation**: Sanitize all inputs
- **Audit Logging**: Track all access attempts
- **Error Handling**: Don't expose internal details

## 🔗 **Related Documentation**

- [Core Consciousness System Guide](./CORE_CONSCIOUSNESS_GUIDE.md)
- [Security Guidelines](./CONTRIBUTING.md#security--ethical-development-guidelines)
- [API Documentation](./API_DOCUMENTATION.md)

---

**Remember: Development mode is for development only. Never use in production!** 🛡️


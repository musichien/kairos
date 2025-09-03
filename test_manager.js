const MemoryManager = require('./memory');
const CognitiveTrainingManager = require('./cognitive_training');
const MultimodalIntegrationManager = require('./multimodal_integration');
const CulturalOptimizationManager = require('./cultural_optimization');
const SecurityManager = require('./security_manager');

/**
 * 🧪 Test Manager for Mnemosyne Integration
 * Comprehensive testing of all Mnemosyne features and module integration
 */
class TestManager {
  constructor() {
    this.memoryManager = new MemoryManager();
    this.cognitiveTrainingManager = new CognitiveTrainingManager();
    this.multimodalManager = new MultimodalIntegrationManager();
    this.culturalManager = new CulturalOptimizationManager();
    this.securityManager = new SecurityManager();
    
    this.testResults = [];
    this.testStartTime = null;
    
    console.log('🧪 Test Manager initialized');
  }

  // 전체 테스트 실행
  async runAllTests(userId = 'test_user_001') {
    console.log('🚀 Starting comprehensive Mnemosyne integration tests...');
    this.testStartTime = Date.now();
    this.testResults = [];

    try {
      // 1. 기본 모듈 테스트
      await this.testBasicModules(userId);
      
      // 2. Mnemosyne 기능 테스트
      await this.testMnemosyneFeatures(userId);
      
      // 3. 보안 기능 테스트
      await this.testSecurityFeatures(userId);
      
      // 4. 통합 테스트
      await this.testIntegration(userId);
      
      // 5. 성능 테스트
      await this.testPerformance(userId);
      
      // 6. 보안 및 개인정보 테스트
      await this.testSecurityAndPrivacy(userId);
      
      this.generateTestReport();
      
    } catch (error) {
      console.error('❌ Test execution failed:', error);
      this.testResults.push({
        test: 'Overall Test Execution',
        status: 'FAILED',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  // 기본 모듈 테스트
  async testBasicModules(userId) {
    console.log('📋 Testing basic modules...');
    
    // Memory Manager 테스트
    try {
      const memory = await this.memoryManager.loadUserMemory(userId);
      this.testResults.push({
        test: 'Memory Manager - Load User Memory',
        status: 'PASSED',
        details: `Loaded memory for user: ${userId}`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      this.testResults.push({
        test: 'Memory Manager - Load User Memory',
        status: 'FAILED',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }

    // Cognitive Training Manager 테스트
    try {
      const training = await this.cognitiveTrainingManager.generatePersonalizedTraining(userId, 'mnemosyneTraining');
      this.testResults.push({
        test: 'Cognitive Training Manager - Mnemosyne Training',
        status: 'PASSED',
        details: `Generated training: ${training.type}`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      this.testResults.push({
        test: 'Cognitive Training Manager - Mnemosyne Training',
        status: 'FAILED',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }

    // Multimodal Integration Manager 테스트
    try {
      const multimodal = await this.multimodalManager.processCulturalData(userId, { test: 'cultural data' });
      this.testResults.push({
        test: 'Multimodal Integration Manager - Cultural Data Processing',
        status: 'PASSED',
        details: 'Cultural data processed successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      this.testResults.push({
        test: 'Multimodal Integration Manager - Cultural Data Processing',
        status: 'FAILED',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }

    // Cultural Optimization Manager 테스트
    try {
      const cultural = await this.culturalManager.interpretCulturalContext(userId, { context: 'test context' });
      this.testResults.push({
        test: 'Cultural Optimization Manager - Cultural Context Interpretation',
        status: 'PASSED',
        details: 'Cultural context interpreted successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      this.testResults.push({
        test: 'Cultural Optimization Manager - Cultural Context Interpretation',
        status: 'FAILED',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Mnemosyne 기능 테스트
  async testMnemosyneFeatures(userId) {
    console.log('🏛️ Testing Mnemosyne features...');
    
    // 문화적 기억 테스트
    try {
      const culturalMemory = await this.memoryManager.addCulturalMemory(userId, {
        type: 'mythological',
        content: 'Greek mythology reference',
        significance: 'high',
        culturalContext: 'ancient greece'
      });
      
      this.testResults.push({
        test: 'Mnemosyne - Cultural Memory Addition',
        status: 'PASSED',
        details: `Added cultural memory: ${culturalMemory.type}`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      this.testResults.push({
        test: 'Mnemosyne - Cultural Memory Addition',
        status: 'FAILED',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }

    // 시간적 맥락 테스트
    try {
      const temporalContext = await this.memoryManager.addTemporalContext(userId, {
        era: 'digital',
        period: '2020s',
        technologicalContext: 'AI revolution',
        culturalShifts: 'digital transformation'
      });
      
      this.testResults.push({
        test: 'Mnemosyne - Temporal Context Addition',
        status: 'PASSED',
        details: `Added temporal context: ${temporalContext.era}`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      this.testResults.push({
        test: 'Mnemosyne - Temporal Context Addition',
        status: 'FAILED',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }

    // 정체성 패턴 테스트
    try {
      const identityPattern = await this.memoryManager.addIdentityPattern(userId, {
        pattern: 'cultural adaptation',
        culturalInfluence: 'multicultural',
        memoryIntegration: 'high',
        evolutionTrend: 'increasing'
      });
      
      this.testResults.push({
        test: 'Mnemosyne - Identity Pattern Addition',
        status: 'PASSED',
        details: `Added identity pattern: ${identityPattern.pattern}`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      this.testResults.push({
        test: 'Mnemosyne - Identity Pattern Addition',
        status: 'FAILED',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }

    // 집단 기억 테스트
    try {
      const collectiveMemory = await this.memoryManager.addCollectiveMemory(userId, {
        type: 'community',
        content: 'Shared cultural experience',
        participants: 100,
        culturalSignificance: 'high'
      });
      
      this.testResults.push({
        test: 'Mnemosyne - Collective Memory Addition',
        status: 'PASSED',
        details: `Added collective memory: ${collectiveMemory.type}`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      this.testResults.push({
        test: 'Mnemosyne - Collective Memory Addition',
        status: 'FAILED',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  // 보안 기능 테스트
  async testSecurityFeatures(userId) {
    console.log('🔐 Testing security features...');
    
    // 토큰 생성 테스트
    try {
      const token = this.securityManager.generateAccessToken(userId, ['read', 'write']);
      this.testResults.push({
        test: 'Security - Token Generation',
        status: 'PASSED',
        details: `Generated token: ${token.substring(0, 16)}...`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      this.testResults.push({
        test: 'Security - Token Generation',
        status: 'FAILED',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }

    // 데이터 암호화 테스트
    try {
      const testData = { sensitive: 'information', timestamp: Date.now() };
      const encrypted = this.securityManager.encryptData(testData);
      const decrypted = this.securityManager.decryptData(encrypted);
      
      const encryptionSuccess = JSON.stringify(testData) === JSON.stringify(decrypted);
      
      this.testResults.push({
        test: 'Security - Data Encryption/Decryption',
        status: encryptionSuccess ? 'PASSED' : 'FAILED',
        details: encryptionSuccess ? 'Data encrypted and decrypted successfully' : 'Data mismatch after encryption/decryption',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      this.testResults.push({
        test: 'Security - Data Encryption/Decryption',
        status: 'FAILED',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }

    // 권한 설정 테스트
    try {
      this.securityManager.setUserPermissions(userId, ['read', 'write', 'admin']);
      const hasPermission = this.securityManager.checkUserPermissions(userId, ['read', 'write']);
      
      this.testResults.push({
        test: 'Security - Permission Management',
        status: hasPermission ? 'PASSED' : 'FAILED',
        details: hasPermission ? 'Permissions set and verified successfully' : 'Permission verification failed',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      this.testResults.push({
        test: 'Security - Permission Management',
        status: 'FAILED',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  // 통합 테스트
  async testIntegration(userId) {
    console.log('🔗 Testing module integration...');
    
    // Mnemosyne 통합 분석 테스트
    try {
      const analysis = await this.multimodalManager.generateMnemosyneAnalysis(userId, ['cultural', 'temporal', 'identity']);
      this.testResults.push({
        test: 'Integration - Mnemosyne Analysis',
        status: 'PASSED',
        details: 'Mnemosyne analysis generated successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      this.testResults.push({
        test: 'Integration - Mnemosyne Analysis',
        status: 'FAILED',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }

    // 문화적 해석 통합 테스트
    try {
      const culturalInsights = await this.culturalManager.generateMnemosyneInsights(userId);
      this.testResults.push({
        test: 'Integration - Cultural Insights',
        status: 'PASSED',
        details: 'Cultural insights generated successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      this.testResults.push({
        test: 'Integration - Cultural Insights',
        status: 'FAILED',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }

    // 메모리 검색 통합 테스트
    try {
      const searchResults = await this.memoryManager.queryMemory(userId, 'cultural', {
        types: ['mnemosyne'],
        keywords: ['mythological', 'greek']
      });
      
      this.testResults.push({
        test: 'Integration - Memory Search',
        status: 'PASSED',
        details: `Memory search completed with ${searchResults.length} results`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      this.testResults.push({
        test: 'Integration - Memory Search',
        status: 'FAILED',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  // 성능 테스트
  async testPerformance(userId) {
    console.log('⚡ Testing performance...');
    
    // 메모리 로딩 성능
    try {
      const startTime = Date.now();
      await this.memoryManager.loadUserMemory(userId);
      const loadTime = Date.now() - startTime;
      
      const performanceStatus = loadTime < 1000 ? 'PASSED' : 'WARNING';
      
      this.testResults.push({
        test: 'Performance - Memory Loading',
        status: performanceStatus,
        details: `Memory loaded in ${loadTime}ms`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      this.testResults.push({
        test: 'Performance - Memory Loading',
        status: 'FAILED',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }

    // 보안 토큰 생성 성능
    try {
      const startTime = Date.now();
      this.securityManager.generateAccessToken(userId, ['read', 'write']);
      const tokenTime = Date.now() - startTime;
      
      const performanceStatus = tokenTime < 100 ? 'PASSED' : 'WARNING';
      
      this.testResults.push({
        test: 'Performance - Token Generation',
        status: performanceStatus,
        details: `Token generated in ${tokenTime}ms`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      this.testResults.push({
        test: 'Performance - Token Generation',
        status: 'FAILED',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  // 보안 및 개인정보 테스트
  async testSecurityAndPrivacy(userId) {
    console.log('🛡️ Testing security and privacy...');
    
    // 데이터 무결성 테스트
    try {
      const testData = { test: 'integrity check', timestamp: Date.now() };
      const hash = this.securityManager.generateHash(testData);
      const integrity = this.securityManager.verifyDataIntegrity(testData, hash);
      
      this.testResults.push({
        test: 'Security & Privacy - Data Integrity',
        status: integrity ? 'PASSED' : 'FAILED',
        details: integrity ? 'Data integrity verified successfully' : 'Data integrity check failed',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      this.testResults.push({
        test: 'Security & Privacy - Data Integrity',
        status: 'FAILED',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }

    // 보안 정책 검증 테스트
    try {
      const testData = { normal: 'data', size: 'small' };
      const policyCheck = this.securityManager.validateSecurityPolicy(testData);
      
      this.testResults.push({
        test: 'Security & Privacy - Policy Validation',
        status: policyCheck.valid ? 'PASSED' : 'WARNING',
        details: policyCheck.valid ? 'Security policy validation passed' : `Policy violations: ${policyCheck.violations.join(', ')}`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      this.testResults.push({
        test: 'Security & Privacy - Policy Validation',
        status: 'FAILED',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }

    // 접근 제어 테스트
    try {
      const accessControl = this.securityManager.enforceAccessControl(userId, 'mnemosyne', 'read');
      
      this.testResults.push({
        test: 'Security & Privacy - Access Control',
        status: accessControl ? 'PASSED' : 'FAILED',
        details: accessControl ? 'Access control enforced successfully' : 'Access control check failed',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      this.testResults.push({
        test: 'Security & Privacy - Access Control',
        status: 'FAILED',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  // 테스트 결과 요약 생성
  generateTestReport() {
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(r => r.status === 'PASSED').length;
    const failedTests = this.testResults.filter(r => r.status === 'FAILED').length;
    const warningTests = this.testResults.filter(r => r.status === 'WARNING').length;
    const totalTime = Date.now() - this.testStartTime;

    console.log('\n' + '='.repeat(80));
    console.log('🧪 MNEMOSYNE INTEGRATION TEST REPORT');
    console.log('='.repeat(80));
    console.log(`📊 Total Tests: ${totalTests}`);
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`⚠️  Warnings: ${warningTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`⏱️  Total Time: ${totalTime}ms`);
    console.log(`📈 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
    console.log('='.repeat(80));

    // 실패한 테스트 상세 정보
    if (failedTests > 0) {
      console.log('\n❌ FAILED TESTS:');
      this.testResults
        .filter(r => r.status === 'FAILED')
        .forEach(test => {
          console.log(`  • ${test.test}: ${test.error}`);
        });
    }

    // 경고 테스트 상세 정보
    if (warningTests > 0) {
      console.log('\n⚠️  WARNING TESTS:');
      this.testResults
        .filter(r => r.status === 'WARNING')
        .forEach(test => {
          console.log(`  • ${test.test}: ${test.details}`);
        });
    }

    // 전체 결과 저장
    this.testResults.push({
      test: 'TEST SUMMARY',
      status: failedTests === 0 ? 'PASSED' : 'FAILED',
      details: `Total: ${totalTests}, Passed: ${passedTests}, Failed: ${failedTests}, Warnings: ${warningTests}, Time: ${totalTime}ms`,
      timestamp: new Date().toISOString()
    });

    return {
      summary: {
        total: totalTests,
        passed: passedTests,
        failed: failedTests,
        warnings: warningTests,
        successRate: (passedTests / totalTests) * 100,
        totalTime: totalTime
      },
      results: this.testResults
    };
  }

  // 특정 테스트 실행
  async runSpecificTest(testType, userId = 'test_user_001') {
    console.log(`🧪 Running specific test: ${testType}`);
    
    switch (testType) {
      case 'basic':
        await this.testBasicModules(userId);
        break;
      case 'mnemosyne':
        await this.testMnemosyneFeatures(userId);
        break;
      case 'security':
        await this.testSecurityFeatures(userId);
        break;
      case 'integration':
        await this.testIntegration(userId);
        break;
      case 'performance':
        await this.testPerformance(userId);
        break;
      case 'security-privacy':
        await this.testSecurityAndPrivacy(userId);
        break;
      default:
        console.log('❌ Unknown test type. Available types: basic, mnemosyne, security, integration, performance, security-privacy');
        return;
    }
    
    this.generateTestReport();
  }

  // 테스트 결과 내보내기
  exportTestResults() {
    const report = this.generateTestReport();
    const exportData = {
      timestamp: new Date().toISOString(),
      report: report
    };
    
    return JSON.stringify(exportData, null, 2);
  }
}

module.exports = TestManager;

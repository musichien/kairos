/**
 * Medical Standards Integration Test Script
 * Tests FHIR, HL7, and EMR integration functionality
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000';
const API_KEY = 'default-secret-key'; // Development key

class MedicalStandardsTester {
  constructor() {
    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    };
  }

  async testFHIROperations() {
    console.log('🏥 Testing FHIR Operations...\n');

    // Test 1: Create Patient
    console.log('1. Creating FHIR Patient...');
    const patientData = {
      name: [{
        family: 'Smith',
        given: ['John', 'Michael']
      }],
      gender: 'male',
      birthDate: '1990-05-15',
      address: [{
        line: ['123 Main St'],
        city: 'New York',
        state: 'NY',
        postalCode: '10001'
      }]
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/medical/fhir/create/Patient`,
        patientData,
        { headers: this.headers }
      );
      console.log('✅ Patient created:', response.data.data.id);
      return response.data.data.id;
    } catch (error) {
      console.log('❌ Patient creation failed:', error.response?.data || error.message);
      return null;
    }
  }

  async testHL7Operations() {
    console.log('\n🏥 Testing HL7 Operations...\n');

    // Test HL7 ADT Message
    const hl7Message = `MSH|^~\\&|SENDING_APP|SENDING_FACILITY|RECEIVING_APP|RECEIVING_FACILITY|20250106120000||ADT^A01^ADT_A01|12345|P|2.5
EVN|A01|20250106120000
PID|1||123456789^^^MR^MGH||SMITH^JOHN^MICHAEL||19900515|M||C|123 MAIN ST^^NEW YORK^NY^10001||555-1234|||S||123456789
PV1|1|I|2000^2012^01||||004777^ATTEND^AARON^A|||SUR||||ADM|A0|`;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/medical/hl7/process`,
        {
          message: hl7Message,
          messageType: 'ADT'
        },
        { headers: this.headers }
      );
      console.log('✅ HL7 ADT message processed:', response.data.success ? 'Success' : 'Failed');
      return response.data.success;
    } catch (error) {
      console.log('❌ HL7 processing failed:', error.response?.data || error.message);
      return false;
    }
  }

  async testEMRIntegration() {
    console.log('\n🏥 Testing EMR Integration...\n');

    const patientData = {
      patientId: '12345',
      name: 'John Smith',
      birthDate: '1990-05-15',
      gender: 'male'
    };

    let epicSuccess = false;
    let cernerSuccess = false;

    // Test Epic Integration
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/medical/emr/integrate`,
        {
          emrType: 'Epic',
          patientData: patientData
        },
        { headers: this.headers }
      );
      console.log('✅ Epic EMR integration:', response.data.message);
      epicSuccess = response.data.success;
    } catch (error) {
      console.log('❌ Epic integration failed:', error.response?.data || error.message);
    }

    // Test Cerner Integration
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/medical/emr/integrate`,
        {
          emrType: 'Cerner',
          patientData: patientData
        },
        { headers: this.headers }
      );
      console.log('✅ Cerner EMR integration:', response.data.message);
      cernerSuccess = response.data.success;
    } catch (error) {
      console.log('❌ Cerner integration failed:', error.response?.data || error.message);
    }

    return epicSuccess && cernerSuccess;
  }

  async testDataValidation() {
    console.log('\n🏥 Testing Medical Data Validation...\n');

    const patientData = {
      id: '12345',
      name: [{
        family: 'Smith',
        given: ['John']
      }],
      gender: 'male',
      birthDate: '1990-05-15'
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/medical/validate/patient`,
        patientData,
        { headers: this.headers }
      );
      console.log('✅ Patient data validation:', response.data.data.valid ? 'Valid' : 'Invalid');
      if (!response.data.data.valid) {
        console.log('   Errors:', response.data.data.errors);
      }
      return response.data.data.valid;
    } catch (error) {
      console.log('❌ Data validation failed:', error.response?.data || error.message);
      return false;
    }
  }

  async testMedicalStats() {
    console.log('\n🏥 Testing Medical Statistics...\n');

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/medical/stats`,
        { headers: this.headers }
      );
      console.log('✅ Medical stats retrieved:');
      console.log('   FHIR Resources:', response.data.data.fhirResources);
      console.log('   HL7 Message Types:', response.data.data.hl7MessageTypes);
      console.log('   HIPAA Compliant:', response.data.data.hipaaCompliant);
      return true;
    } catch (error) {
      console.log('❌ Medical stats failed:', error.response?.data || error.message);
      return false;
    }
  }

  async runAllTests() {
    console.log('🏥 Starting Medical Standards Integration Tests...\n');
    console.log('='.repeat(60));

    const results = {
      fhir: false,
      hl7: false,
      emr: false,
      validation: false,
      stats: false
    };

    // Run tests
    results.fhir = await this.testFHIROperations();
    results.hl7 = await this.testHL7Operations();
    results.emr = await this.testEMRIntegration();
    results.validation = await this.testDataValidation();
    results.stats = await this.testMedicalStats();

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('🏥 Medical Standards Integration Test Summary:');
    console.log('='.repeat(60));
    console.log(`FHIR Operations: ${results.fhir ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`HL7 Operations: ${results.hl7 ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`EMR Integration: ${results.emr ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`Data Validation: ${results.validation ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`Medical Stats: ${results.stats ? '✅ PASSED' : '❌ FAILED'}`);

    const passedTests = Object.values(results).filter(Boolean).length;
    const totalTests = Object.keys(results).length;
    
    console.log(`\nOverall: ${passedTests}/${totalTests} tests passed`);
    
    if (passedTests === totalTests) {
      console.log('🎉 All medical standards integration tests passed!');
    } else {
      console.log('⚠️  Some tests failed. Check the logs above for details.');
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new MedicalStandardsTester();
  tester.runAllTests().catch(console.error);
}

module.exports = MedicalStandardsTester;

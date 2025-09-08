const http = require('http');

async function testMedicalAPI() {
    console.log('🏥 Testing Medical Standards API...\n');
    
    // Test 1: Medical Status
    console.log('1. Testing Medical Status API...');
    try {
        const statusResponse = await makeRequest('GET', '/api/medical/status');
        console.log('✅ Status API:', statusResponse.message);
        console.log('   Data:', JSON.stringify(statusResponse.data, null, 2));
    } catch (error) {
        console.log('❌ Status API Error:', error.message);
    }
    
    console.log('\n2. Testing FHIR Integration...');
    try {
        const fhirResponse = await makeRequest('POST', '/api/medical/fhir/test');
        console.log('✅ FHIR Test:', fhirResponse.message);
    } catch (error) {
        console.log('❌ FHIR Test Error:', error.message);
    }
    
    console.log('\n3. Testing HL7 Processing...');
    try {
        const hl7Response = await makeRequest('POST', '/api/medical/hl7/test');
        console.log('✅ HL7 Test:', hl7Response.message);
    } catch (error) {
        console.log('❌ HL7 Test Error:', error.message);
    }
    
    console.log('\n4. Testing EMR Integration...');
    try {
        const emrResponse = await makeRequest('POST', '/api/medical/emr/test');
        console.log('✅ EMR Test:', emrResponse.message);
    } catch (error) {
        console.log('❌ EMR Test Error:', error.message);
    }
    
    console.log('\n5. Testing HIPAA Compliance...');
    try {
        const hipaaResponse = await makeRequest('POST', '/api/medical/hipaa/test');
        console.log('✅ HIPAA Test:', hipaaResponse.message);
    } catch (error) {
        console.log('❌ HIPAA Test Error:', hipaaResponse.message);
    }
    
    console.log('\n🎉 Medical Standards API testing completed!');
}

function makeRequest(method, path) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: method,
            headers: {
                'X-Bypass-Auth': 'true',
                'Content-Type': 'application/json'
            }
        };
        
        const req = http.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    resolve(response);
                } catch (error) {
                    reject(new Error(`Invalid JSON response: ${data}`));
                }
            });
        });
        
        req.on('error', (error) => {
            reject(error);
        });
        
        req.end();
    });
}

// Run the test
testMedicalAPI().catch(console.error);



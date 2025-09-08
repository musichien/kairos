const http = require('http');

console.log('🏥 Testing Medical API...');

const req = http.request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/medical/status',
    method: 'GET',
    headers: {
        'X-Bypass-Auth': 'true'
    }
}, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        console.log('✅ Response received:');
        console.log(data);
        
        try {
            const result = JSON.parse(data);
            console.log('✅ Parsed JSON:');
            console.log('Success:', result.success);
            console.log('Data:', result.data);
        } catch (error) {
            console.log('❌ JSON Parse Error:', error.message);
        }
    });
});

req.on('error', (err) => {
    console.log('❌ Request Error:', err.message);
});

req.end();

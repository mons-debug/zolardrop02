// Trigger migration script
const https = require('https');

const data = JSON.stringify({ secret: 'migrate-zolar-2024' });

const options = {
    hostname: 'www.zolar.ma',
    port: 443,
    path: '/api/admin/migrate-images',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    },
    timeout: 300000
};

console.log('🚀 Starting migration...');
console.log('This may take a few minutes...\n');

const req = https.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        console.log('Status:', res.statusCode);
        try {
            const result = JSON.parse(body);
            console.log('\n📊 Migration Result:');
            console.log(JSON.stringify(result, null, 2));
        } catch {
            console.log('Response:', body);
        }
    });
});

req.on('error', (e) => {
    console.error('Error:', e.message);
});

req.on('timeout', () => {
    console.log('Request timed out');
    req.destroy();
});

req.write(data);
req.end();

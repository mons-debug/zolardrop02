// Trigger cleanup
const https = require('https');

const data = JSON.stringify({ secret: 'clean-zolar-2024' });

const options = {
    hostname: 'www.zolar.ma',
    port: 443,
    path: '/api/admin/clean-data',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

console.log('🧹 Cleaning orders and customers...\n');

const req = https.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        console.log('Status:', res.statusCode);
        try {
            console.log(JSON.stringify(JSON.parse(body), null, 2));
        } catch {
            console.log('Response:', body);
        }
    });
});

req.on('error', (e) => console.error('Error:', e.message));
req.write(data);
req.end();

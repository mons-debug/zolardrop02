#!/usr/bin/env node

/**
 * Generate VAPID keys for web push notifications
 * Run: node scripts/generate-vapid-keys.js
 */

const webpush = require('web-push');

console.log('\n🔑 Generating VAPID keys for Web Push Notifications...\n');

const vapidKeys = webpush.generateVAPIDKeys();

console.log('✅ Keys generated successfully!\n');
console.log('Add these to your .env file:\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`NEXT_PUBLIC_VAPID_PUBLIC_KEY="${vapidKeys.publicKey}"`);
console.log(`VAPID_PRIVATE_KEY="${vapidKeys.privateKey}"`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('⚠️  Important:');
console.log('   - Keep the private key secret');
console.log('   - Never commit these keys to version control');
console.log('   - The public key will be exposed to the client\n');


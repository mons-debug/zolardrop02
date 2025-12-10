const webpush = require('web-push');
const fs = require('fs');
const keys = webpush.generateVAPIDKeys();

const content = `
VAPID KEYS - ADD THESE TO VERCEL
================================

VAPID_PUBLIC_KEY:
${keys.publicKey}

VAPID_PRIVATE_KEY:
${keys.privateKey}

NEXT_PUBLIC_VAPID_PUBLIC_KEY:
${keys.publicKey}
`;

fs.writeFileSync('VAPID_KEYS.md', content);
console.log('Keys saved to VAPID_KEYS.md');

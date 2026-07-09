const fs = require('fs');
const s = fs.readFileSync('f:/0cxy2026/menu-app/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js', 'utf8');
const lines = s.split('\n');

// Find all imports at the top
console.log('=== first 30 lines ===');
for (let i = 0; i < 30; i++) console.log(i+1, '|', lines[i]);

// Find usages of crypto$2
console.log('\n=== usages of crypto$2 ===');
for (let i = 0; i < lines.length; i++) {
  if (lines[i] && lines[i].includes('crypto$2')) {
    console.log(i+1, '|', lines[i].slice(0, 200));
  }
}

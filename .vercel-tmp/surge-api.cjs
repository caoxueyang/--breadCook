#!/usr/bin/env node
/**
 * Surge 纯 HTTP API 部署器（不依赖 PTY）
 * 协议：Basic Auth (email:token) + tar upload
 */
const https = require('https');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

const EMAIL = 'caoxueyang@qq.com';
const PASSWORD = 'MenuApp2026';
const DOMAIN = 'menu-restaurant-app.surge.sh';
const DIST_DIR = path.join(__dirname, '..', 'dist');
const HOST = 'surge.surge.sh';

// Surge token 派生: sha1(sha1(email) + ':' + sha1(password))
function sha1(s) { return crypto.createHash('sha1').update(s).digest('hex'); }
const token = sha1(sha1(EMAIL) + ':' + sha1(PASSWORD));
const auth = Buffer.from(`${EMAIL}:${token}`).toString('base64');

console.log(`[1/4] Computed surge token for ${EMAIL}`);

// 创建 tar.gz
const tarPath = path.join(os.tmpdir(), `surge-upload-${Date.now()}.tar.gz`);
console.log(`[2/4] Creating tar.gz of ${DIST_DIR}...`);
// Windows 上 tar 命令：tar -czf file.tar.gz -C dist .
// 但 Windows 10+ 内置 tar.exe
try {
  execSync(`tar -czf "${tarPath}" -C "${DIST_DIR}" .`, { stdio: 'inherit' });
  console.log(`    Created: ${tarPath} (${(fs.statSync(tarPath).size / 1024 / 1024).toFixed(2)} MB)`);
} catch (e) {
  console.error('tar failed:', e.message);
  process.exit(1);
}

const tarBuffer = fs.readFileSync(tarPath);
console.log(`[3/4] Uploading to https://${HOST}/distribution/${DOMAIN}...`);

// Surge 部署：PUT tar.gz 到 /distribution/<domain>
const options = {
  hostname: HOST,
  port: 443,
  path: `/distribution/${DOMAIN}`,
  method: 'PUT',
  headers: {
    'Content-Type': 'application/x-tar',
    'Content-Length': tarBuffer.length,
    'Authorization': `Basic ${auth}`,
    'Surge-Version': '0.27.4'
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log(`[4/4] Response: ${res.statusCode} ${res.statusMessage}`);
    console.log('--- Response body ---');
    console.log(body);
    console.log('--- End response ---');

    // 清理
    try { fs.unlinkSync(tarPath); } catch (e) {}

    if (res.statusCode === 200 || res.statusCode === 201) {
      console.log(`\n✅ DEPLOY SUCCESS!`);
      console.log(`🌐 URL: https://${DOMAIN}`);
    } else {
      console.log(`\n❌ Deploy failed: ${res.statusCode}`);
      process.exit(1);
    }
  });
});

req.on('error', (e) => {
  console.error('Request error:', e.message);
  process.exit(1);
});

req.write(tarBuffer);
req.end();

// 自动递增 android/app/build.gradle 里的 versionCode
// 用法: node bump-versioncode.cjs
const fs = require('fs');
const path = require('path');

const gradleFile = path.join(__dirname, 'android', 'app', 'build.gradle');
let content = fs.readFileSync(gradleFile, 'utf8');

// 检查是否包含 BOM，有则去掉（防御）
if (content.charCodeAt(0) === 0xFEFF) {
  content = content.slice(1);
}

const match = content.match(/(\s+versionCode\s+)(\d+)/);
if (!match) {
  console.error('[X] 找不到 versionCode 字段');
  process.exit(1);
}

const oldCode = parseInt(match[2], 10);
const newCode = oldCode + 1;
const newContent = content.replace(/(\s+versionCode\s+)\d+/, `$1${newCode}`);

// 写文件时不带 BOM
fs.writeFileSync(gradleFile, newContent, { encoding: 'utf8' });
console.log(`OK: versionCode ${oldCode} -> ${newCode}`);

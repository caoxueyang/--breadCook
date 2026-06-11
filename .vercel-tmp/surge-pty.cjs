#!/usr/bin/env node
/**
 * Surge 自动部署脚本（使用 node-pty 模拟终端）
 */
const pty = require('node-pty');
const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, 'surge-input.txt');
const distDir = path.join(__dirname, '..', 'dist');
const logFile = path.join(__dirname, 'surge-out.log');
const lines = fs.readFileSync(inputFile, 'utf8').split(/\r?\n/).filter(l => l);
let lineIdx = 0;

console.log(`Deploying ${distDir} to surge via pty...`);
console.log(`Inputs: ${lines.join(' | ')}`);

// 清空日志
fs.writeFileSync(logFile, '');

const ptyProc = pty.spawn('surge', [distDir], {
  name: 'xterm-color',
  cols: 100,
  rows: 30,
  cwd: path.dirname(distDir),
  env: { ...process.env, FORCE_COLOR: '0' }
});

ptyProc.onData((data) => {
  process.stdout.write(data);
  try { fs.appendFileSync(logFile, data); } catch (e) {}

  // 检测到提示符时自动输入下一行
  const lastChunk = data;
  // surge 提示符检测：看到 "email:" "password:" "path (./):" "domain:" "Success!" 等待
  const lower = data.toLowerCase();
  if (lineIdx < lines.length) {
    if (lower.includes('email:') && !lower.includes('password:')) {
      setTimeout(() => ptyProc.write(lines[lineIdx++] + '\r'), 200);
    } else if (lower.includes('password:') && !lower.includes('token:')) {
      setTimeout(() => ptyProc.write(lines[lineIdx++] + '\r'), 200);
    } else if (lower.includes('password:') && lower.includes('token:')) {
      // token 阶段
      setTimeout(() => ptyProc.write(lines[lineIdx++] + '\r'), 200);
    } else if (lower.includes('domain:')) {
      setTimeout(() => ptyProc.write(lines[lineIdx++] + '\r'), 200);
    }
  }
});

ptyProc.onExit(({ exitCode, signal }) => {
  console.log(`\n[pty] surge exited code=${exitCode} signal=${signal || 'none'}`);
  process.exit(exitCode || 0);
});

// 兜底：每 800ms 强制写下一行（防止提示符检测不到）
const forceInterval = setInterval(() => {
  if (lineIdx < lines.length) {
    ptyProc.write(lines[lineIdx++] + '\r');
    console.log(`[force-write] sent line ${lineIdx}: ${lines[lineIdx - 1]}`);
  } else {
    clearInterval(forceInterval);
  }
}, 800);

// 30 秒后超时
setTimeout(() => {
  console.log('[timeout] 30s reached, killing pty');
  ptyProc.kill();
  clearInterval(forceInterval);
  process.exit(1);
}, 60000);

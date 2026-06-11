#!/usr/bin/env node
/**
 * Surge 自动部署脚本
 */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, 'surge-input.txt');
const distDir = path.join(__dirname, '..', 'dist');
const logFile = path.join(__dirname, 'surge-out.log');

if (!fs.existsSync(distDir)) {
  console.error(`Error: dist directory not found: ${distDir}`);
  process.exit(1);
}
if (!fs.existsSync(inputFile)) {
  console.error(`Error: input file not found: ${inputFile}`);
  process.exit(1);
}

const input = fs.readFileSync(inputFile, 'utf8').replace(/\r?\n/g, '\r\n');
const out = fs.openSync(logFile, 'w');

console.log(`Deploying ${distDir} to surge...`);
console.log(`Input lines: ${input.split(/\r?\n/).filter(l => l).length}`);

const child = spawn('surge', [distDir], {
  cwd: path.dirname(distDir),
  stdio: ['pipe', out, out],
  shell: true
});

child.stdin.write(input);
child.stdin.end();

child.on('close', (code) => {
  console.log(`\nSurge exited with code: ${code}`);
  console.log('----- surge output -----');
  try {
    console.log(fs.readFileSync(logFile, 'utf8'));
  } catch (e) {
    console.error(`Failed to read log: ${e.message}`);
  }
  process.exit(code || 0);
});

#!/usr/bin/env node
/**
 * Vercel CLI Deployment Script (Cross-Platform)
 * Usage: node deploy.cjs [project-path] [options]
 */
const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const isWindows = os.platform() === 'win32';
const ALLOWED_COMMANDS = new Set(['vercel', 'npm', 'pnpm', 'yarn']);
function log(msg) { console.error(msg); }
function commandExists(cmd) {
  if (!ALLOWED_COMMANDS.has(cmd)) throw new Error(`Command not in whitelist: ${cmd}`);
  try {
    if (isWindows) return spawnSync('where', [cmd], { stdio: 'ignore' }).status === 0;
    else return spawnSync('sh', ['-c', `command -v "$1"`, '--', cmd], { stdio: 'ignore' }).status === 0;
  } catch { return false; }
}
function getCommandOutput(cmd, args) {
  try {
    const result = spawnSync(cmd, args, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'], shell: isWindows });
    return result.status === 0 ? (result.stdout || '').trim() : null;
  } catch { return null; }
}
function parseArgs(args) {
  const result = { projectPath: '.', prod: true, yes: false, skipBuild: false };
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--prod') result.prod = true;
    else if (arg === '--yes' || arg === '-y') result.yes = true;
    else if (arg === '--skip-build') result.skipBuild = true;
    else if (!arg.startsWith('-')) result.projectPath = arg;
    else { log(`Unknown option: ${arg}`); process.exit(1); }
  }
  return result;
}
function checkVercelInstalled() {
  if (!commandExists('vercel')) { log('Error: Vercel CLI is not installed'); process.exit(1); }
  log(`Vercel CLI version: ${getCommandOutput('vercel', ['--version']) || 'unknown'}`);
}
function checkLoginStatus() {
  log('Checking login status...');
  try {
    const result = spawnSync('vercel', ['whoami'], { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], shell: isWindows });
    const output = (result.stdout || '').trim();
    if (result.status === 0 && output && !output.includes('Error') && !output.includes('not logged in')) {
      log(`Logged in as: ${output}`);
      return true;
    }
  } catch {}
  return false;
}
function checkProject(projectPath) {
  const absPath = path.resolve(projectPath);
  if (!fs.existsSync(absPath) || !fs.statSync(absPath).isDirectory()) {
    log(`Error: Project directory does not exist: ${absPath}`); process.exit(1);
  }
  log(`Project path: ${absPath}`);
  return absPath;
}
function detectPackageManager(projectPath) {
  if (fs.existsSync(path.join(projectPath, 'pnpm-lock.yaml'))) return 'pnpm';
  if (fs.existsSync(path.join(projectPath, 'yarn.lock'))) return 'yarn';
  if (fs.existsSync(path.join(projectPath, 'package-lock.json'))) return 'npm';
  if (commandExists('pnpm')) return 'pnpm';
  if (commandExists('yarn')) return 'yarn';
  if (commandExists('npm')) return 'npm';
  return null;
}
function runBuildIfNeeded(projectPath) {
  const packageJsonPath = path.join(projectPath, 'package.json');
  if (!fs.existsSync(packageJsonPath)) { log('No package.json found, skipping build step'); return true; }
  let packageJson;
  try { packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')); }
  catch (error) { log(`Warning: Failed to parse package.json: ${error.message}`); return true; }
  if (!packageJson.scripts || !packageJson.scripts.build) {
    log('No build script found in package.json, skipping build step'); return true;
  }
  log('');
  log('========================================');
  log('Running pre-deployment build...');
  log('========================================');
  const pkgManager = detectPackageManager(projectPath);
  if (!pkgManager) { log('Error: No package manager found'); process.exit(1); }
  log(`Using package manager: ${pkgManager}`);
  const nodeModulesPath = path.join(projectPath, 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    log('node_modules not found, installing dependencies first...');
    const installArgs = pkgManager === 'yarn' ? [] : ['install'];
    const installResult = spawnSync(pkgManager, installArgs, { cwd: projectPath, stdio: 'inherit', shell: isWindows });
    if (installResult.status !== 0) { log('Install failed'); process.exit(1); }
  }
  const buildArgs = pkgManager === 'npm' ? ['run', 'build'] : ['build'];
  log(`Executing: ${pkgManager} ${buildArgs.join(' ')}`);
  const result = spawnSync(pkgManager, buildArgs, { cwd: projectPath, stdio: 'inherit', shell: isWindows });
  if (result.status !== 0) { log('Build FAILED!'); process.exit(1); }
  log('Build completed successfully!');
  return true;
}
function doDeploy(projectPath, options) {
  log('');
  log('Starting deployment...');
  const cmdParts = ['vercel'];
  if (options.yes) cmdParts.push('--yes');
  if (options.prod) { cmdParts.push('--prod'); log('Environment: Production'); }
  log(`Executing: ${cmdParts.join(' ')}`);
  log('');
  log('========================================');
  try {
    const args = cmdParts.slice(1);
    const result = spawnSync('vercel', args, {
      cwd: projectPath, encoding: 'utf8',
      stdio: ['inherit', 'pipe', 'pipe'],
      timeout: 300000, shell: isWindows
    });
    const output = (result.stdout || '') + (result.stderr || '');
    log(output);
    if (result.status !== 0) throw new Error('Deployment command failed');
    const aliasedMatch = output.match(/Aliased:\s*(https:\/\/[a-zA-Z0-9.-]+\.vercel\.app)/i);
    const productionUrl = aliasedMatch ? aliasedMatch[1] : null;
    const deploymentMatch = output.match(/Production:\s*(https:\/\/[a-zA-Z0-9.-]+\.vercel\.app)/i);
    const deploymentUrl = deploymentMatch ? deploymentMatch[1] : null;
    const finalUrl = productionUrl || deploymentUrl;
    log('========================================');
    log('Deployment successful!');
    log('========================================');
    if (finalUrl) {
      log(`Live URL: ${finalUrl}`);
      console.log(JSON.stringify({ status: 'success', url: finalUrl }));
    } else {
      console.log(JSON.stringify({ status: 'success', message: 'Deployment successful' }));
    }
  } catch (error) {
    log(`Deployment failed: ${error.message}`);
    process.exit(1);
  }
}
function main() {
  log('========================================');
  log('Vercel CLI Project Deployment');
  log('========================================');
  log('');
  const args = process.argv.slice(2);
  const options = parseArgs(args);
  checkVercelInstalled();
  if (!checkLoginStatus()) { log('Not logged in'); process.exit(1); }
  const projectPath = checkProject(options.projectPath);
  if (!options.skipBuild) runBuildIfNeeded(projectPath);
  else log('Build step skipped');
  doDeploy(projectPath, options);
}
main();

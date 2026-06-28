import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const rootDir = process.cwd();
const outputDir = resolve(rootDir, '.output');
const distDir = resolve(rootDir, 'dist');
const targets = process.argv.slice(2);

function syncTarget(name) {
  const sourceDir = resolve(outputDir, name);
  const targetDir = resolve(distDir, name);

  if (!existsSync(sourceDir)) {
    return false;
  }

  mkdirSync(distDir, { recursive: true });
  rmSync(targetDir, { recursive: true, force: true });
  cpSync(sourceDir, targetDir, { recursive: true });
  return true;
}

const requestedTargets = targets.length > 0 ? targets : ['chrome-mv3', 'chrome-mv3-dev'];
const synced = requestedTargets.filter(syncTarget);

if (synced.length === 0) {
  console.warn(`No matching .output targets found for: ${requestedTargets.join(', ')}`);
  process.exit(0);
}

console.log(`Synced to dist: ${synced.join(', ')}`);

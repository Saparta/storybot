import { spawn } from 'node:child_process';
import process from 'node:process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import open from 'open';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const startProcess = (name, command, args, cwd) => {
  const child = spawn(command, args, {
    cwd,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  child.on('exit', (code) => {
    console.log(`${name} exited with code ${code ?? 0}`);
  });

  return child;
};

const backend = startProcess('backend', 'npm', ['run', 'dev'], path.join(rootDir, 'storybot-backend'));
const frontend = startProcess('frontend', 'npm', ['run', 'dev'], path.join(rootDir, 'storybot-frontend'));

const killAll = () => {
  backend.kill();
  frontend.kill();
};

process.on('SIGINT', killAll);
process.on('SIGTERM', killAll);

setTimeout(async () => {
  try {
    await open('http://127.0.0.1:5173');
  } catch (error) {
    console.error('Could not open browser automatically:', error.message);
  }
}, 3500);

/**
 * Start app, hit /api/health, exit 0/1.
 */
import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const envPath = path.join(root, '.env');
if (!fs.existsSync(envPath)) {
  fs.copyFileSync(path.join(root, '.env.example'), envPath);
}

const child = spawn(process.execPath, [path.join(root, 'src/index.js')], {
  cwd: root,
  env: { ...process.env },
  stdio: ['ignore', 'pipe', 'pipe'],
});

let settled = false;
function fail(msg) {
  if (settled) return;
  settled = true;
  console.error(msg);
  try { child.kill('SIGTERM'); } catch {}
  process.exit(1);
}
function ok(msg) {
  if (settled) return;
  settled = true;
  console.log(msg);
  try { child.kill('SIGTERM'); } catch {}
  process.exit(0);
}

child.stderr.on('data', (d) => process.stderr.write(d));
child.on('exit', (code) => {
  if (!settled) fail(`server exited early code=${code}`);
});

async function ping() {
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch('http://127.0.0.1:4000/api/health');
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'ok') ok('api-boilerplate smoke ok');
      }
    } catch (_) {}
    await new Promise((r) => setTimeout(r, 250));
  }
  fail('health check timeout');
}

ping();

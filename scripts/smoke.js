/**
 * Start app, hit /api/health, exit 0/1. No external curl.
 */
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

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
  child.kill('SIGTERM');
  process.exit(1);
}
function ok(msg) {
  if (settled) return;
  settled = true;
  console.log(msg);
  child.kill('SIGTERM');
  process.exit(0);
}

child.stderr.on('data', (d) => process.stderr.write(d));
child.on('exit', (code) => {
  if (!settled) fail(`server exited early code=${code}`);
});

async function ping() {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch('http://127.0.0.1:4000/api/health');
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'ok') ok('api-boilerplate smoke ok');
      }
    } catch (_) {}
    await new Promise((r) => setTimeout(r, 200));
  }
  fail('health check timeout');
}

ping();

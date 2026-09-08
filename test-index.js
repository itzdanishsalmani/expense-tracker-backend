require('dotenv').config();
const { spawn } = require('child_process');

const p = spawn('npx', ['ts-node', 'src/index.ts'], { 
  env: { ...process.env, GOOGLE_CLIENT_ID: '1', GOOGLE_CLIENT_SECRET: '1' } 
});

p.stdout.on('data', d => console.log('STDOUT:', d.toString()));
p.stderr.on('data', d => console.log('STDERR:', d.toString()));

setTimeout(() => {
  const curl = spawn('curl', ['-v', 'http://localhost:3000/auth/test']);
  curl.stdout.on('data', d => console.log('CURL OUT:', d.toString()));
  curl.stderr.on('data', d => console.log('CURL ERR:', d.toString()));
  curl.on('close', () => p.kill());
}, 4000);

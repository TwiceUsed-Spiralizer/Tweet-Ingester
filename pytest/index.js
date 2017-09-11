const { spawn } = require('child_process');
const path = require('path');

const py = spawn('python', [path.join(__dirname, 'index.py')]);
py.stderr.setEncoding('utf8')
py.stdout.setEncoding('utf8')
py.stderr.on('data', console.log)
py.stdout.on('data', console.log);

for (let i = 0; i < 100; i++) {
  py.stdin.write(i + '\n');
}
py.stdin.write('end\n');
py.stdin.write('test');
py.stdin.end();

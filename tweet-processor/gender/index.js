const pyGender = require('child_process').spawn('python', [require('path').join(__dirname, 'index.py')]);

module.exports = function gender(tweet) {
  pyGender.stdin.write(JSON.stringify(tweet) + '\n');
}

let dataString = '';
pyGender.stdout.setEncoding('utf8');
pyGender.stdout.on('data', data => {
  for (let char of data) {
    if (char === '\n') {
      console.log(JSON.parse(dataString));
      dataString = '';
    } else {
      dataString += char;
    }
  }
});

pyGender.stderr.setEncoding('utf8');
pyGender.stderr.on('data', console.log);

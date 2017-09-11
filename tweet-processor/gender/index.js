module.exports = class Gender {
  constructor(next) {
    this.next = next;
    this.process = this.process.bind(this);
    // Spawn Python process and coordinate communication
    this.pyGender = require('child_process').spawn('python', [require('path').join(__dirname, 'index.py')]);
    this.dataString = '';
    this.pyGender.stdout.setEncoding('utf8');
    this.pyGender.stdout.on('data', data => {
      for (let char of data) {
        if (char === '\n') {
          this.next(JSON.parse(this.dataString));
          this.dataString = '';
        } else {
          this.dataString += char;
        }
      }
    });
    // Print errors for now
    this.pyGender.stderr.setEncoding('utf8');
    this.pyGender.stderr.on('data', console.log);
  }

  process(tweet) {
    this.pyGender.stdin.write(JSON.stringify(tweet) + '\n');
  }
};

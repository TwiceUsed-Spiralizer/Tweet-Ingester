// Tweet-Processor modules
const Recipients = require('./recipients');
const Gender = require('./gender');
// const elastic = require('./elastic');

const gender = new Gender(console.log);
const recipients = new Recipients(gender.process);

// Respond to new tweets
process.stdin.setEncoding('utf8');
let tweetString = '';
process.stdin.on('data', input => {
  for (let char of input) {
    if (char === '\n') {
      recipients.process(JSON.parse(tweetString));
      tweetString = '';
    } else {
      tweetString += char;
    }
  }
});

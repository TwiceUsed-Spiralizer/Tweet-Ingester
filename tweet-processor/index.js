// Tweet-Processor modules
const Recipients = require('./recipients');
const Gender = require('./gender');
const Sentiment = require('./sentiment');
const Elastic = require('./elastic');

const elastic = new Elastic();
const sentiment = new Sentiment(elastic.process);
const gender = new Gender(sentiment.process);
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

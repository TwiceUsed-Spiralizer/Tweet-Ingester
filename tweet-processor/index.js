// Tweet-Processor modules
const populate = require('./recipients');
const gender = require('./gender');
// const elastic = require('./elastic');

// Set tweet processing middleware
// const next = (tweets) => {
//   gender(tweets, elastic);
// };

const next = gender;

// Respond to new tweets
process.stdin.setEncoding('utf8');
let tweetString = '';
process.stdin.on('data', input => {
  for (let char of input) {
    if (char === '\n') {
      populate(JSON.parse(tweetString), next);
      tweetString = '';
    } else {
      tweetString += char;
    }
  }
});

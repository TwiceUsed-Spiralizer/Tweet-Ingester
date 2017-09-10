// Tweet-Processor modules
const populate = require('./populate');
// const gender = require('./gender);
// const elastic = require('./elastic');

// Set tweet processing middleware
const next = (tweets) => {
  gender(tweets, elastic);
};

// Respond to new tweets
process.stdin.setEncoding('utf8');
process.stdin.on('data', tweet => populate(JSON.parse(tweet), next));

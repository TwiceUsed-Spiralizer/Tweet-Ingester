// Tweet-Ingester modules
const TweetFetcher = require('./tweet-fetcher');

const TF = new TweetFetcher();
TF.setEncoding('utf8');
TF.on('data', console.log);
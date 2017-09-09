// Tweet-Ingester modules
const TweetFetcher = require('./tweet-fetcher');

const TF = new TweetFetcher({ objectMode: true });

TF.on('data', data => console.log(data[0].hashtags));
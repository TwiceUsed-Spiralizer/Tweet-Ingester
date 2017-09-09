// Node modules
const { fork } = require('child_process');
// Tweet-Ingester modules
const TweetFetcher = require('./tweet-fetcher');

const TF = new TweetFetcher();
const TP = fork('./tweet-processor/index.js', { stdio: ['pipe', 'inherit', 'inherit', 'ipc'] });

TF.pipe(TP.stdin);

/*
 *  tweet-fetcher/index.js
 *  Fetches tweets, sanitises and stores them in MongoDB.
 *  Instantiated by TweetManager ('./index.js').
 */

// Node Modules
const { Transform } = require('stream');
// Tweet-Ingester Modules
const { Tweet } = require('../models.js');
const twitterStream = require('./twitter-client').stream;
// Constants
const TWO_MINUTES = 20 * 60 * 1000;

const isCandidate = function isCandidate(tweet) {
  return tweet
    && !/^RT @/.test(tweet.text)
    && !tweet.retweeted_status
    && ((tweet.entities && tweet.entities.user_mentions.length > 0) || tweet.in_reply_to_status_id);
};

module.exports = class TweetFetcher extends Transform {
  constructor(params = {}) {
    super(params);
    this.statusFilter = params.statusFilter || { language: 'en', track: 'a,e,i,o,u,y,A,E,I,O,U,Y, ' };
    this.tweetsReceived = 0;
    this.stream = twitterStream(this.statusFilter).on('data', this._transform.bind(this));
    setInterval(this.checkStream.bind(this), TWO_MINUTES);
  }

  checkStream() {
    console.log('Resetting count');
    if(!this.tweetsReceived) {
      this.stream.removeAllListeners();
      console.log('Reconnecting');
      this.tweetsReceived = 0;
      this.stream = twitterStream(this.statusFilter).on('data', this._transform.bind(this));
    } else {
      this.tweetsReceived = 0;
    }
  }

  _transform(tweet) {
    this.tweetsReceived++;
    if (this.tweetsReceived > 499) console.log(500);
    if (isCandidate(tweet)) {
      this.push(JSON.stringify(new Tweet(tweet)) + '\n');
    }
  }
}

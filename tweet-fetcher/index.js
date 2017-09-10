/*
 *  tweet-fetcher/index.js
 *  Fetches tweets, sanitises and stores them in MongoDB.
 *  Instantiated by TweetManager ('./index.js').
 */

// Node Modules
const { Readable } = require('stream');
// Tweet-Ingester Modules
const { Tweet } = require('../models.js');
const twitterStream = require('./twitter-client').stream;

const isCandidate = function isCandidate(tweet) {
  return !/^RT @/.test(tweet.text)
    && !tweet.retweeted_status
    && ((tweet.entities && tweet.entities.user_mentions.length > 0) || tweet.in_reply_to_status_id);
};

module.exports = class TweetFetcher extends Readable {
  constructor(params = {}) {
    super(params);
    this.statusFilter = params.statusFilter || { language: 'en', track: 'a,e,i,o,u,y,A,E,I,O,U,Y, ' };
    this.tweets = [];
    twitterStream(this.statusFilter).on('data', tweet => tweet && this.tweetHandler(tweet, 'utf8'));
  }

  tweetHandler(tweet) {
    if (isCandidate(tweet)) {
      this.push(JSON.stringify(new Tweet(tweet)) + '\n');
    }
  }

  _read() {
  }
}

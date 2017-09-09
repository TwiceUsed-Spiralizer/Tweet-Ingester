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
    this.tweetHandler.bind(this);
    twitterStream(this.statusFilter).on('data', tweet => tweet && this.tweetHandler(tweet));
  }

  tweetHandler(tweet) {
    if (isCandidate(tweet)) {
      this.latestTweet = new Tweet(tweet);
      this._read();
    }
  }

  _read() {
    if (this.latestTweet) {
      this.push(JSON.stringify(this.latestTweet));
      this.latestTweet = false;
    }
  }
}

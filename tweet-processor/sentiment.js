// Libraries
const sentiment = require('sentiment');
const { assign, pick, bind } = require('lodash');

module.exports = class Sentiment {
  constructor(next) {
    this.next = next;
    this.process = bind(this.process, this);
  }

  process(tweet) {
    this.next(assign(tweet, {
      sentiment: pick(sentiment(tweet.full_text.replace(/@\w+/, '')), ['score', 'comparative'])
    }));
  }
};

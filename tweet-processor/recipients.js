// Tweet-Ingester modules
const { User } = require('../models');
const { lookupUsers } = require('../tweet-fetcher/twitter-client');
// Libraries
const { forEach, map, identity, includes, throttle, bind } = require('lodash');

module.exports = class Recipients {
  constructor(next) {
    this.next = next;
    this.tweets = [];
    this.userIds = [];
    this.index = 0;
    this.process = bind(this.process, this);
    this.populateRecipients = throttle(this.populateRecipients, 1000);
  }

  async process(tweet) {
    // If 'space' in query for recipients, push
    if (tweet.recipients.length + this.index <= 100) {
      forEach(tweet.recipients, recipient => {
        this.userIds[this.index++] = recipient;
      });
      this.tweets.push(tweet);
    // Else, query those so far
    } else {
      const tweetsForNext = this.tweets;
      const idsToLookup = this.userIds;
      this.userIds = [];
      this.tweets = tweetsForNext.splice(-1);
      this.index = 0;
      const processedTweets = await this.populateRecipients(tweetsForNext, idsToLookup);
      forEach(processedTweets, this.next);
    }
  }

  // Coordinates user lookup and populates recipients with objects
  populateRecipients(tweetsForNext, idsToLookup) {
    const userObjects = {};
    const userIdToObject = recipient => userObjects[recipient] || null;
    return new Promise(async (resolve, reject) => {
      const userResults = await lookupUsers(idsToLookup);
      forEach(userResults, user => {
        if (!userObjects[user.id_str]) {
          userObjects[user.id_str] = new User(user);
        }
      });
      forEach(tweetsForNext, tweet => {
        tweet.recipients = map(tweet.recipients, userIdToObject)
          .filter(identity);
      });
      resolve(tweetsForNext.filter(tweet => tweet.recipients.length > 0));
    });
  }

};

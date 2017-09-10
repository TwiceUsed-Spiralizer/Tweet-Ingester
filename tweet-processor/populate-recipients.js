// Tweet-Ingester modules
const { User } = require('../models');
const { lookupUsers } = require('../tweet-fetcher/twitter-client');
// Libraries
const { forEach, map, identity, includes, throttle } = require('lodash');

// Variables for populate() closure
let tweets = [];
let userIds = [];
let index = 0;

// Coordinates user lookup and populates recipients with objects
const populateRecipients = throttle(function populateRecipients(tweetsForNext, idsToLookup) {
  return new Promise(async (resolve, reject) => {
    const userResults = await lookupUsers(idsToLookup);
    const userObjects = {};
    forEach(userResults, user => {
      if (!userObjects[user.id_str]) {
        userObjects[user.id_str] = new User(user);
      }
    });
    forEach(tweetsForNext, tweet => {
      tweet.recipients = map(tweet.recipients, recipient =>
        userObjects[recipient] || null
      ).filter(identity);
    });
    resolve(tweetsForNext.filter(tweet => tweet.recipients.length > 0));
  });
}, 1000);

module.exports = async function populate(tweet, next) {
  // If 'space' in query for recipients, push
  if (tweet.recipients.length + index <= 100) {
    forEach(tweet.recipients, recipient => {
      userIds[index++] = recipient;
    });
    tweets.push(tweet);
  // Else, query those so far
  } else {
    const tweetsForNext = tweets;
    const idsToLookup = userIds;
    userIds = [];
    tweets = tweetsForNext.splice(-1);
    index = 0;
    next(await populateRecipients(tweetsForNext, idsToLookup));
  }
};

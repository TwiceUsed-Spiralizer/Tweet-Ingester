const { User } = require('../models');
const { lookupUsers } = require('../tweet-fetcher/twitter-client');
const { forEach, map, identity, includes } = require('lodash');

let tweets = [];
let userIds = new Array(100);
let index = 0;

const populateRecipients = function populateRecipients(tweetsForNext, idsToLookup) {
  return new Promise ((resolve, reject) => {
    resolve(tweetsForNext);
  });
}

module.exports = async function populate(tweet, next) {
  // Extract userIds to array
  if (tweet.recipients.length + index <= 100) {
    forEach(tweet.recipients, recipient => 
      userIds[index++] = recipient.id_str
    );
    tweets.push(tweet);
  } else {
    const tweetsForNext = tweets;
    tweets = new Array(100);
    tweets[0] = tweet;
    index = 0;
    next(await populateRecipients(tweetsForNext, userIds));
    userIds = [];
  }

  // someFunction()
    // Do some internet stuff or whatever
    // User async / await LIKE A BOSS
};

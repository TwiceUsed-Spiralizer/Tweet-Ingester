const { User } = require('../models');
const { lookupUsers } = require('../tweet-fetcher/twitter-client');
const { forEach, map, identity, includes } = require('lodash');

let tweets = [];
let userIds = [];

module.exports = function populate(tweets, next) {
  // Push to array

  // Extract userIds to array

  // if 100 userIds
    // run someFunction with args({ tweets, userIds })
    // create new array-- [] or [last tweet]

  // someFunction()
    // Do some internet stuff or whatever
    // User async / await LIKE A BOSS
};
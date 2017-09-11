require('dotenv').config();
const elasticsearch = require('elasticsearch');
// const { reduce, filter, chain, omit } = require('lodash');

const esClient = new elasticsearch.Client({
  host: process.env.ELASTICSEARCH_HOST,
});

module.exports = class Elastic {
  constructor() {
    this.indexNum = 0;
    this.indexObj = { index: { _index: 'twitter', _type: 'tweet' } };
    this.bulkOp = new Array(1000);
    this.process = this.process.bind(this);
  }

  process(tweet) {
    this.bulkOp[this.indexNum++] = this.indexObj;
    this.bulkOp[this.indexNum++] = tweet;
    if (this.indexNum >= 1000) {
      esClient.bulk({ body: this.bulkOp });
      this.bulkOp = [];
      this.indexNum = 0;
    }
  }
}

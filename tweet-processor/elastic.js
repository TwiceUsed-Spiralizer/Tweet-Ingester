module.exports = class Elastic {
  constructor() {
    this.process = this.process.bind(this);
  }

  process(tweet) {
    console.log(tweet);
  }
}
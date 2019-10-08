const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options = {}) {
    super(options);

    this.limit = options.limit;
    this.dataLength = 0;
  }

  _transform(chunk, encoding, callback) {
    this.dataLength += chunk.toString().length;

    if (this.dataLength > this.limit) {
      callback(new LimitExceededError());
    }

    callback(null, chunk);
  }
}

module.exports = LimitSizeStream;

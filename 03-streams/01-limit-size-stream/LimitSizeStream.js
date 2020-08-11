const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit;
    this.transformedBytesCount = 0;
  }

  _transform(chunk, encoding, callback) {
    this.transformedBytesCount += chunk.length;
    if (this.transformedBytesCount <= this.limit) {
      callback(null, chunk);
    } else {
      callback(new LimitExceededError());
    }
  }
}

module.exports = LimitSizeStream;

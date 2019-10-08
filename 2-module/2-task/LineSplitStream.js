const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.lineStr = '';
  }

  _transform(chunk, encoding, callback) {
    this.lineStr += chunk.toString();

    callback();
  }

  _flush(callback) {
    this.lineStr.split(os.EOL).forEach((line) => this.push(line));
    callback();
  }
}

module.exports = LineSplitStream;

const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.lineSeparator = os.EOL;
    this.lineBuffer = '';
  }

  _transform(chunk, encoding, callback) {
    const linesArr = chunk.toString().split(this.lineSeparator);
    if (linesArr.length > 1) {
      this.push(this.lineBuffer + linesArr[0]);
      this.lineBuffer = '';
    }
    for (const newChunk of linesArr.slice(1, linesArr.length - 1)) {
      this.push(newChunk);
    }
    this.lineBuffer += linesArr[linesArr.length - 1];
    callback();
  }

  _flush(callback) {
    this.push(this.lineBuffer);
    callback();
  }
}

module.exports = LineSplitStream;

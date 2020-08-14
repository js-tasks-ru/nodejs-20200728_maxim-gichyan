const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.lineBuffer = '';
    this.lineSeparator = os.EOL;
  }

  _transform(chunk, encoding, callback) {
    const linesArray = chunk.toString().split(this.lineSeparator);
    // Если в чанке есть разделитель, то к первому элементу добавляем текущий буфер и пушем
    if (linesArray.length > 1) {
      this.push(this.lineBuffer + linesArray[0]);
      this.lineBuffer = '';
    }
    // Пущем все промежуточнэе строки
    for (const newChunk of linesArray.slice(1, linesArray.length - 1)) {
      this.push(newChunk);
    }
    // Добавляем в буфер в последний элемент массива
    this.lineBuffer += linesArray[linesArray.length - 1];
    callback();
  }

  _flush(callback) {
    callback(null, this.lineBuffer);
  }
}

module.exports = LineSplitStream;

const EventEmitter = require('events');

class Chat extends EventEmitter {
  constructor(options) {
    super();
    this.size = options.size;
    this.chat = [];
  }

  publish = (message) => {
    try {
      this.chat.length === this.size ? this.chat.shift() : null;
      this.chat.push(message);
      this.emit('message', null, message);
    } catch (err) {
      this.emit('message', err, null);
    }
  };
}

module.exports = Chat;

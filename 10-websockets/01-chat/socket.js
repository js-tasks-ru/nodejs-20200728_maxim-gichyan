const socketIO = require('socket.io');
const Session = require('./models/Session');
const Message = require('./models/Message');

function socket(server) {
  const io = socketIO(server);

  io.use(async function (socket, next) {
    const token = socket.handshake.query.token;
    if (!token) {
      next(new Error('anonymous sessions are not allowed'));
    }
    const session = await Session.findOne({ token: token }).populate('user');
    const user = session.user;
    if (!user) {
      next(new Error('wrong or expired session token'));
    }
    socket.user = user;
    next();
  });

  io.on('connection', function (socket) {
    socket.on('message', async (msg) => {
      const message = new Message({
        user: socket.user.displayName,
        chat: socket.user.id,
        text: msg,
        date: new Date(),
      });
      await message.save();
    });
  });

  return io;
}

module.exports = socket;

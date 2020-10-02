const Message = require('../models/Message');

module.exports.messageList = async function messages(ctx, next) {
  const messages = await Message.find({ user: ctx.user.displayName })
    .sort('-date')
    .limit(20);
  ctx.body = {
    messages: messages.map((i) => {
      return {
        date: i.date,
        id: i.id,
        text: i.text,
        user: i.user,
      };
    }),
  };
};

const User = require('../../models/User');
module.exports = async function authenticate(
  strategy,
  email,
  displayName,
  done
) {
  try {
    if (!email) {
      done(null, false, 'Не указан email');
    } else {
      const user = await User.findOne({ email: email });
      if (!user) {
        const newUser = await new User({
          email: email,
          displayName: displayName,
        }).save();
        return done(null, newUser);
      } else {
        return done(null, user);
      }
    }
  } catch (err) {
    done(err);
  }
};

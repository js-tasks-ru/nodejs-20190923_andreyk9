const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  if (!email) return done(null, false, 'Не указан email');

  let user = await User.findOne({email});

  if (!user) {
    try {
      const u = new User({email, displayName});
      await u.save();

      user = await User.findOne({email: u.email});
    } catch (error) {
      done(error);
    }
  }

  return done(null, user);
};

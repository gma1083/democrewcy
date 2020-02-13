const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
const Noomman = require('noomman');
const User = require('../models/User');

const options = {
  usernameField : 'email',
  passwordField : 'password'
};

passport.serializeUser((user, done) => { done(null, user.id); });

passport.deserializeUser((id, done) => {
  return User.findById(Noomman.ObjectId(id))
  .then((user) => { done(null, user); })
  .catch((err) => { done(err,null); });
});

passport.use(new LocalStrategy(options, async (email, password, done) => {
  const user = await User.findOne({ email : email});
  if(!user) done(null, false);
  else if(!(user.password === password)) done(null, false);
  else done(null, user);
}));

module.exports = passport;



const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
const Account = require('../models/Account');
const Noomman = require('noomman');

const options = {
  usernameField : 'email',
  passwordField : 'password'
};

passport.serializeUser((account, done) => { done(null, account.id); });

passport.deserializeUser((id, done) => {
  return Account.findById(Noomman.ObjectId(id))
  .then((account) => { done(null, account); })
  .catch((err) => { done(err,null); });
});

passport.use(new LocalStrategy(options, async (email, password, done) => {
  const account = await Account.findOne({ email : email});
  if(!account) done(null, false);
  else if(!(account.password === password)) done(null, false);
  else done(null, account);
}));

module.exports = passport;



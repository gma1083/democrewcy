const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
// const User = require('../models/User');
const Account = require('../models/Account');


// const knex = require('./db/connection');

const options = {
  userNameField : 'email',
  passwordField : 'password'
};

passport.serializeUser((account, done) => { done(null, account.id); });

// passport.deserializeUser((id, done) => {
//   return knex('users').where({id}).first()
//   .then((user) => { done(null, user); })
//   .catch((err) => { done(err,null); });
// });

passport.deserializeUser((id, done) => {
  return Account.findById(id)
  .then((account) => { done(null, account); })
  .catch((err) => { done(err,null); });
});

passport.use(new LocalStrategy(options, (email, password, done) => {
  console.log('In Local Strategy');
  console.log('Email : ' + email +  "Password : " + password);
  return Account.findOne({ email : email})
  .then((account) => {
    if (!account) return done(null, false);

    if (password === account.password) {
      return done(null, account);
    } else {
      return done(null, false);
    }
  })
  .catch((err) => { return done(err); });
}));

// passport.use(new LocalStrategy(options, (username, password, done) => {
//   knex('users').where({ username }).first()
//   .then((user) => {
//     if (!user) return done(null, false);
//     if (password === user.password) {
//       return done(null, user);
//     } else {
//       return done(null, false);
//     }
//   })
//   .catch((err) => { return done(err); });
// }));
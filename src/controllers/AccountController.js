const noomman = require('noomman');
const Instance = noomman.Instance;
const Account = require('../models/Account');
const User = require('../models/User');

async function createAccount(body) {
    if(!body) throw new Error('Create Account Request Body is Null or Undefined');
    const email = body.email;
    const password = body.password;
    const firstName = body.user.firstName;
    const lastName = body.user.lastName;
    const birthDate = body.user.birthDate;

    const account = new Instance(Account);
    account.email = email;
    account.password = password;

    const user = new Instance(User);
    user.firstName = firstName;
    user.lastName = lastName;
    user.birthDate = birthDate;

    account.user = user;
    user.account = account;

    await account.save();
    await user.save();
 
    return account._id;

}

module.exports = {
    createAccount,
}
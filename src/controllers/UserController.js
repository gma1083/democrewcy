const noomman = require('noomman');
const Instance = noomman.Instance;
const User = require('../models/User');

async function createUser(body) {
    if(!body) throw new Error('Create Account Request Body is Null or Undefined');
   
    const email = body.email;
    const password = body.password;
    const firstName = body.firstName;
    const lastName = body.lastName;
    const birthDate = new Date(body.birthDate);

    const user = new Instance(User);
    user.firstName = firstName;
    user.lastName = lastName;
    user.birthDate = birthDate;
    user.email = email;
    user.password = password;

    await user.save();
 
    return user;

}

module.exports = {
    createUser,
}
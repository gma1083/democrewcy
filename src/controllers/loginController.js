const noomman = require('noomman');
const User = require('../models/User');

async function claimUser(body) {
    if(!body) throw new Error('Claim User Request Body is Null or Undefined');
    const id = body.id;
    const email = body.email;
    const password = body.password;

    let user;

    try {
        const noommanId = noomman.ObjectId(id);
        user = await User.findById(noommanId);
    }
    catch(error) {
        if(error.message === 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters') throw new Error('User ID is not Valid')
    }


    if(user === null) throw new Error('No User With That ID');
    
    user.email = email;
    user.password = password;

    await user.save();
    return user;
}

module.exports = {
    claimUser,
}
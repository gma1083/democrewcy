const noomman = require('noomman');
const Account = require('../models/Account');

async function claimAccount(body) {
    if(!body) throw new Error('Claim Account Request Body is Null or Undefined');
    const id = body.id;
    const email = body.email;
    const password = body.password;

    let account;

    try {
        const noommanId = noomman.ObjectId(id);
        account = await Account.findById(noommanId);
    }
    catch(error) {
        if(error.message === 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters') throw new Error('Account ID is not Valid')
    }


    if(account === null) throw new Error('No Account With That ID');
    
    account.email = email;
    account.password = password;

    await account.save();
    return account;
}

module.exports = {
    claimAccount,
}
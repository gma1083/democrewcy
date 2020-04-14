const Noomman = require('noomman');
const User = require('../models/User');
const MiraController = require('./MiraController');

const InstanceSet = Noomman.InstanceSet;

async function getDirectMessages(data) {
    if(!data) throw new Error('getDirectMessages() requires a data object paramter with user Id');
    const user = await User.findById(data.user);
    if(!user) throw new Error('User Not Found');

    const response = [];

    const directMessages = await user.directMessages;

    for(const directMessage of directMessages) {
        response.push(await MiraController.formatInstanceForGetRequest(directMessage));
    }

    return response;
}

module.exports = {
    getDirectMessages,
}
const Noomman = require('noomman');
const Channel = require('../models/Channel');
const User = require('../models/User');
const MiraController = require('./MiraController')

const InstanceSet = Noomman.InstanceSet;

async function getChannels(data) {
    const user = await User.findById(data.user);
    if(!user) throw new Error('User Not Found');

    const response = [];
    const channels = new InstanceSet(Channel);
    const positions = await user.positions;

    for (const position of positions) {
        channels.add(await position->group->channel);
    }
    
    for (channel of channels) {
        response.push(await MiraController.formatInstanceForGetRequest(channel));
    }

    return response;
}

module.exports = {
    getChannels,
}
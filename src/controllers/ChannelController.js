const Noomman = require('noomman');
const Channel = require('../models/Channel');
const User = require('../models/User');
const Event = require('../models/Event');
const MiraController = require('./MiraController')

const InstanceSet = Noomman.InstanceSet;

async function getChannels(data) {
    if(!data) throw new Error('getChannels requires a data object paramter with user Id');
    const user = await User.findById(data.user);
    if(!user) throw new Error('User Not Found');

    const response = [];
    const channels = new InstanceSet(Channel);
    const events = new InstanceSet(Event);
    const positions = await user.positions;
    const directMessages = await user.directMessages;

    for (const position of positions) {
        channels.add(await (await position.group).channel);
        const eventsArray = await (await position.group).events;
        for(event of eventsArray) events.add(event);
    }

    for (channel of channels) {
        response.push(await MiraController.formatInstanceForGetRequest(channel));
    }

    for (event of events) {
        response.push(await MiraController.formatInstanceForGetRequest(event));
    }

    for (message of directMessages) {
        response.push(await MiraController.formatInstanceForGetRequest(message));
    }

    return response;
}

module.exports = {
    getChannels,
}
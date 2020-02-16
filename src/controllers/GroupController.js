const Noomman = require('noomman');
const Group = require('../models/Group');
const Channel = require('../models/Channel');
const User = require('../models/User');
const PositionDefinition = require('../models/PositionDefinition');

const Instance = Noomman.Instance;
const InstanceSet = Noomman.InstanceSet;

async function createGroup(data) {
    const group = new Instance(Group);
    group.name = data.name;
    group.description = data.description;

    const users = new InstanceSet(User, data.channel.users);

    const positionDefinitions = new InstanceSet(PositionDefinition, data.positionDefinitions);

    const channel = new Instance(Channel);
    channel.users = users;
    channel.channelable = group;
    
    group.channel = channel;
    group.positionDefinitions = positionDefinitions;

    positionDefinitions.forEach((positionDefinition) => positionDefinition.group = group);

    await positionDefinitions.save();
    await group.save();
    await channel.save();

    return group;

}

module.exports = {
    createGroup,
}
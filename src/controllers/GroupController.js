const Noomman = require('noomman');
const Group = require('../models/Group');
const Channel = require('../models/Channel');
const User = require('../models/User');
const PositionDefinition = require('../models/PositionDefinition');
const Position = require('../models/Position');

const Instance = Noomman.Instance;
const InstanceSet = Noomman.InstanceSet;

async function createGroup(data) {
    const group = new Instance(Group);
    group.name = data.name;
    group.description = data.description;

    const positionDefinition = await PositionDefinition.findOne({title : 'Standard'});
    group.positionDefinitions = new InstanceSet(PositionDefinition, [positionDefinition]);

    const users = new InstanceSet(User, data.users);
    const positions = new InstanceSet(Position);

    users.forEach((user) => {
      const position = new Instance(Position);
      position.group = group;
      position.user = user;
      position.positionDefinition = positionDefinition;
      user.position = position;
      positions.add(position);
    });
    
    const channel = new Instance(Channel);
    
    channel.channelable = group;
    group.channel = channel;

    await positions.save();
    await group.save();
    await channel.save();

    return group;

}

module.exports = {
    createGroup,
}
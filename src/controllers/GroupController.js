const Noomman = require('noomman');
const Group = require('../models/Group');
const Channel = require('../models/Channel');
const PositionDefinition = require('../models/PositionDefinition');

const Instance = Noomman.Instance;
const InstanceSet = Noomman.InstanceSet;

async function createGroup(data) {
    const groupName = data.name;
  //  const groupPositionDefinitions = body.PositionDefinitions;
    const groupDescription = data.description;
    const channelUsers = data.channel.users;

    const channel = new Instance(Channel);
    channel.users = channelUsers;

    const group = new Instance(Group);
    group.name = groupName;
    group.description = groupDescription;
    
    group.channel = channel;
    channel.channelable = group;

    await group.save();
    await channel.save();

    return group;
   


 //   group.positionDefinitions = new InstanceSet;

    // for(positionDefinition of groupPositionDefinitions) {
    //    const position = new Instance(PositionDefinition);
    //    position.assign(positionDefinition);
    //    group.positionDefinitions.add(position);
    // }

    await group.save();


}

module.exports = {
    createGroup,
}
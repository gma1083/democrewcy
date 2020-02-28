const Noomman = require('noomman');
const Group = require('../models/Group');
const Channel = require('../models/Channel');
const User = require('../models/User');
const PositionDefinition = require('../models/PositionDefinition');
const Position = require('../models/Position');
const MiraController = require('./MiraController')

const Instance = Noomman.Instance;
const InstanceSet = Noomman.InstanceSet;

async function createGroup(data) {
   if(!data.users) throw new Error('At Least One User Is Required To Create A Group');

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
      position.startDate = new Date();
      position.positionDefinition = positionDefinition;
      user.position = position;
      positions.add(position);
    });
    
    const channel = new Instance(Channel);
    
    channel.channelable = group;
    group.channel = channel;
    group.positions = positions;

    await positions.save();
    await group.save();
    await channel.save();

    return group;

}

async function getSubGroups(data) {
    const group = await Group.findById(data.id);
    if(!group) throw new Error('Group Not Found');

    const subGroups = await group.subGroups;
    const response = [];

    for (const subGroup of subGroups) {
        response.push(await MiraController.formatInstanceForGetRequest(subGroup));
    }

    // subGroups.forEach((subGroup) => {
    //     const document = subGroup.toDocument();
    //     document.id = subGroup.id;
    //     delete document._id;
    //     response.push(document);
    // });

    return response;
}

module.exports = {
    createGroup,
    getSubGroups,
}
const Noomman = require('noomman');
const Instance = Noomman.Instance;
const InstanceSet = Noomman.InstanceSet;
const bcrypt = require('bcrypt');

require('../src/models/index');

const Appointment = require('../src/models/Appointment');
const Channel = require('../src/models/Channel');
const Channelable = require('../src/models/Channelable');
const CreatePosition = require('../src/models/CreatePosition');
const DirectMessage = require('../src/models/DirectMessage');
const Event = require('../src/models/Event');
const Group = require('../src/models/Group');
const IndividualVote = require('../src/models/IndividualVote');
const Message = require('../src/models/Message');
const MessageBoard = require('../src/models/MessageBoard');
const Motion = require('../src/models/Motion');
const Position = require('../src/models/Position');
const PositionDefinition = require('../src/models/PositionDefinition');
const User = require('../src/models/User');
const Vote = require('../src/models/Vote');
const VoteOption = require('../src/models/VoteOption');

async function seedUser() {
    const user1 = new Instance(User);
    user1.firstName = "Harry",
    user1.lastName = "Potter",
    user1.birthDate = new Date('1980-07-31');
    user1.email = "harry@potter.com";
    user1.password = await bcrypt.hash("lemonDrop", 10);

    return user1.save();
}

async function seedUsers() {

    let users = new InstanceSet(User);

    user1 = new Instance(User);
    user1.firstName = "Hermione",
    user1.lastName = "Granger",
    user1.birthDate = new Date('1980-07-31');
    user1.email = "hermioneGranger@hogwarts.edu";
    user1.password = await bcrypt.hash("<3krum", 10);

    user2 = new Instance(User);
    user2.firstName = "Ron",
    user2.lastName = "Weasley",
    user2.birthDate = new Date('1980-03-01');
    user2.email = "ronWeasley@hogwarts.edu";
    user2.password = await bcrypt.hash("Dilligrout", 10);

    user3 = new Instance(User);
    user3.firstName = "Albus",
    user3.lastName = "Dumbledore",
    user3.birthDate = new Date('1881-07-01');
    user3.email = "albusDumbledore@howarts.edu";
    user3.password = await bcrypt.hash("sherbertLemon", 10);
    user3.admin = true;

    users.addInstances([user1, user2, user3]);

    await users.save();

    return users;
}

async function seedGroupModule() {
    const group = new Instance(Group);
    const positionDefinition = new Instance(PositionDefinition);
    const position = new Instance(Position);
    const channel = new Instance(Channel);
    const positions = new InstanceSet(Position, [position]);
    const positionDefinitions = new InstanceSet(PositionDefinition, [positionDefinition]);
    const users = await seedUsers();
    const user = users.instanceAt(0);

    group.name = 'Standard Seed Group';
    group.description = 'Group Created From SeedDB For Testing';
    group.positions = positions;
    group.positionDefinitions = positionDefinitions;
    group.channel = channel;
  
    positionDefinition.title = 'Standard Seed Position Definition';
    positionDefinition.description = 'Standard Position From SeedDB For Testing';
    positionDefinition.allowedPositions = 0;
    positionDefinition.unique = false;
    positionDefinition.positions = positions;
 
    position.group = group;
    position.positionDefinition = positionDefinition;
    position.user = user;
    position.startDate = new Date();

    user.positions = positions;
    
    channel.channelable = group;

    await group.save();
    await user.save();
    await position.save();
    await positionDefinition.save();
    await channel.save();

    const returnSeed = {
        group,
        position,
        positionDefinition,
        channel,
        user
    };

    return returnSeed;

}

async function clearAll() {
    return Promise.all([
        Appointment.clear(),
        Channel.clear(),
        Channelable.clear(),
        CreatePosition.clear(),
        DirectMessage.clear(),
        Event.clear(),
        Group.clear(),
        IndividualVote.clear(),
        Message.clear(),
        MessageBoard.clear(),
        Motion.clear(),
        Position.clear(),
        PositionDefinition.clear(),
        User.clear(),
        Vote.clear(),
        VoteOption.clear()
    ]);
}


module.exports = {
    seedUser,
    seedGroupModule,
    clearAll,
};

const Noomman = require('noomman');
const Instance = Noomman.Instance;

const Appointment = require('../../src/models/Appointment');
const Channel = require('../../src/models/Channel');
const Channelable = require('../../src/models/Channelable');
const CreatePosition = require('../../src/models/CreatePosition');
const DirectMessage = require('../../src/models/DirectMessage');
const Event = require('../../src/models/Event');
const Group = require('../../src/models/Group');
const IndividualVote = require('../../src/models/IndividualVote');
const Message = require('../../src/models/Message');
const MessageBoard = require('../../src/models/MessageBoard');
const Motion = require('../../src/models/Motion');
const Position = require('../../src/models/Position');
const PositionDefinition = require('../../src/models/PositionDefinition');
const User = require('../../src/models/User');
const Vote = require('../../src/models/Vote');
const VoteOption = require('../../src/models/VoteOption');

const seedDB = require('../../util/seedDB');

require('../../src/models/index');

describe('loginController.js Tests', () => {

    before(async () => {
        const connected = await Noomman.connect('mongodb+srv://GregArnheiter:GregArnheiter@cluster0-rqft7.gcp.mongodb.net/test?retryWrites=true&w=majority', "democrewcy_test");
        if(connected) console.log('Tests Are Connected.....');
        else console.log('Test Connections Failed');
    });

    after(async () => {
        await Noomman.close();
    });

    describe('Seed Database Tests', () => {

        before(async () => {
            await Appointment.clear();
            await Channel.clear();
            await Channelable.clear();
            await CreatePosition.clear();
            await DirectMessage.clear();
            await Event.clear();
            await Group.clear();
            await IndividualVote.clear();
            await Message.clear();
            await MessageBoard.clear();
            await Motion.clear();
            await Position.clear();
            await PositionDefinition.clear();
            await User.clear();
            await Vote.clear();
            await VoteOption.clear();
        });

        it('Seed User Test - Happy Path', async () => {
            const user = await seedDB.seedUser();
            const foundUser = await User.findById(user._id);

            if(!foundUser) throw new Error('User Seed Failed');

        });

        it('Seed Group Module Test - Happy Path', async () => {
            const groupModule = await seedDB.seedGroupModule();

            const foundGroup = await Group.findById(groupModule.group._id);
            const foundUser = await User.findById(groupModule.user._id);
            const foundPosition = await Position.findById(groupModule.position._id);
            const foundPositionDefinition = await PositionDefinition.findById(groupModule.positionDefinition._id);
            const foundChannel = await Channel.findById(groupModule.channel._id);

            if(!foundGroup) throw new Error('Seed Group Module Failed - Group Not Found');
            if(!foundUser) throw new Error('Seed Group Module Failed - User Not Found');
            if(!foundPosition) throw new Error('Seed Group Module Failed - Position Not Found');
            if(!foundPositionDefinition) throw new Error('Seed Group Module Failed - Position Definition Not Found');
            if(!foundChannel) throw new Error('Seed Group Module Failed - Channel Not Found');

        });

        

    });


});
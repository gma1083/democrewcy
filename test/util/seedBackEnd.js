const Noomman = require('noomman');
const database = require('./database');
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
const MotionContext = require('../../src/models/MotionContext');
const Position = require('../../src/models/Position');
const PositionDefinition = require('../../src/models/PositionDefinition');
const Power = require('../../src/models/Power');
const RSVP = require('../../src/models/RSVP');
const User = require('../../src/models/User');
const Vote = require('../../src/models/Vote');
const VoteOption = require('../../src/models/VoteOption');

const seedDB = require('../../util/seedBackEnd');

require('../../src/models/index');

describe('seedBackEnd.js Tests', () => {

    before(async () => {
        const connected = await database.connect();
        if(connected) console.log('Unit Tests Connected.....');
        else console.log('Test Connections Failed');
    });

    after(async () => {
        await Noomman.close();
    });

    describe('Seed Backend Database Tests', () => {

        beforeEach(async () => {
            await seedDB.clearAll();
        });

        describe('Seed User Tests', () => {

            it('Seed User Test - Single User Seeded Correctly', async () => {
                const user = await seedDB.seedUser();
                const foundUser = await User.findById(user._id);
    
                if(!foundUser) throw new Error('User Seed Failed');
    
            });
    
            it('Seed Users Test - 9 Users Seeded Correctly', async () => {
                const users = await seedDB.seedUsers();
                const foundUsers = await User.find({});
                
                if(foundUsers.size !== 9) throw new Error('seedUsers() should seed exactly 9 users');

                for(user of users) {
                    const found = User.findById(user.id);
                    if(!found) throw new Error('User: ' + user.firstName + " " + user.lastName + " returned by seedDB() was not found in the DB.");
                }
    
            });

        });

        describe('Seed Powers Tests', () => {
    
            it('Seed Powers Test - 6 Powers Seeded Correctly', async () => {
                const powers = await seedDB.seedPowers();
                const foundPowers = await Power.find({});
                
                if(foundPowers.size !== 6) throw new Error('seedPowers() should seed exactly 6 powers');

                for(power of powers) {
                    const found = Power.findById(power.id);
                    if(!found) throw new Error('Power: ' + name + " returned by seedDB() was not found in the DB.");
                }
    
            });

        });

        describe('Seed Groups Tests', () => {

            it('Seed Group Module Test', async () => {
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

});
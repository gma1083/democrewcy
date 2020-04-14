const Noomman = require('noomman');
const database = require('../util/database');
const Group = require('../../src/models/Group');
const User = require('../../src/models/User');
const Event = require('../../src/models/Event');
const Channel = require('../../src/models/Channel');
const DirectMessage = require('../../src/models/DirectMessage');
const DirectMessageController = require('../../src/controllers/DirectMessageController');
const SeedDB = require('../../util/seedDB');
const Instance = Noomman.Instance;
const InstanceSet = Noomman.InstanceSet;


require('../../src/models/index');

describe('DirectMessageController.js Tests', () => {

    before(async () => {
        const connected = await database.connect();
        if(connected) console.log('Tests Are Connected.....');
        else console.log('Test Connections Failed');
    });

    after(async () => {
        await database.close();
    });

    describe('getDirectMessages() Tests', () => {

        before(async () => {
            await SeedDB.clearAll();
            await SeedDB.seed();
        });

        it('getDirectMessages() - Empty Request', async () => {

            try {
                await DirectMessageController.getDirectMessages();
                throw new Error('getDirectMessages() Should Have Thrown Error For Empty Request');
            }
            catch(error) {
                if(error.message !== 'getDirectMessages() requires a data object paramter with user Id') throw new Error('getDirectMessages() - Empty Request Threw Unexpected Error');
            }

        });

        it('getDirectMessages() - User Not Found', async () => {

            try {
                await DirectMessageController.getDirectMessages({user : Noomman.ObjectId()});
                throw new Error('getDirectMessages() Should Have Thrown Error For User Not Found');
            }
            catch(error) {
                if(error.message !== 'User Not Found') throw new Error('getDirectMessages() - User Not Found Threw Unexpected Error');
            }

        });

        it('getDirectMessages() - Single User DM', async () => {

            const user = await User.findOne({ firstName : "Harry", lastName : "Potter"});
            const directMessage = new Instance(DirectMessage);
            directMessage.assign({users : new InstanceSet(User, [user])});
            await directMessage.save();
        
            const data = { user : user.id };
            const userDirectMessages = await DirectMessageController.getDirectMessages(data);

            const updatedUser = await User.findOne({ firstName : "Harry", lastName : "Potter"});
            const dmCount = (await updatedUser.directMessages).size;

           if(dmCount !== userDirectMessages.length) throw new Error('Counts Dont Match Up')


            await directMessage.delete();

        });

        it('getDirectMessages() - Two Users DM', async () => {

            const user1 = await User.findOne({ firstName : "Harry", lastName : "Potter"});
            const user2 = await User.findOne({ firstName : "Ron", lastName : "Weasley"});
            const directMessage = new Instance(DirectMessage);
            directMessage.assign({users : new InstanceSet(User, [user1, user2])});
            await directMessage.save();
        
            const data = { user : user1.id };
            const userDirectMessages = await DirectMessageController.getDirectMessages(data);

            if(userDirectMessages.length !== 1) throw new Error('getDirectMessages() should have returned 2 items in array');

        });

    });

});
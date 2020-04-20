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
        
            const userData = { user : user.id };
            const userDirectMessages = await DirectMessageController.getDirectMessages(userData);

            const updatedUser = await User.findOne({ firstName : "Harry", lastName : "Potter"});           
            
            if(updatedUser.directMessages_ids[0].toHexString() !== directMessage.id) {
                await directMessage.delete();
                throw new Error('DM Message IDs Did Not Match');
            }

            await directMessage.delete();

        });

        it('getDirectMessages() - Multiple users DM', async () => {

            const user1 = await User.findOne({ firstName : "Harry", lastName : "Potter"});
            const user2 = await User.findOne({ firstName : "Ron", lastName : "Weasley"});
            const user3 = await User.findOne({ firstName : "Hermione", lastName : "Granger"});
            const directMessage1 = new Instance(DirectMessage);
            const directMessage2 = new Instance(DirectMessage);
            directMessage1.assign({users : new InstanceSet(User, [user1, user2])});
            directMessage2.assign({users : new InstanceSet(User, [user1, user3])});
            await directMessage1.save();
            await directMessage2.save();

            const directMessages = [directMessage2.id, directMessage1.id];
        
            const harryData = { user : user1.id };
            await DirectMessageController.getDirectMessages(harryData);
            
            const updatedHarry = await User.findOne({ firstName : "Harry", lastName : "Potter"}); 

            const harrysDMs = updatedHarry.directMessages_ids.map(id => id.toHexString());

            if(harrysDMs.length !== directMessages.length) throw new Error("Arrays not equal size");

            for(dM of harrysDMs) {
                if(!(directMessages.includes(dM))) throw new Error('getDirectMessage() didnt include expected Ids');
            }

        });

    });

});
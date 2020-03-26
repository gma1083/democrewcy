const Noomman = require('noomman');
const database = require('../util/database');
const Group = require('../../src/models/Group');
const User = require('../../src/models/User');
const Event = require('../../src/models/Event');
const Channel = require('../../src/models/Channel');
const ChannelController = require('../../src/controllers/ChannelController');
const SeedDB = require('../../util/seedDB');
const Instance = Noomman.Instance;

require('../../src/models/index');

describe('ChannelController.js Tests', () => {

    before(async () => {
        const connected = await database.connect();
        if(connected) console.log('Tests Are Connected.....');
        else console.log('Test Connections Failed');
    });

    after(async () => {
        await database.close();
    });

    describe('Get Channel Tests', () => {

        before(async () => {
            await SeedDB.clearAll();
            await SeedDB.seed();
        });

        it('Get Channels - Empty Request', async () => {

            try {
                await ChannelController.getChannels();
                throw new Error('getChannel Should Have Thrown Error For Empty Request');
            }
            catch(error) {
                if(error.message !== 'getChannels requires a data object paramter with user Id') throw new Error('getChannels - Empty Request Threw Unexpected Error');
            }

        });

        it('Get Channels - User Not Found', async () => {

            try {
                await ChannelController.getChannels({user : Noomman.ObjectId()});
                throw new Error('getChannel Should Have Thrown Error For User Not Found');
            }
            catch(error) {
                if(error.message !== 'User Not Found') throw new Error('getChannels - User Not Found Threw Unexpected Error');
            }

        });

        it('Get Channels - Channels Only', async () => {

            const user = await User.findOne({ firstName : "Harry", lastName : "Potter"});
        
            const data = { user : user.id };
            const userChannels = await ChannelController.getChannels(data);

            if(userChannels.length !== 3) throw new Error('getChannels Should have Returned 3');
            
        });

        it('Get Channels - Channels and Events', async () => {

            const user = await User.findOne({ firstName : "Harry", lastName : "Potter"});

            const quiditchGroup = await Group.findOne({name : "Quiditch Players and Coaches"});
            const channel = new Instance(Channel);
            const event = new Instance(Event);
            channel.assign({
                channelable : event
            });
            event.assign({
                name : 'Quiditch World Cup',
                startTime : new Date(1994, 08, 22, 16, 00, 00),
                endTime : new Date(1994, 08, 22, 20, 00, 00),
                group : quiditchGroup,
                channel : channel
            });
            await event.save();
        
            const data = { user : user.id };
            const userChannels = await ChannelController.getChannels(data);

            if(userChannels.length !== 4) throw new Error('getChannels Should have Returned 4');
            // await channel.delete();
            // await event.delete();
            
        });

    });

});
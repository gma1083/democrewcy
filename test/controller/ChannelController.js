const Noomman = require('noomman');
const database = require('../util/database');
const Group = require('../../src/models/Group');
const Position = require('../../src/models/Position');
const PositionDefinition = require('../../src/models/PositionDefinition');
const User = require('../../src/models/User');
const Channel = require('../../src/models/Channel');
const GroupController = require('../../src/controllers/GroupController');
const SeedDB = require('../../util/seedDB');
const Instance = Noomman.Instance;
const InstanceSet = Noomman.InstanceSet;


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

        it('Testing NEW', () => {

        });



    });

});
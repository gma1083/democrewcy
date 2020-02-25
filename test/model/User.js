const Noomman = require('noomman');
const User = require('../../src/models/User');
const Group = require('../../src/models/Group');
const Position = require('../../src/models/Position');
const PositionDefinition = require('../../src/models/PositionDefinition');
const seedDB = require('../../aux/seedDB');

const Instance = Noomman.Instance;

require('../../src/models/index');

describe('User.js Tests', () => {

    before(async () => {
        const connected = await Noomman.connect('mongodb+srv://GregArnheiter:GregArnheiter@cluster0-rqft7.gcp.mongodb.net/test?retryWrites=true&w=majority', "democrewcy_test");
        if(connected) console.log('Tests Are Connected.....');
        else console.log('Test Connections Failed');
    });

    after(async () => {
        await Noomman.close();
    })

    describe('User Method - Get Position Definitions', () => {

        before(async () => {
            await seedDB.clearAll();
        });

        it('user.position definitions - Happy Path', async () => {
           
            const seededGroup = await seedDB.seedGroupModule();
            const user = seededGroup.user;
            const positionDefinition = seededGroup.positionDefinition;
            const userPositions = await user.positionDefinitions();
            userPositions.forEach((userPositionDefinition) => {
                if(userPositionDefinition.title !== positionDefinition.title) throw new Error('user.positionDefinitions didnt match expected');
            });

        })

    });

});
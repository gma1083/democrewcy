const Noomman = require('noomman');
const database = require('../util/database');
const User = require('../../src/models/User');
const PositionController = require('../../src/controllers/PositionController');
const SeedDB = require('../../util/seedDB');


require('../../src/models/index');

describe('PositionController.js Tests', () => {

    before(async () => {
        const connected = await database.connect();
        if(connected) console.log('Tests Are Connected.....');
        else console.log('Test Connections Failed');
    });

    after(async () => {
        await database.close();
    });

    describe('getPosition() Tests', () => {

        before(async () => {
            await SeedDB.clearAll();
            await SeedDB.seed();
        });

        it('getPosition - Empty Request', async () => {

            try {
                await PositionController.getPositions();
                throw new Error('getPositions() Should Have Thrown Error For Empty Request');
            }
            catch(error) {
                if(error.message !== 'getPositions() requires a data object paramter with user Id') throw new Error('getPositions() - Empty Request Threw Unexpected Error');
            }

        });

        it('getPositions() - User Not Found', async () => {

            try {
                await PositionController.getPositions({user : Noomman.ObjectId()});
                throw new Error('getPositions() Should Have Thrown Error For User Not Found');
            }
            catch(error) {
                if(error.message !== 'User Not Found') throw new Error('getPositions() - User Not Found Threw Unexpected Error');
            }

        });

        it('getPositions() - Single User Multiple Positions', async () => {

            const user = await User.findOne({ firstName : "Harry", lastName : "Potter"});
        
            const userData = { user : user.id };
            const controllerPositions = await PositionController.getPositions(userData);          
            
            const userPositions = user.positions_ids.map(id => id.toHexString());

            if(controllerPositions.length !== userPositions.length) throw new Error('Positions Arrays Not Equal Size');

            for(controllerPosition of controllerPositions) {
                if(!(userPositions.includes(controllerPosition.id))) throw new Error('Controllers returned positions not found on user');
            } 

        });

    });

});
const Noomman = require('noomman');
const database = require('../util/database');
const User = require('../../src/models/User');
const MotionController = require('../../src/controllers/MotionController');
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
                await MotionController.getMotions();
                throw new Error('getMotions() Should Have Thrown Error For Empty Request');
            }
            catch(error) {
                if(error.message !== 'getMotions() requires a data object paramter with user Id') throw new Error('getMotions() - Empty Request Threw Unexpected Error');
            }

        });

        it('getMotions() - User Not Found', async () => {

            try {
                await MotionController.getMotions({user : Noomman.ObjectId()});
                throw new Error('getMotions() Should Have Thrown Error For User Not Found');
            }
            catch(error) {
                if(error.message !== 'User Not Found') throw new Error('getMotions() - User Not Found Threw Unexpected Error');
            }

        });

        it('getMotions() - Single User', async () => {

            const user = await User.findOne({ firstName : "Harry", lastName : "Potter"});
        
            const userData = { user : user.id };
            const controllerMotions = await MotionController.getMotions(userData);  
            
            const motionIds = [];
            const userPositions =  await user.positions;
            for(position of userPositions) {
                const motions = await position.motions;
                for(motion of motions) {
                    motionIds.push(motion.id.toHexString());
                }
            }
            
            // const userMotions = (await (await user.positions).motions_ids).map(id => id.toHexString());

            if(controllerMotions.length !== motionIds.length) throw new Error('Positions Arrays Not Equal Size');

            for(controllerMotion of controllerMotions) {
                if(!(motionIds.includes(controllerMotion.id))) throw new Error('Controllers returned positions not found on user');
            } 

        });

    });

});
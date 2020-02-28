const Noomman = require('noomman');
const database = require('../util/database');
const loginController = require('../../src/controllers/LoginController');
const User = require('../../src/models/User');
const Instance = Noomman.Instance;

require('../../src/models/index');

describe('loginController.js Tests', () => {

    before(async () => {
        const connected = await database.connect();
        if(connected) console.log('Tests Are Connected.....');
        else console.log('Test Connections Failed');
    });

    after(async () => {
        await database.close();
    });

    describe('Claim Account Tests', () => {

        before(async () => {
            await User.clear();
        });

        it('Claim Account - Happy Path', async () => {

            const userData = {
                firstName : "Greg",
                lastName : "Arnheiter",
                birthDate : new Date(),
                email : 'milad@gmail.com',
                password : "TempPassword"
            }

            const user = new Instance(User);
            user.assign(userData);

            await user.save();

            const textId = user.id;

            const request = {
                className : "Account",
                id : textId,
                email : "brulad@gmail.com",
                password : "DontStealMyPassword"
            };

            await loginController.claimUser(request);
            
            const foundUser = await User.findById(user._id);

            if(foundUser.email !== request.email) throw new Error('Claim User Failed - Email Mismatch');
            if(foundUser.password !== request.password) throw new Error('Claim User Failed - Password Mismatch');

        });

        it('Claim Account - Invalid Account ID', async () => {

            const request = {
                className : "Account",
                id : 'NOT AN ID',
                email : "brulad@gmail.com",
                password : "DontStealMyPassword"
            };

            try {
                await loginController.claimUser(request);
            }
            catch(error) {
                console.log(error.message);
                if(error.message !== 'User ID is not Valid') throw new Error('Claim User Error Should Be: User ID is not Valid');
            }


        });

        it('Claim User - User Does Not Exist', async () => {

            const request = {
                className : "Account",
                id : Noomman.ObjectId().toHexString(),
                email : "brulad@gmail.com",
                password : "DontStealMyPassword"
            };

            try {
                await loginController.claimUser(request);
            }
            catch(error) {
                console.log(error.message);
                if(error.message !== 'No User With That ID') throw new Error('Claim User Error Should Be: No User With That ID');
            }


        });

        it('Claim Account - Request Body Is Null', async () => {

            try {
                await loginController.claimUser(null);
            }
            catch(error) {
                console.log(error.message);
                if(error.message !== 'Claim User Request Body is Null or Undefined') throw new Error('Claim User Error Should Be: Claim User Request Body is Null or Undefined');
            }


        });

    });


});
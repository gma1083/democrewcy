const Noomman = require('noomman');
const database = require('../util/database');
const User = require('../../src/models/User');
const UserController = require('../../src/controllers/UserController');

require('../../src/models/index');

describe('UserController.js Tests', () => {

    before(async () => {
        const connected = await database.connect();
        if(connected) console.log('Tests Are Connected.....');
        else console.log('Test Connections Failed');
    });

    after(async () => {
        await database.close();
    });

    describe('Create User Tests', () => {

        before(async () => {
            await User.clear();
        });

        it('Create User - Happy Path', async () => {

            const data = {
                className : 'Account',
                email : 'bruce@batman.com',
                password : 'TempPassword',
                firstName : 'Bruce',
                lastName : 'Wayne',
                birthDate : new Date()
            };



            const savedUser = await UserController.createUser(data);
            const foundUser = await User.findById(savedUser._id);

            if(foundUser === null) throw new Error('Saved User is Null');
            if(foundUser.email !== data.email) throw new Error('User Save Failed - Incorrect User Email');
            if(foundUser.password !== data.password) throw new Error('User Save Failed - Incorrect User Password');
            if(foundUser.firstName !== data.firstName) throw new Error('User Save Failed - Incorrect User First Name');
            if(foundUser.lastName !== data.lastName) throw new Error('User Save Failed - Incorrect User Last Name');
            if(foundUser.birthDate.getTime() !== data.birthDate.getTime()) throw new Error('User Save Failed - Incorrect User birthDate');


        });

    });


});
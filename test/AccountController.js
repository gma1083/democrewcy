const Noomman = require('noomman');
const Account = require('../src/models/Account');
const User = require('../src/models/User');
const AccountController = require('../src/controllers/AccountController');

require('../src/models/index');

describe('AccountController.js Tests', () => {

    before(async () => {
        const connected = await Noomman.connect('mongodb+srv://GregArnheiter:GregArnheiter@cluster0-rqft7.gcp.mongodb.net/test?retryWrites=true&w=majority', "democrewcy_test");
        if(connected) console.log('Tests Are Connected.....');
        else console.log('Test Connections Failed');
    });

    after(async () => {
        await Noomman.close();
    });

    describe('Create Account Tests', () => {

        before(async () => {
            await Account.clear();
            await User.clear();
        });

        it.only('Create Account - Happy Path', async () => {

            const data = {
                className : 'Account',
                email : 'bruce@batman.com',
                password : 'TempPassword',
                user : {
                    firstName : 'Bruce',
                    lastName : 'Wayne',
                    birthDate : new Date()
                }
            };

            const savedAccountId = await AccountController.createAccount(data);
            const foundAccount = await Account.findById(savedAccountId);

            if(foundAccount === null) throw new Error('Saved Account is Null');
            if(foundAccount.email !== data.email) throw new Error('Account Save Failed - Incorrect Email');
            if(foundAccount.password !== data.password) throw new Error('Account Save Failed - Incorrect Password');







        });

    });


});
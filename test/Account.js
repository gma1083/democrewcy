const Noomman = require('noomman');
const Account = require('../src/models/Account');
const User = require('../src/models/User');
const Instance = Noomman.Instance;

require('../src/models/index');

describe('Account.js Tests', () => {

    before(async () => {
        const connected = await Noomman.connect('mongodb+srv://GregArnheiter:GregArnheiter@cluster0-rqft7.gcp.mongodb.net/test?retryWrites=true&w=majority', "democrewcy_test");
        if(connected) console.log('Tests Are Connected.....');
        else console.log('Test Connections Failed');
    });

    after(async () => {
        await Noomman.close();
    })

    describe('Account Seed Database', () => {

        it('Database Seed Account and User', async () => {
           
            const accountData = {
                email : 'gmarnheiter@gmail.com',
                password : "Password"
            }
            const account = new Instance(Account);
            account.assign(accountData);


            const userData = {
                firstName : "Greg",
                lastName : "Arnheiter",
                birthDate : new Date()
            }
            const user = new Instance(User);
            user.assign(userData);

            account.user = user;
            user.account = account;

            await account.save();
            await user.save();


        })

    });

});
const Noomman = require('noomman');
const User = require('../src/models/User');
const Instance = Noomman.Instance;

require('../src/models/index');

describe('User.js Tests', () => {

    before(async () => {
        const connected = await Noomman.connect('mongodb+srv://GregArnheiter:GregArnheiter@cluster0-rqft7.gcp.mongodb.net/test?retryWrites=true&w=majority', "democrewcy_test");
        if(connected) console.log('Tests Are Connected.....');
        else console.log('Test Connections Failed');
    });

    after(async () => {
        await Noomman.close();
    })

    describe('User Seed Database', () => {

        it('Database Seed User', async () => {
           
            const userData = {
                email : 'gmarnheiter@gmail.com',
                password : "Password",
                firstName : "Greg",
                lastName : "Arnheiter",
                birthDate : new Date()
            }

            const user = new Instance(User);
            user.assign(userData);

            await user.save();

        })

    });

});
const Noomman = require('noomman');
const loginController = require('../src/controllers/loginController');
const Account = require('../src/models/Account');
const User = require('../src/models/User');
const Instance = Noomman.Instance;

require('../src/models/index');

describe('loginController.js Tests', () => {

    before(async () => {
        const connected = await Noomman.connect('mongodb+srv://GregArnheiter:GregArnheiter@cluster0-rqft7.gcp.mongodb.net/test?retryWrites=true&w=majority', "democrewcy_test");
        if(connected) console.log('Tests Are Connected.....');
        else console.log('Test Connections Failed');
    });

    after(async () => {
        await Noomman.close();
    });

    describe('Claim Account Tests', () => {

        before(async () => {
            await Account.clear();
            await User.clear();
        });

        it('Claim Account - Happy Path', async () => {

            const accountData = {
                email : 'milad@gmail.com',
                password : "TempPassword"
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

            const textId = account.id;

            const request = {
                className : "Account",
                id : textId,
                email : "brulad@gmail.com",
                password : "DontStealMyPassword"
            };

            await loginController.claimAccount(request);
            
            const foundAccount = await Account.findById(account._id);

            if(foundAccount.email !== request.email) throw new Error('Claim Account Failed - Email Mismatch');
            if(foundAccount.password !== request.password) throw new Error('Claim Account Failed - Password Mismatch');

        });

        it('Claim Account - Invalid Account ID', async () => {

            const request = {
                className : "Account",
                id : 'NOT AN ID',
                email : "brulad@gmail.com",
                password : "DontStealMyPassword"
            };

            try {
                await loginController.claimAccount(request);
            }
            catch(error) {
                console.log(error.message);
                if(error.message !== 'Account ID is not Valid') throw new Error('Claim Account Error Should Be: Account ID is not Valid');
            }


        });

        it('Claim Account - Account Does Not Exist', async () => {

            const request = {
                className : "Account",
                id : Noomman.ObjectId().toHexString(),
                email : "brulad@gmail.com",
                password : "DontStealMyPassword"
            };

            try {
                await loginController.claimAccount(request);
            }
            catch(error) {
                console.log(error.message);
                if(error.message !== 'No Account With That ID') throw new Error('Claim Account Error Should Be: No Account With That ID');
            }


        });

        it('Claim Account - Request Body Is Null', async () => {

            try {
                await loginController.claimAccount(null);
            }
            catch(error) {
                console.log(error.message);
                if(error.message !== 'Claim Account Request Body is Null or Undefined') throw new Error('Claim Account Error Should Be: Claim Account Request Body is Null or Undefined');
            }


        });

    });


});
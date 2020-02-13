const Noomman = require('noomman');
const User = require('../src/models/User');
const Message = require('../src/models/Message');
const MessageBoard = require('../src/models/MessageBoard');
const Instance = Noomman.Instance;
const InstanceSet = Noomman.InstanceSet;
const MessageController = require('../src/controllers/MessageController');

require('../src/models/index');

describe('MessaegeController.js Tests', () => {

    before(async () => {
        const connected = await Noomman.connect('mongodb+srv://GregArnheiter:GregArnheiter@cluster0-rqft7.gcp.mongodb.net/test?retryWrites=true&w=majority', "democrewcy_test");
        if(connected) console.log('Tests Are Connected.....');
        else console.log('Test Connections Failed');
    });

    after(async () => {
        await Noomman.close();
    });

    describe('Create Message Tests', () => {

        let messageBoard;
        let user;

        before(async () => {
            await Message.clear();
            await MessageBoard.clear();

            messageBoard = new Instance(MessageBoard);
            messageBoard.name = 'Testing Board';

            user = new Instance(User);
            user.firstName = 'Peter',
            user.lastName = 'Parker',
            user.birthDate = new Date('2020-06-02');
            user.email = 'spidey@spider.com';
            user.password = 'IHateSpiders';

        
            messageBoard.users = new InstanceSet(User, [user]);

            await user.save();
            await messageBoard.save();

        });

        it('Create Message Test - Happy Path', async () => {
            
            const messageData = {
                className : "Message",
                body : "Test Message Text",
                sentAt : new Date(),
                messageBoard : messageBoard.id,
                user : user.id
            };
        
            const newMessage = await MessageController.createMessage(messageData, user);

            const foundMessage = await Message.findById(newMessage._id, user);

            if(foundMessage.body !== messageData.body) throw new Error('Create Message Failed - Bodies Are Not Equal');
            if(foundMessage.sentAt.getTime() !== messageData.sentAt.getTime()) throw new Error('Create Message Failed - Sent Times Are Not Equal');

        });

        it.skip('Create Message Test - Null Message Request', async () => {

            try {
                await MessageController.createMessage(null, user);
            }
            catch(error) {
                if(error.message !== 'Message Body Is Null Or Undefinied') throw new Error('Message Controller Did Not Catch Null Request = ' + error.properties);
            }


        });

        it.skip('Create Message Test - Empty Object Request', async () => {

            try {
                await MessageController.createMessage({}, user);
            }
            catch(error) {
                if(!(error instanceof Noomman.NoommanErrors.NoommanValidationError)) throw new Error('Error Should Be Noomman Validation Error but instead is: ' + error.message);
                if(!(error.properties.includes('user', 'messageBoard'))) throw new Error('Error Properties Dont Match');
            }


        });

        it('Create Message Test - Message User Doesnt Match Signed In User', async () => {

            const messageData = {
                className : "Message",
                body : "Test Message Text",
                sentAt : new Date(),
                messageBoard : messageBoard.id,
                user : user.id
            };
        
            try{
                await MessageController.createMessage(messageData, new Instance(User));
            }
            catch(error) {
                if(!(error instanceof Noomman.NoommanErrors.NoommanSaveError)) throw new Error('Error Shold be Noomman Validation Error but instead is: ' + error.message);
            }
           


        });

        it('Create Message Test - Requires Valid Message Board', async () => {

            const messageData = {
                className : "Message",
                body : "Test Message Text",
                sentAt : new Date(),
                messageBoard : messageBoard.id,
                user : user.id
            };

            try {
                await MessageController.createMessage(messageData, user);
            }
            catch(error) {
                if(!(error instanceof Noomman.NoommanErrors.NoommanSaveError)) throw new Error('Error Should Be Noomman Validation Error but instead is: ' + error.message);
                if(!(error.properties.includes('messageBoard'))) throw new Error('Error Properties Dont Match');
            }

        });

    });

});
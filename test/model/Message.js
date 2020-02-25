const Noomman = require('noomman');
const Message = require('../../src/models/Message');
const MessageBoard = require('../../src/models/MessageBoard');
const User = require('../../src/models/User');
const Instance = Noomman.Instance;
const InstanceSet = Noomman.InstanceSet;

require('../../src/models/index');

describe('Message.js Tests', () => {

    before(async () => {
        const connected = await Noomman.connect('mongodb+srv://GregArnheiter:GregArnheiter@cluster0-rqft7.gcp.mongodb.net/test?retryWrites=true&w=majority', "democrewcy_test");
        if(connected) console.log('Tests Are Connected.....');
        else console.log('Test Connections Failed');
    });

    after(async () => {
        await Noomman.close();
    });


    describe('CRUD Control Tests: ', () => {

        let messageBoard;
        let user;

        before(async () => {
            await Message.clear();
            await User.clear();
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

        it('CRUD - Create Test - Happy Path', async () => {

            

            const messageData = {
                className : "Message",
                body : "Test Message Text",
                sentAt : new Date(),
                messageBoard : messageBoard,
                user : user
            };

            const message = new Instance(Message);
            message.assign(messageData);
            
            await message.save(user);


        });
    
    
    });

});
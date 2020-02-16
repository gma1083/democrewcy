const Noomman = require('noomman');
const Group = require('../src/models/Group');
const PositionDefinition = require('../src/models/PositionDefinition');
const User = require('../src/models/User');
const Channel = require('../src/models/Channel');
const GroupController = require('../src/controllers/GroupController');
const Instance = Noomman.Instance;
const InstanceSet = Noomman.InstanceSet;


require('../src/models/index');

describe('GroupController.js Tests', () => {

    before(async () => {
        const connected = await Noomman.connect('mongodb+srv://GregArnheiter:GregArnheiter@cluster0-rqft7.gcp.mongodb.net/test?retryWrites=true&w=majority', "democrewcy_test");
        if(connected) console.log('Tests Are Connected.....');
        else console.log('Test Connections Failed');
    });

    after(async () => {
        await Noomman.close();
    });

    describe('Create Group Tests', () => {

        let channel;
        let user1;
        let user2;
        let users = [];
        let positionDefinition1;
        let positionDefinition2;
        let positionDefinitions = [];

        before(async () => {
            await Group.clear();
            await PositionDefinition.clear();
            await Channel.clear();
            await User.clear();

            user1 = new Instance(User);
            user1.firstName = "Harry",
            user1.lastName = "Potter",
            user1.birthDate = new Date('1980-07-31');
            user1.email = "harry@potter.com";
            user1.password = "lemonDrop";

            user2 = new Instance(User);
            user2.firstName = "Ron",
            user2.lastName = "Weasley",
            user2.birthDate = new Date('1980-03-01');
            user2.email = "ron@weasley.com";
            user2.password = "fizzingWhizbee";

            await user1.save();
            await user2.save();

            users.push(user1, user2);

            positionDefinition1 = new Instance(PositionDefinition);
            positionDefinition1.title = 'Pleb';
            positionDefinition1.description = 'Worthless';
            positionDefinition1.unique = false;
            positionDefinition2 = new Instance(PositionDefinition);
            positionDefinition2.title = 'Wizard';
            positionDefinition2.description = 'Omnipotent';
            positionDefinition2.unique = false;

            positionDefinitions.push(positionDefinition1, positionDefinition2);            
           
        });

        it('Create Group Test - Happy Path', async () => {
 
            const groupData = {
                className : "Group",
                name : "Test Group Name",
                description : "Test Group Description",
                positionDefinitions : positionDefinitions,
                channel : {
                    className : "Channel",
                    users : users
                }
            };
        
            const newGroup = await GroupController.createGroup(groupData);
            const foundGroup = await Group.findById(newGroup._id);
        
            if(!(foundGroup.name === newGroup.name)) throw new Error('Create Group Failed - Names Dont Match');

        });

        



    });

});
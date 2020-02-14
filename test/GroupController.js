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
        let user;
        let users;

        before(async () => {
            await Group.clear();
            await PositionDefinition.clear();
            await Channel.clear();
            await User.clear();

            user = new Instance(User);
            user.firstName = "Harry",
            user.lastName = "Potter",
            user.birthDate = new Date('1980-07-31');
            user.email = "harry@potter.com",
            user.password = "lemonDrop"

            users = new InstanceSet(User, [user]);
            await user.save();
        });

        it.only('Create Group Test - Happy Path', async () => {
 
            const groupData = {
                className : "Group",
                name : "Test Group Name",
                description : "Test Group Description",
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
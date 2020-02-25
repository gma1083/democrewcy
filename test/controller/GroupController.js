const Noomman = require('noomman');
const Group = require('../../src/models/Group');
const Position = require('../../src/models/Position');
const PositionDefinition = require('../../src/models/PositionDefinition');
const User = require('../../src/models/User');
const Channel = require('../../src/models/Channel');
const GroupController = require('../../src/controllers/GroupController');
const Instance = Noomman.Instance;
const InstanceSet = Noomman.InstanceSet;


require('../../src/models/index');

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
        let userSet = new InstanceSet(User);
        let standardPositionDefinition; 

        before(async () => {
            await Group.clear();
            await Position.clear();
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
            userSet.addInstances(users);
            
            standardPositionDefinition = new Instance(PositionDefinition);
            standardPositionDefinition.title = 'Standard';
            standardPositionDefinition.description = 'Default Position';
            standardPositionDefinition.unique = false;
            await standardPositionDefinition.save();
           
        });

        it('Create Group Test - Happy Path', async () => {
 
            const groupData = {
                className : "Group",
                name : "Test Group Name",
                description : "Test Group Description",
                users : users
            };
        
            const newGroup = await GroupController.createGroup(groupData);
            const foundGroup = await Group.findById(newGroup._id);
            const groupPositions = await foundGroup.positions;
            const groupPositionDefinitions = await foundGroup.positionDefinitions;
        
            if(!(foundGroup.name === newGroup.name)) 
                throw new Error('Create Group Failed - Names Dont Match');

            if(!(foundGroup.description === newGroup.description)) 
                throw new Error('Create Group Failed - Description Doesnt Match');

            for(const position of groupPositions) {
                if(!userSet.hasInstance(await position.user)) 
                    throw new Error('Create Group Failed - Group Occupied Positions Dont Contain The Right Users');
                else if(!groupPositionDefinitions.hasInstance(await position.positionDefinition)) 
                    throw new Error('Create Group Failed - Group Occupied Positions Dont Contain The Right Position Definitions');
            };

            for(const user of users) {
                let userPositionDefinitions = await user.positionDefinitions();
                let positionDefinitionForUser = [...userPositionDefinitions][0];
                if(positionDefinitionForUser.id !== standardPositionDefinition.id) 
                    throw new Error('Create Group Failed - Group Users Werent Assigned The Correct Positions');
            };

        });

    });

});
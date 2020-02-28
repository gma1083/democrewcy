const Noomman = require('noomman');
const database = require('../util/database');
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
        const connected = await database.connect();
        if(connected) console.log('Tests Are Connected.....');
        else console.log('Test Connections Failed');
    });

    after(async () => {
        await database.close();
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
            standardPositionDefinition.allowedPositions = 0;
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

        it('Create Group Test - No Users', async () => {
 
            const groupData = {
                className : "Group",
                name : "Test Group Name",
                description : "Test Group Description"
            };

            try  {
                const newGroup = await GroupController.createGroup(groupData);
            }
            catch(error) {
                if(error.message !== 'At Least One User Is Required To Create A Group') throw new Error('CreateGroup Should Have Thrown Error Requiring At Least One User');
            }

        });

    describe('Sub Group Tests:', () => {

        it('Get SubGroups - Group Doesnt Exist', async () => {
            const group = new Instance(Group);
            const request = {
                className: "Group",
                id: group.id
            };
            
            try {
                await GroupController.getSubGroups(request);
                throw new Error('getSubgroups - Group Doesnt Exist Should Have Thrown \'Grou Not Found\' Error');
            }
            catch(error) {
                if(error.message !== 'Group Not Found') throw new Error('getSubGroups Failed - Should Throw \'Group Not Found\' Error');
            }
           
        });
       
        it('Get SubGroups - No SubGroups', async () => {
            
            const group = new Instance(Group);
            const channel = new Instance(Channel);
            const position = new Instance(Position);
            
            group.name = 'Testing';
            group.description = 'Testing Sub Groups - No SubGroups';
            group.channel = channel;
            group.positions = new InstanceSet(Position, [position]);
            group.positionDefinitions = new InstanceSet(PositionDefinition, [standardPositionDefinition]);

            channel.channelable = group;
            
            position.user = user1;
            position.positionDefinition = standardPositionDefinition;
            position.group = group;
            position.startDate = new Date();

            await group.save();

            const request = {
                className: "Group",
                id: group.id
            };

            const response = await GroupController.getSubGroups(request);
            if(response.length !== 0) throw new Error('Get SubGroups Should Have Returned An Empty Array')


        });

        it('Get SubGroups - One SubGroup', async () => {

            const group = new Instance(Group);
            const subGroup = new Instance(Group);
            const groupChannel = new Instance(Channel);
            const groupPosition = new Instance(Position);
            const subGroupChannel = new Instance(Channel);
            const subGroupPosition = new Instance(Position);
            
            group.name = 'Testing Group';
            group.description = 'Testing Sub Groups - No SubGroups';
            group.channel = groupChannel;
            group.positions = new InstanceSet(Position, [groupPosition]);
            group.subGroups = new InstanceSet(Group, [subGroup]);
            group.positionDefinitions = new InstanceSet(PositionDefinition, [standardPositionDefinition]);

            subGroup.name = 'Testing SubGroup';
            subGroup.description = 'Testing Sub Groups - No SubGroups';
            subGroup.channel = subGroupChannel;
            subGroup.positions = new InstanceSet(Position, [subGroupPosition]);
            subGroup.superGroup = group;
            subGroup.positionDefinitions = new InstanceSet(PositionDefinition, [standardPositionDefinition]);

            groupChannel.channelable = group;
            subGroupChannel.channelable = subGroup;
            
            groupPosition.user = user1;
            groupPosition.positionDefinition = standardPositionDefinition;
            groupPosition.group = group;
            groupPosition.startDate = new Date();

            subGroupPosition.user = user1;
            subGroupPosition.positionDefinition = standardPositionDefinition;
            subGroupPosition.group = subGroup;
            subGroupPosition.startDate = new Date();

            await group.save();
            await subGroup.save();

            const request = {
                className: "Group",
                id: group.id
            };

            const response = await GroupController.getSubGroups(request);
            if(response.length !== 1) throw new Error('getSubGroups() Should Have Returned An Array With One Item');
            if(response[0].id !== subGroup.id) throw new Error('getSubGroups() Returned An Unexpected Id For Its Only SubGroup');

        });

        it('Get SubGroups - Multiple SubGroups', async () => {

            const group = new Instance(Group);
            const subGroup = new Instance(Group);
            const subGroup2 = new Instance(Group);
            const groupChannel = new Instance(Channel);
            const groupPosition = new Instance(Position);
            const subGroupChannel = new Instance(Channel);
            const subGroupPosition = new Instance(Position);
            const subGroup2Channel = new Instance(Channel);
            const subGroup2Position = new Instance(Position);
            
            group.name = 'Testing Group';
            group.description = 'Testing Sub Groups - No SubGroups';
            group.channel = groupChannel;
            group.positions = new InstanceSet(Position, [groupPosition]);
            group.subGroup = subGroup;
            group.positionDefinitions = new InstanceSet(PositionDefinition, [standardPositionDefinition]);

            subGroup.name = 'Testing SubGroup';
            subGroup.description = 'Testing Sub Groups - No SubGroups';
            subGroup.channel = subGroupChannel;
            subGroup.positions = new InstanceSet(Position, [subGroupPosition]);
            subGroup.superGroup = group;
            subGroup.positionDefinitions = new InstanceSet(PositionDefinition, [standardPositionDefinition]);

            subGroup2.name = 'Testing SubGroup2';
            subGroup2.description = 'Testing Sub Groups - No SubGroups';
            subGroup2.channel = subGroup2Channel;
            subGroup2.positions = new InstanceSet(Position, [subGroup2Position]);
            subGroup2.superGroup = group;
            subGroup2.positionDefinitions = new InstanceSet(PositionDefinition, [standardPositionDefinition]);

            groupChannel.channelable = group;
            subGroupChannel.channelable = subGroup;
            subGroup2Channel.channelable = subGroup2;
            
            groupPosition.user = user1;
            groupPosition.positionDefinition = standardPositionDefinition;
            groupPosition.group = group;
            groupPosition.startDate = new Date();

            subGroupPosition.user = user1;
            subGroupPosition.positionDefinition = standardPositionDefinition;
            subGroupPosition.group = subGroup;
            subGroupPosition.startDate = new Date();

            subGroup2Position.user = user1;
            subGroup2Position.positionDefinition = standardPositionDefinition;
            subGroup2Position.group = subGroup2;
            subGroup2Position.startDate = new Date();

            await group.save();
            await subGroup.save();
            await subGroup2.save();

            const request = {
                className: "Group",
                id: group.id
            };

            const response = await GroupController.getSubGroups(request);
            if(response.length !== 2) throw new Error('getSubGroups() Should Have Returned An Array With One Item');
            if(response[0].id !== subGroup.id) throw new Error('getSubGroups() Returned An Unexpected Id For Its First SubGroup');
            if(response[1].id !== subGroup2.id) throw new Error('getSubGroups() Returned An Unexpected Id For Its First SubGroup');

        });


    });

    });

});
/**
 * 
 *  seedBackEnd.js - Unit test file for /util/seedBackEnd.js
 *
 *  - Verifies the correct objects were created and saved into DB
 *  - Verifies objects were assigned correct values and relationships
 *  
 *  Methods tested:
 *  - seedUser() - Returns one user saved to the DB.
 *  - seedUsers() - Returns instance set of all users saved to the DB.
 *  - seedPowers() - Returns instance set of all powers saved to the DB.
 *  - seedPrimaryGroup() - Returns one group saved to the DB.
 *                       - Saves group's channel, positions, position definitions, 
 *                         all powers, and all users to the DB. 
 *  - seedGroups() - Returns instance set of all groups saved to the DB.
 *                 - Saves groups' chanels, positions, positions definitions,
 *                   all powers, and all users to the DB. 
 *  - clearAll() - Returns promise.all from awaiting dropping all instances from all
 *                  collections in the DB.
 * 
 **/


const Noomman = require('noomman');
const database = require('./database');
const Instance = Noomman.Instance;

const Appointment = require('../../src/models/Appointment');
const Channel = require('../../src/models/Channel');
const Channelable = require('../../src/models/Channelable');
const CreatePosition = require('../../src/models/CreatePosition');
const DirectMessage = require('../../src/models/DirectMessage');
const Event = require('../../src/models/Event');
const Group = require('../../src/models/Group');
const IndividualVote = require('../../src/models/IndividualVote');
const Message = require('../../src/models/Message');
const MessageBoard = require('../../src/models/MessageBoard');
const Motion = require('../../src/models/Motion');
const MotionContext = require('../../src/models/MotionContext');
const Position = require('../../src/models/Position');
const PositionDefinition = require('../../src/models/PositionDefinition');
const Power = require('../../src/models/Power');
const RSVP = require('../../src/models/RSVP');
const User = require('../../src/models/User');
const Vote = require('../../src/models/Vote');
const VoteOption = require('../../src/models/VoteOption');

const seedDB = require('../../util/seedBackEnd');

require('../../src/models/index');

describe('seedBackEnd.js Tests', () => {

    // Connect to the Unit Test Database before tests start.
    before(async () => {

        const connected = await database.connect();

        if(connected) console.log('Unit Tests Connected.....');
        else console.log('Test Connections Failed');

    });

    // Close the Unit Test Database after tests finsish.
    after(async () => {
         
        await Noomman.close();

    });

    describe('Seed Backend Database Tests', () => {

        // Clear all instances from DB before each test to ensure independence among tests
        beforeEach(async () => {
            
            await seedDB.clearAll();

        });

        describe('Seed User Tests', () => {

            describe('seedUser() Tests:', () => {

                // Passes if user returned by seedUser() was saved to DB
                it('seedUser() - Single User Seeded Correctly', async () => {

                    const user = await seedDB.seedUser();
                    const foundUser = await User.findById(user._id);
        
                    if(!foundUser) throw new Error('User Seed Failed');
        
                });

            });
            
            describe('seedUsers() Tests:', () => {

                // Passes if the DB contains exactly the same number of instances returned by seedUsers();
                it('Seed Users Test - All Users Seeded Without Duplicates', async () => {

                    const users = await seedDB.seedUsers();
                    const foundUsers = await User.find({});
                    
                    if(foundUsers.size !== users.size) throw new Error('There are more users in the DB than seedUsers() saved.');
                    for(user of users) {
                        const found = User.findById(user.id);
                        if(!found) throw new Error('User: ' + user.firstName + " " + user.lastName + " returned by seedDB() was not found in the DB.");
                    }
        
                });

            });

        });

        describe('Seed Powers Tests', () => {
    
            // Passes if instance sets returned by DB and seedPowers() are equal
            it('seedPowers() - All powers seeded', async () => {

                const powers = await seedDB.seedPowers();
                const foundPowers = await Power.find({});
                
                if(foundPowers.size !== 6) throw new Error('seedPowers() should seed exactly 6 powers');
                if(!powers.equals(foundPowers)) throw new Error('Powers found in DB dont match seeded powers');
    
            });

        });

        describe('Seed Groups Tests', () => {

            

            describe('seedGroupModule() Tests', () => {

                // Passes if group module
                it('Group and related instances saved', async () => {

                    const groupModule = await seedDB.seedGroupModule();
        
                    const foundGroup = await Group.findById(groupModule.group._id);
                    const foundUser = await User.findById(groupModule.user._id);
                    const foundPosition = await Position.findById(groupModule.position._id);
                    const foundPositionDefinition = await PositionDefinition.findById(groupModule.positionDefinition._id);
                    const foundChannel = await Channel.findById(groupModule.channel._id);
        
                    if(!foundGroup) throw new Error('Seed Group Module Failed - Group Not Found');
                    if(!foundUser) throw new Error('Seed Group Module Failed - User Not Found');
                    if(!foundPosition) throw new Error('Seed Group Module Failed - Position Not Found');
                    if(!foundPositionDefinition) throw new Error('Seed Group Module Failed - Position Definition Not Found');
                    if(!foundChannel) throw new Error('Seed Group Module Failed - Channel Not Found');
        
                });

            });

            describe('seedPrimaryGroup() Tests', () => {

                // Passses if exactly one group was seeded
                it('seedPrimaryGroup() - Seeds Only One Group', async () => {

                    const group = await seedDB.seedPrimaryGroup();
                    const foundGroup = await Group.find({});

                    if(foundGroup.size !== 1) throw new Error('seedPrimaryGroup() should have saved only 1 group');
                    if(!foundGroup.hasInstanceWithId(group.id)) throw new Error('seedPrimaryGroup doesnt appear in the DB');

                });

                // Passes if all users and positions were seeded properly and related to group.
                it('seedPrimaryGroup() - Users Assigned To Group', async () => {

                    const group = await seedDB.seedPrimaryGroup();
                    const users = await group.walkPath(['positions', 'user']);
                    const foundUsers = await User.find({});

                    if(!users) throw new Error('seedPrimaryGroup() failed to add users to group.');
                    if(users.size !== foundUsers.size) 
                        throw new Error('seedPrimaryGroup() failed to add all users to group.'); 

                });

                // Passes if all position definitions' powers match the layout in seedPrimaryGroup()
                it('seedPrimaryGroup() - Position Defintions Assigned Correct Powers', async () => {

                    const group = await seedDB.seedPrimaryGroup();
                    const positionDefinitions = await group.positionDefinitions;
                    const powers = await Power.find({});

                    const studentPowers = powers.filterToInstanceSet(p => ['Create Event', 'Create Group', 'Vote'].includes(p.name));
                    const professorPowers = powers.filterToInstanceSet(p => ['Create Event', 'Create Group', 'Create Motion', 'Vote'].includes(p.name));
                    const deputyPowers = powers;
                    const headmasterPowers = powers;

                    for(definition of positionDefinitions) {
                        switch(definition.title) {
                            case 'Member':
                                if((await definition.powers).size !== 0) throw new Error('Member position should not have any powers');
                                break;
                            case 'Student':
                                if(!((await definition.powers).equals(studentPowers))) throw new Error('Student position definition doesnt have the correct powers');
                                break;
                            case 'Professor':
                                if(!((await definition.powers).equals(professorPowers))) throw new Error('Professor position definition doesnt have the correct powers');
                                break;
                            case 'Deputy Headmistress':
                                if(!((await definition.powers).equals(deputyPowers))) throw new Error('Deputy Headmistress position definition doesnt have the correct powers');
                                break;
                            case 'Headmaster':
                                if(!((await definition.powers).equals(headmasterPowers))) throw new Error('Headmaster position definition doesnt have the correct powers');
                                break;
                            default:
                                throw new Error('Default statement hit unexpectedly: ' + definition.title + " was not tested for powers");
                        }
                    }

                });

                // Passes if all position definitions were seeded and related properly to group.
                it('seedPrimaryGroup() - Position Definitions Assigned To Group', async () => {

                    const group = await seedDB.seedPrimaryGroup();
                    const positionDefinitions = await group.positionDefinitions;
                    const foundPositionDefintions = await PositionDefinition.find({});

                    if(!positionDefinitions) throw new Error('seedPrimaryGroup() failed to add position definitions to group.');
                    if(foundPositionDefintions.size !== positionDefinitions.size) 
                        throw new Error('seedPrimaryGroup() failed to add all position definitions to group.');
                    
                });

                // Passes if each user was assigned the standard member position for the group
                it.skip('seedPrimaryGroup() - Each user assigned member position', async () => {

                    const group = await seedDB.seedPrimaryGroup();
                    const users = await group.walkPath(['positions', 'user']);
                    const userIds = users.getObjectIds();                    

                    const member = await PositionDefinition.findOne({title : 'Member', description : 'Member of Hogwarts School of Witchcraft and Wizardry.'});
                    if(!member) throw new Error('There should be only one member position definition for this group');

                    const positions = await group.positions;
                    const memberPositions = positions.filterToInstanceSet(p => p.positionsDefiniton_id.equals(member._id));
                    const positionUsers = memberPositions.users_ids;
    

                    if(!(users.equal(positionUsers))) throw new Error('NO');

                    for(user of users) {

                        let isMember = false;
                        const userPositions = await user.positions;

                        for(position of userPositions) {
                            const positionDefinition = await position.positionDefinition;
                            if(positionDefinition.equals(member)) {
                                isMember = true;
                                break;
                            }
                        }

                        if(!isMember) throw new Error('User: ' + user.firstName + ' ' + user.lastName + ' was not assigned member position of Group');
                        
                    }

                });

                // Passes if each user was assigned the standard member position for the group
                it('seedPrimaryGroup() - Student Positions Assigned Properly', async () => {

                    const group = await seedDB.seedPrimaryGroup();
                    const users = await group.walkPath(['positions', 'user']);

                    const student = await PositionDefinition.findOne({title : 'Student', description : 'Student of Hogwarts School of Witchcraft and Wizardry.'});
                    if(!student) throw new Error('There should be only one student position definition for this group');

                    for(user of users) {

                        let isStudent = false;
                        const userPositions = await user.positions;

                        for(position of userPositions) {
                            const positionDefinition = await position.positionDefinition;
                            if(positionDefinition.equals(student)) {
                                isStudent = true;
                                break;
                            }
                        }

                        if((!isStudent) && (['Ron', 'Hermione', 'Luna', 'Draco', 'Harry', 'Neville'].includes(user.firstName)) ) 
                            throw new Error('User: ' + user.firstName + ' ' + user.lastName + ' was not assigned student position of Group');
                        else if(isStudent && !(['Ron', 'Hermione', 'Luna', 'Draco', 'Harry', 'Neville'].includes(user.firstName))) 
                            throw new Error('User: ' + user.firstName + ' ' + user.lastName + ' should not have been given student position');
                        
                    }

                });

                // Passes if only the professors were assigned professor position
                it('seedPrimaryGroup() - Professor Positions Assigned Properly', async () => {

                    const group = await seedDB.seedPrimaryGroup();
                    const users = await group.walkPath(['positions', 'user']);

                    const professor = await PositionDefinition.findOne({title : 'Professor', description : 'Professor at Hogwarts School of Witchcraft and Wizardry.'});
                    if(!professor) throw new Error('There should a professor position for this group');

                    for(user of users) {

                        let isProfessor = false;
                        const userPositions = await user.positions;

                        for(position of userPositions) {

                            const positionDefinition = await position.positionDefinition;
                            if(positionDefinition.equals(professor)) {
                                isProfessor = true;
                                break;
                            }

                        }

                        if((!isProfessor) && (['Albus', 'Severus', 'Minerva'].includes(user.firstName)) ) 
                            throw new Error('User: ' + user.firstName + ' ' + user.lastName + ' was not assigned professor position of Group');
                        else if(isProfessor && !(['Albus', 'Severus', 'Minerva'].includes(user.firstName))) 
                            throw new Error('User: ' + user.firstName + ' ' + user.lastName + ' should not have been given professor position');
                        
                    }

                });

                // Passes if only the deputy headmistress was assigned deputy headmistress position
                it('seedPrimaryGroup() - Deputy Headmistress Position Assigned Properly', async () => {

                    const group = await seedDB.seedPrimaryGroup();
                    const users = await group.walkPath(['positions', 'user']);

                    const deputy = await PositionDefinition.findOne({title : 'Deputy Headmistress', description : 'Deputy Headmistress of Hogwarts School of Witchcraft and Wizardry.'});
                    if(!deputy) throw new Error('There should a deputy headmistress position for this group');

                    for(user of users) {

                        let isDeputy = false;
                        const userPositions = await user.positions;

                        for(position of userPositions) {

                            const positionDefinition = await position.positionDefinition;
                            if(positionDefinition.equals(deputy)) {
                                isDeputy = true;
                                break;
                            }

                        }

                        if((!isDeputy) && (['Minerva'].includes(user.firstName)) ) 
                            throw new Error('User: ' + user.firstName + ' ' + user.lastName + ' was not assigned deputy headmistress position of Group');
                        else if(isDeputy && !(['Minerva'].includes(user.firstName))) 
                            throw new Error('User: ' + user.firstName + ' ' + user.lastName + ' should not have been given deputy headmistress position');
                        
                    }

                });

                // Passes if only the headmaster was assigned headmaster position
                it('seedPrimaryGroup() - Headmaster Position Assigned Properly', async () => {

                    const group = await seedDB.seedPrimaryGroup();
                    const users = await group.walkPath(['positions', 'user']);

                    const headmaster = await PositionDefinition.findOne({title : 'Headmaster', description : 'Headmaster of Hogwarts School of Witchcraft and Wizardry.'});
                    if(!headmaster) throw new Error('There should a headmaster position for this group');

                    for(user of users) {

                        let isHeadmaster = false;
                        const userPositions = await user.positions;

                        for(position of userPositions) {

                            const positionDefinition = await position.positionDefinition;
                            if(positionDefinition.equals(headmaster)) {
                                isHeadmaster = true;
                                break;
                            }

                        }

                        if((!isHeadmaster) && (['Albus'].includes(user.firstName)) ) 
                            throw new Error('User: ' + user.firstName + ' ' + user.lastName + ' was not assigned headmaster position of Group');
                        else if(isHeadmaster && !(['Albus'].includes(user.firstName))) 
                            throw new Error('User: ' + user.firstName + ' ' + user.lastName + ' should not have been given headmaster position');
                        
                    }

                });

            });

            describe('seedGroups() Tests', () => {

                it('seedGroups() - Seeds All Groups', async () => {

                    const seededGroups = await seedDB.seedGroups();
                    const allGroups = await Group.find({});

                    if(seededGroups.size !== allGroups.size) throw new Error('seedGroups() error - groups seeded doesnt match groups found in DB');
                    for(group of seededGroups)  {
                        if(!allGroups.hasInstanceWithId(group.id)) throw new Error('Groups found doesnt include at least one of the groups seeded');
                    }

                });

                it('seedGroups() - Hogwarts Group: Has All Users', async () => {

                    await seedDB.seedGroups();
                
                    const allUsers = await User.find({});

                    const hogwartsGroup = await Group.findOne({name: 'Hogwarts School of Witchcraft and Wizardry'});
                    if(!hogwartsGroup) throw new Error('Hogwarts group should have been seeded but wasnt found');
                    const hogwartsUsers = await hogwartsGroup.walkPath(['positions', 'user']);
                    if(!hogwartsUsers.equals(allUsers)) throw new Error('Hogwarts group should contain all users');                    

                });

                it('seedGroups() - OOTP Group: Has correct users', async () => {

                    const groups = await seedDB.seedGroups();
                    const order = groups.filterToInstanceSet({name : "Order..."}).instanceAt[0];
                
                    const allUsers = await User.find({});

                    const theOrderGroup = await Group.findOne({name: 'Order of the Phoenix'});
                    if(!theOrderGroup) throw new Error('Order of the Phoenix group should have been seeded but wasnt found');
                    const orderUsers = await theOrderGroup.walkPath(['positions', 'user']);
                    const intendedOrderUsers = allUsers.filterToInstanceSet(
                        p => ['Albus', 'Harry', 'Ron', 'Hermione', 'Luna', 'Neville', 'Severus', 'Sirius', 'Minerva'].includes(p.firstName));
                    if(!orderUsers.equals(intendedOrderUsers)) throw new Error('Order of the Phoenix group doesnt contain the correct users');             

                });

                it('seedGroups() - OOTP Group: Users assigned member position', async () => {

                    const groups = await seedDB.seedGroups();
                    const theOrderGroup = await Group.findOne({name: 'Order of the Phoenix'});
                    const users = await theOrderGroup.walkPath(['positions', 'user']);

                    const member = await PositionDefinition.findOne({title : 'Member', description : 'Standard Member of The Order Of The Phoenix Group'});
                    if(!member) throw new Error('There should be only one member position definition for this group');

                    for(user of users) {

                        let isMember = false;
                        const userPositions = await user.positions;

                        for(position of userPositions) {
                            const positionDefinition = await position.positionDefinition;
                            if(positionDefinition.equals(member)) {
                                isMember = true;
                                break;
                            }
                        }

                        if(!isMember) 
                            throw new Error('User: ' + user.firstName + ' ' + user.lastName + ' was not assigned member position of Order of the Phoneix group');
                        
                    }

                });

                it('seedGroups() - Quiditch Group: Has correct users', async () => {

                    await seedDB.seedGroups();
                
                    const allUsers = await User.find({});

                    const quiditchGroup = await Group.findOne({name: 'Quiditch Players and Coaches'});
                    if(!quiditchGroup) throw new Error('Quiditch group should have been seeded but wasnt found');
                    const quiditchUsers = await quiditchGroup.walkPath(['positions', 'user']);
                    const intendedQuiditchUsers = allUsers.filterToInstanceSet(
                        p => ['Draco', 'Harry', 'Severus'].includes(p.firstName));
                    if(!quiditchUsers.equals(intendedQuiditchUsers)) throw new Error('Quiditch group doesnt contain the correct users'); 

                });

                it('seedGroups() - Quiditch Group: Users Assigned Member Position', async () => {

                    const groups = await seedDB.seedGroups();
                    const quiditchGroup = await Group.findOne({name: 'Quiditch Players and Coaches'});
                    const users = await quiditchGroup.walkPath(['positions', 'user']);

                    const member = await PositionDefinition.findOne({title : 'Member', description : 'Standard Member of the Hogwarts subgroup Quiditch Group'});
                    if(!member) throw new Error('There should be only one member position definition for this group');

                    for(user of users) {

                        let isMember = false;
                        const userPositions = await user.positions;

                        for(position of userPositions) {
                            const positionDefinition = await position.positionDefinition;
                            if(positionDefinition.equals(member)) {
                                isMember = true;
                                break;
                            }
                        }

                        if(!isMember) throw new Error('User: ' + user.firstName + ' ' + user.lastName + ' was not assigned member position of Quiditch group');
                        
                    }

                });

                // Passes Quiditch groups position powers match those defined in seedGroups()
                it('seedGroups() - Quiditch Group: Positions have correct powers', async () => {

                    await seedDB.seedGroups();
                    const group = await Group.findOne({name: 'Quiditch Players and Coaches'});
                    if(!group) throw new Error('Seeded group expected but not found');
                    const positionDefinitions = await group.positionDefinitions;
                    const powers = await Power.find({});

                    const playerPowers = powers.filterToInstanceSet(p => ['Create Event', 'Create Group', 'Create Motion', 'Vote'].includes(p.name));
                    const coachPowers = powers;

                    for(definition of positionDefinitions) {
                        switch(definition.title) {
                            case 'Member':
                                if((await definition.powers).size !== 0) throw new Error('Member position should not have any powers');
                                break;
                            case 'Player':
                                if(!((await definition.powers).equals(playerPowers))) throw new Error('Player position definition doesnt have the correct powers');
                                break;
                            case 'Coach':
                                if(!((await definition.powers).equals(coachPowers))) throw new Error('Coach position definition doesnt have the correct powers');
                                break;
                            default:
                                throw new Error('Default statement hit unexpectedly: ' + definition.title + " was not tested for Quiditch group powers");
                        }
                    }

                });
            
            });

        });

    });

});
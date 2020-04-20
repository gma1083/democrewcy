const Noomman = require('noomman');
const Instance = Noomman.Instance;
const InstanceSet = Noomman.InstanceSet;
const bcrypt = require('bcrypt');

require('../src/models/index');

const Appointment = require('../src/models/Appointment');
const Channel = require('../src/models/Channel');
const Channelable = require('../src/models/Channelable');
const CreatePosition = require('../src/models/CreatePosition');
const DirectMessage = require('../src/models/DirectMessage');
const Event = require('../src/models/Event');
const Group = require('../src/models/Group');
const IndividualVote = require('../src/models/IndividualVote');
const Message = require('../src/models/Message');
const MessageBoard = require('../src/models/MessageBoard');
const Motion = require('../src/models/Motion');
const MotionContext = require('../src/models/MotionContext');
const Position = require('../src/models/Position');
const PositionDefinition = require('../src/models/PositionDefinition');
const Power = require('../src/models/Power');
const RSVP = require('../src/models/RSVP');
const User = require('../src/models/User');
const Vote = require('../src/models/Vote');
const VoteOption = require('../src/models/VoteOption');

async function seedUser() {
    const harry = new Instance(User);
    harry.assign({
        firstName: 'Harry',
        lastName: 'Potter',
        birthDate: new Date('1980-07-31'),
        email: 'harryPotter@hogwarts.edu',
        password: await bcrypt.hash('Flibbertigibbet', 10),
    });

    return harry.save();
}

async function seedUsers() {
    const harry = await seedUser();

    const hermione = new Instance(User);
    hermione.assign({
        firstName: 'Hermione',
        lastName: 'Granger',
        birthDate: new Date('1979-09-19'),
        email: 'hermioneGranger@hogwarts.edu',
        password: await bcrypt.hash('<3krum', 10),
    });

    const ron = new Instance(User);
    ron.assign({
        firstName: 'Ron',
        lastName: 'Weasley',
        birthDate: new Date('1980-03-01'),
        email: 'ronWeasley@hogwarts.edu',
        password: await bcrypt.hash('Dilligrout', 10),
    });

    const albus = new Instance(User);
    albus.assign({
        firstName: 'Albus',
        lastName: 'Dumbledore',
        birthDate: new Date('1881-07-01'),
        email: 'albusDumbledore@hogwarts.edu',
        password: await bcrypt.hash('sherbertLemon', 10),
        admin: true,
    });

    const severus = new Instance(User);
    severus.assign({
        firstName: 'Severus',
        lastName: 'Snape',
        birthDate: new Date('1960-05-02'),
        email: 'severusSnape@hogwarts.edu',
        password: await bcrypt.hash('lillyPotter', 10),
    });

    const draco = new Instance(User);
    draco.assign({
        firstName: 'Draco',
        lastName: 'Malfoy',
        birthDate: new Date('1980-06-05'),
        email: 'dracoMalfoy@hogwarts.edu',
        password: await bcrypt.hash('PotterStinks', 10),
    });

    const luna = new Instance(User);
    luna.assign({
        firstName: 'Luna',
        lastName: 'Lovegood',
        birthDate: new Date('1981-02-13'),
        email: 'lunaLovegood@hogwarts.edu',
        password: await bcrypt.hash('thestral81', 10),
    });

    const neville = new Instance(User);
    neville.assign({
        firstName: 'Neville',
        lastName: 'Longbottom',
        birthDate: new Date('1980-07-30'),
        email: 'nevilleLongbottom@hogwarts.edu',
        password: await bcrypt.hash('lovelyluna', 10),
    });

    const sirius = new Instance(User);
    sirius.assign({
        firstName: 'Sirius',
        lastName: 'Black',
        birthDate: new Date('1959-11-03'),
        email: 'siriusBlack@pheonix.com',
        password: await bcrypt.hash('blackDog', 10),
    });
    
    const users = new InstanceSet(User, [
        harry,
        hermione,
        ron,
        albus,
        severus,
        draco,
        luna,
        neville,
        sirius,
    ]);

    await users.save();

    return users;
}

async function seedPowers() {
    const createGroup = new Instance(Power);
    createGroup.assign({
        name: 'Create Group',
        description: 'Grants the ability to create a sub group.',
    });
    
    const createMotion = new Instance(Power);
    createMotion.assign({
        name: 'Create Motion',
        description: 'Grants the ability to create a Motion.',
    });
    
    const createPosition = new Instance(Power);
    createPosition.assign({
        name: 'Create Position',
        description: 'Grants the ability to create a Create Position Motion.',
    });
    
    const createAppointment = new Instance(Power);
    createAppointment.assign({
        name: 'Create Appointment',
        description: 'Grants the ability to create an Appointment Motion.',
    });
    
    const createEvent = new Instance(Power);
    createEvent.assign({
        name: 'Create Event',
        description: 'Grants the ability to create an Event.',
    });
    
    const votePower = new Instance(Power);
    votePower.assign({
        name: 'Vote',
        description: 'Grants the ability to vote on motions.',
    });

    const powers = new InstanceSet(Power, [
        createGroup,
        createMotion,
        createPosition,
        createAppointment,
        createEvent,
        votePower,
    ]);

    await powers.save();
    return powers;
}

async function seedGroups() {
    const users = await seedUsers();
    const powers = await seedPowers();

    // 3 Groups to be seeded
    const hogwarts = new Instance(Group);
    const orderOfThePheonix = new Instance(Group);
    const quiditchGroup = new Instance(Group);

    // The 3 groups utilize some or all of the following positions
    const member = new Instance(PositionDefinition);
    member.assign({
        title: 'Member',
        description: 'Member of a group.',
        allowedPositions: 0,
    });

    const student = new Instance(PositionDefinition);
    student.assign({
        title: 'Student',
        description: 'Student of Hogwarts school of witchcraft and wizardry.',
        allowedPositions: 0,
        powers: powers.filterToInstanceSet(p => ['Create Event', 'Create Group'].includes(p.name)),
    });

    const professor = new Instance(PositionDefinition);
    professor.assign({
        title: 'Professor',
        description: 'Professor at Hogwarts school of witchcraft and wizardry.',
        allowedPositions: 0,
        powers: powers.filterToInstanceSet(p => ['Create Event', 'Create Group', 'Create Motion', 'Vote'].includes(p.name)),
    });

    const headMaster = new Instance(PositionDefinition);
    headMaster.assign({
        title: 'Headmaster',
        description: 'Headmaster of Hogwarts school of witchcraft and wizardry.',
        allowedPositions: 1,
        powers: powers,
    });

    const quiditchPlayer = new Instance(PositionDefinition);
    quiditchPlayer.assign({
        title: 'Player',
        description: 'Quiditch Player.',
        allowedPositions: 0,
        powers: powers.filterToInstanceSet(p => ['Create Event', 'Create Group', 'Create Motion', 'Vote'].includes(p.name)),
    });

    const quiditchCoach = new Instance(PositionDefinition);
    quiditchCoach.assign({
        title: 'Coach',
        description: 'Quiditch Coach.',
        allowedPositions: 4,
        powers,
    });

    // Hogarts Group Setup
    const hogwartsChannel = new Instance(Channel);
    hogwartsChannel.channelable = hogwarts;
    hogwarts.assign({
        name: 'Hogwarts School of Witchcraft and Wizardry',
        positionDefinitions: new InstanceSet(PositionDefinition, [member, student, professor, headMaster]),
        channel: hogwartsChannel,
    });

    // Order of the Phoneix Group Setup
    const ootpChannel = new Instance(Channel);
    ootpChannel.channelable = orderOfThePheonix;
    orderOfThePheonix.assign({
        name: 'Order of the Pheonix',
        positionDefinitions: new InstanceSet(PositionDefinition, [member]),
        channel: ootpChannel,
    });

    // Quiditch Group Setup
    const quiditchChannel = new Instance(Channel);
    quiditchChannel.channelable = quiditchGroup;
    quiditchGroup.assign({
        name: 'Quiditch Players and Coaches',
        positionDefinitions: new InstanceSet(PositionDefinition, [quiditchPlayer, quiditchCoach]),
        superGroup: hogwarts,
        channel: quiditchChannel,
    });


    // Assign all users to their groups
    // Each user is a "member" for each group plus their special positions
    for (const user of users) {

        // Assign all users to member position of Hogwarts Group
        const hogwartsMember = new Instance(Position);
        hogwartsMember.assign({
            positionDefinition: member,
            user,
            group: hogwarts,
            startDate: new Date(),
        });
        await hogwartsMember.save();

        // Assign student positions to Hogwarts Group
        if (['Ron', 'Hermione', 'Luna', 'Draco', 'Harry', 'Neville'].includes(user.firstName)) {
            const studentPosition = new Instance(Position);
            studentPosition.assign({
                positionDefinition: student,
                user,
                group: hogwarts,
                startDate: new Date('1991-09-12'),
            });
            await studentPosition.save();
        }

        //Assign professor positions to Hogwarts Group
        if (['Severus', 'Albus'].includes(user.firstName)) {
            const professorPosition = new Instance(Position);
            professorPosition.assign({
                positionDefinition: professor,
                user,
                group: hogwarts,
                startDate: new Date('1981-06-15'),
            });
            await professorPosition.save();
        }

        //Assign Headmaster position to Hogwarts Group
        if (['Albus'].includes(user.firstName)) {
            const headMasterPosition = new Instance(Position);
            headMasterPosition.assign({
                positionDefinition: headMaster,
                user,
                group: hogwarts,
                startDate: new Date('1965-06-22'),
            });
            await headMasterPosition.save();
        }

        //Assign member poistions to Order of the Phoenix Group
        if (['Albus', 'Harry', 'Ron', 'Hermione', 'Luna', 'Neville', 'Snape', 'Sirius'].includes(user.firstName)) {
            const memberPosition = new Instance(Position);
            memberPosition.assign({
                positionDefinition: member,
                user,
                group: orderOfThePheonix,
                startDate: new Date('1996-01-01'),
            });
            await memberPosition.save();
        }

        //Assign member positions to Quiditch Group
        if (['Draco', 'Harry', 'Snape'].includes(user.firstName)) {
            const quiditchMember = new Instance(Position);
            quiditchMember.assign({
                positionDefinition: member,
                user,
                group: quiditchMember,
                startDate: new Date(),
            });
            await quiditchMember.save();
        }

        //Assign player positions to Quiditch Group
        if (['Draco', 'Harry', ].includes(user.firstName)) {
            const position = new Instance(Position);
            position.assign({
                positionDefinition: quiditchPlayer,
                user,
                group: quiditchGroup,
                startDate: new Date('1991-11-12'),
            });
            await position.save();
        }

        //Assign coach positions to Quiditch Group
        if (['Severus'].includes(user.firstName)) {
            const position = new Instance(Position);
            position.assign({
                positionDefinition: quiditchCoach,
                user,
                group: quiditchGroup,
                startDate: new Date('1991-11-12'),
            });
            await position.save();
        }

    }

    // Save all 3 groups.
    await hogwarts.save();
    await orderOfThePheonix.save();
    await quiditchGroup.save();

    //save all 3 group channels.
    await hogwartsChannel.save();
    await ootpChannel.save();
    await quiditchChannel.save();

    // Save all groups' positions.
    await student.save();
    await member.save();
    await headMaster.save();
    await professor.save();
    await quiditchPlayer.save();
    await quiditchCoach.save();

    const groups = new InstanceSet(Group, [hogwarts, orderOfThePheonix, quiditchGroup]);
    return groups;

}

async function seedGroupModule() {
    const group = new Instance(Group);
    const positionDefinition = new Instance(PositionDefinition);
    const position = new Instance(Position);
    const channel = new Instance(Channel);
    const positions = new InstanceSet(Position, [position]);
    const positionDefinitions = new InstanceSet(PositionDefinition, [positionDefinition]);
    const users = await seedUsers();
    const user = users.instanceAt(0);

    group.name = 'Standard Seed Group';
    group.description = 'Group Created From SeedDB For Testing';
    group.positions = positions;
    group.positionDefinitions = positionDefinitions;
    group.channel = channel;
  
    positionDefinition.title = 'Standard Seed Position Definition';
    positionDefinition.description = 'Standard Position From SeedDB For Testing';
    positionDefinition.allowedPositions = 0;
    positionDefinition.unique = false;
    positionDefinition.positions = positions;
 
    position.group = group;
    position.positionDefinition = positionDefinition;
    position.user = user;
    position.startDate = new Date();

    user.positions = positions;
    
    channel.channelable = group;

    await group.save();
    await user.save();
    await position.save();
    await positionDefinition.save();
    await channel.save();

    const returnSeed = {
        group,
        position,
        positionDefinition,
        channel,
        user
    };

    return returnSeed;

}

async function clearAll() {
    return Promise.all([
        Appointment.clear(),
        Channel.clear(),
        Channelable.clear(),
        CreatePosition.clear(),
        DirectMessage.clear(),
        Event.clear(),
        Group.clear(),
        IndividualVote.clear(),
        Message.clear(),
        MessageBoard.clear(),
        Motion.clear(),
        MotionContext.clear(),
        Position.clear(),
        PositionDefinition.clear(),
        Power.clear(),
        RSVP.clear(),
        User.clear(),
        Vote.clear(),
        VoteOption.clear(),
    ]);
}


module.exports = {
    seedUser,
    seedGroupModule,
    seed,
    clearAll,
};

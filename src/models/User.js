const noomman = require('noomman');
const ClassModel = noomman.ClassModel;
const PositionDefinition = require('./PositionDefinition');
const InstanceSet = noomman.InstanceSet;



const User = new ClassModel({
    className : 'User',
    attributes : [
        {
            name : 'firstName',
            type : String,
            required : true,
        },
        {
            name : 'lastName',
            type : String,
            required : true,
        },
        {
            name : 'email',
            type : String,
            required : true,
        },
        {
            name : 'password',
            type : String,
            required : true,
        },
        {
            name : 'admin',
            type : String,
            required : false,
        },
        {
            name : 'birthDate',
            type : Date,
            required : true,
        }
    ],
    relationships : [          
        {
            name : 'events',
            toClass : 'Event',
            singular : false,
            required : false,
            mirrorRelationship : 'attendees'
        },
        {
            name : 'appointments',
            toClass : 'Appointment',
            singular : false,
            required : false,
            mirrorRelationship : 'user'
        },
        {
            name : 'positions',
            toClass : 'Position',
            singular : false,
            required : false,
            mirrorRelationship : 'user'
        },
        {
            name : 'messages',
            toClass : 'Message',
            singular : false,
            required : false,
            mirrorRelationship : 'user'
        },
        {
            name : 'directMessages',
            toClass : 'DirectMessage',
            singular : false,
            required : false,
            mirrorRelationship : 'users'
        },
        {
            name : 'token',
            toClass : 'Token',
            singular : true,
            required : false,
            mirrorRelationship : 'user'
        }
    ],
    nonStaticMethods: {
        positionDefinitions,
    }
});

async function positionDefinitions() {
    const positions = await this.positions;
    const positionDefinitions = new InstanceSet(PositionDefinition);

    for (const position of positions) {
        positionDefinitions.add(await position.positionDefinition);
    }

    return positionDefinitions;
}

module.exports = User;
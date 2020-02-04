const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const Position = new ClassModel({
    className : 'Position',
    
    relationships : [
        {
            name : 'positionDefinition',
            toClass : 'PositionDefinition',
            singular : true,
            required : true,
            mirrorRelationship : 'positions'
        },
        {
            name : 'group',
            toClass : 'Group',
            singular : true,
            required : true,
            mirrorRelationship : 'positions'
        },
        {
            name : 'user',
            toClass : 'User',
            singular : true,
            required : true,
            mirrorRelationship : 'positions'
        },
        {
            name : 'individualVotes',
            toClass : 'IndividualVote',
            singular : false,
            required : false,
            mirrorRelationship : 'position'
        },
        {
            name : 'appointments',
            toClass : 'Appointment',
            singular : false,
            required : false,
            mirrorRelationship : 'positions'
        },
        {
            name : 'motion',
            toClass : 'Motion',
            singular : false,
            required : false,
            mirrorRelationship : 'position'
        }
    ]
  
});

module.exports = Position;
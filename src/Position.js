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
            mirrorRelationship : true
        },
        {
            name : 'group',
            toClass : 'Group',
            singular : true,
            required : true,
            mirrorRelationship : true
        },
        {
            name : 'user',
            toClass : 'User',
            singular : true,
            required : true,
            mirrorRelationship : true
        },
        {
            name : 'individualVote',
            toClass : 'IndividualVote',
            singular : false,
            required : false,
            mirrorRelationship : true
        },
        {
            name : 'appointment',
            toClass : 'Appointment',
            singular : false,
            required : false,
            mirrorRelationship : true
        },
        {
            name : 'motion',
            toClass : 'Motion',
            singular : false,
            required : false,
            mirrorRelationship : true
        }
    ]
  
});

module.exports = Position;
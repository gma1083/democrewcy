const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const Position = new ClassModel({
    className : 'Position',
    attributes : [
        {
            name : 'startDate',
            type : Date,
            required : true,
        },
        {
            name : 'endDate',
            type : Date,
            required : false,
        },
    ],
    
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
            name : 'appointment',
            toClass : 'Appointment',
            singular : true,
            required : false,
            mirrorRelationship : 'createsPosition'
        },
        {
            name : 'motion',
            toClass : 'Motion',
            singular : false,
            required : false,
            mirrorRelationship : 'proposedBy'
        }
    ]
  
});

module.exports = Position;
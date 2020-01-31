const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const Position = new ClassModel({
    className : 'Position',
    
    relationships : [
        {
            name : 'positionDefinition',
            toClass : 'PositionDefinition',
            singular : true,
            required : true
        },
        {
            name : 'group',
            toClass : 'Group',
            singular : true,
            required : true
        },
        {
            name : 'user',
            toClass : 'User',
            singular : true,
            required : true
        },
        {
            name : 'individualVote',
            toClass : 'IndividualVote',
            singular : false,
            required : false
        },
        {
            name : 'appointment',
            toClass : 'Appointment',
            singular : false,
            required : false
        },
        {
            name : 'motion',
            toClass : 'Motion',
            singular : false,
            required : false
        }
    ]
  
});

module.exports = Position;
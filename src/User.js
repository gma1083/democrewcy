const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

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
            name : 'birthDate',
            type : Date,
            required : true,
        }
    ],
    relationships : [          
        {
            name : 'account',
            toClass : 'Account',
            singular : true,
            required : true,
            mirrorRelationship : true
        },
        {
            name : 'events',
            toClass : 'Event',
            singular : false,
            required : false,
            mirrorRelationship : true
        },
        {
            name : 'appointments',
            toClass : 'Appointment',
            singular : false,
            required : false,
            mirrorRelationship : true
        },
        {
            name : 'positions',
            toClass : 'Position',
            singular : false,
            required : false,
            mirrorRelationship : true
        },
        {
            name : 'messages',
            toClass : 'Message',
            singular : false,
            required : false,
            mirrorRelationship : true
        },
        {
            name : 'messageBoards',
            toClass : 'MessageBoard',
            singular : false,
            required : false,
            mirrorRelationship : true
        }
    ]
  
});

module.exports = User;
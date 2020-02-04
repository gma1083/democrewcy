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
            mirrorRelationship : 'user'
        },
        {
            name : 'events',
            toClass : 'Event',
            singular : false,
            required : false,
            mirrorRelationship : 'users'
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
            name : 'messageBoards',
            toClass : 'MessageBoard',
            singular : false,
            required : false,
            mirrorRelationship : 'users'
        }
    ]
  
});

module.exports = User;
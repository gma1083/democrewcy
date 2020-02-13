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
            name : 'messageBoards',
            toClass : 'MessageBoard',
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
    ]
  
});

module.exports = User;
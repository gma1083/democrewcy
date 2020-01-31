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
            required : true
        },
        {
            name : 'event',
            toClass : 'Event',
            singular : false,
            required : false
        },
        {
            name : 'appointment',
            toClass : 'Appointment',
            singular : true,
            required : false
        },
        {
            name : 'position',
            toClass : 'Position',
            singular : false,
            required : false
        },
        {
            name : 'message',
            toClass : 'Message',
            singular : false,
            required : false
        },
        {
            name : 'messageBoard',
            toClass : 'MessageBoard',
            singular : false,
            required : false
        }
    ]
  
});

module.exports = User;
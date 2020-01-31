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
        }
    ]
  
});

module.exports = User;
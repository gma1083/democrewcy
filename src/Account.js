const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const Account = new ClassModel({
    className : 'Account',
    attributes : [
        {
            name : 'email',
            type : String,
            required : true,
        },
        {
            name : 'password',
            type : String,
            required : true,
        }
    ],
    relationships : [
        {
            name : 'user',
            toClass : 'User',
            singular : true,
            required : true,
            mirrorRelationship : true
        },
        {
            name : 'token',
            toClass : 'token',
            singular : true,
            required : true,
            mirrorRelationship : true
        }
    ]
  
});

module.exports = Account;
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
            mirrorRelationship : 'User'
        },
        {
            name : 'token',
            toClass : 'Token',
            singular : true,
            required : true,
            mirrorRelationship : 'Token'
        }
    ]
  
});

module.exports = Account;
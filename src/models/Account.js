const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const Account = new ClassModel({
    className : 'Account',
    attributes : [
        {
            name : 'email',
            type : String,
            required : true,
            unique : true
        },
        {
            name : 'password',
            type : String,
            required : true,
        },
        {
            name : 'admin',
            type : Boolean,
            required : false,
        }
    ],
    relationships : [
        {
            name : 'user',
            toClass : 'User',
            singular : true,
            required : true,
            mirrorRelationship : 'account'
        },
        {
            name : 'token',
            toClass : 'Token',
            singular : true,
            required : false,
            mirrorRelationship : 'account'
        }
    ]
  
});

module.exports = Account;
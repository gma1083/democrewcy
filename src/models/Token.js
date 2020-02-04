const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const Token = new ClassModel({
    className : 'Token',
    attributes : [
        {
            name : 'createdAt',
            type : Date,
            required : true,
        },
        {
            name : 'expires',
            type : Date,
            required : true,
        },
        {
            name : 'token',
            type : String,
            required : true,
        }
    ],
    relationships : [
        {
            name : 'account',
            toClass : 'Account',
            singular : true,
            required : false,
            mirrorRelationship : 'token'
        }
    ]
  
});

module.exports = Token;
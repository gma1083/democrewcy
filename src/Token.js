const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const Token = new ClassModel({
    className : 'Token',
    attributes : [
        {
            name : 'createdAt',
            type : Type,
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
            name : 'user',
            toClass : 'User',
            singular : true,
            required : true
        }
    ]
  
});

module.exports = Class;
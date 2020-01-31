const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const MessageBoard = new ClassModel({
    className : 'MessageBoard',
    attributes : [
        {
            name : 'name',
            type : String,
            required : false,
        },
        {
            name : 'description',
            type : String,
            required : false,
        }
    ],
    relationships : [
        {
            name : 'users',
            toClass : 'User',
            singular : false,
            required : true,
            mirrorRelationship : true
        },
        {
            name : 'messages',
            toClass : 'Message',
            singular : false,
            required : false,
            mirrorRelationship : true
        }
    ]
  
});

module.exports = MessageBoard;
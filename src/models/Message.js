const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const Message = new ClassModel({
    className : 'Message',
    attributes : [
        {
            name : 'body',
            type : String,
            required : false,
        },
        {
            name : 'sentAt',
            type : Date,
            required : true,
        }
    ],
    relationships : [
        {
            name : 'user',
            toClass : 'User',
            singular : true,
            required : true,
            mirrorRelationship : 'messages'
        },
        {
            name : 'messageBoard',
            toClass : 'messageBoard',
            singular : true,
            required : true,
            mirrorRelationship : 'messages'
        },
        {
            name : 'externalLink',
            toClass : 'externalLink',
            singular : false,
            required : false,
            mirrorRelationship : 'messages'
        }
    ]
  
});

module.exports = Message;
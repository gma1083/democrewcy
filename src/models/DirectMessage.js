const noomman = require('noomman');
const ClassModel = noomman.ClassModel;
const MessageBoard = require('./MessageBoard');

const DirectMessage = new ClassModel({
    className : 'DirectMessage',
    superClasses : [MessageBoard],
    
    relationships : [
        {
            name : 'users',
            toClass : 'User',
            singular : false,
            required : true,
            mirrorRelationship : 'directMessages'
        }
    ]
  
});

module.exports = DirectMessage;
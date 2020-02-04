const noomman = require('noomman');
const ClassModel = noomman.ClassModel;
const MessageBoard = require('./MessageBoard');

const Channel = new ClassModel({
    className : 'Channel',
    superClasses : [MessageBoard],
    
    relationships : [
        {
            name : 'channelable',
            toClass : 'Channelable',
            singular : true,
            required : true,
            mirrorRelationship : 'channel'
        }
    ]
  
});

module.exports = Channel;
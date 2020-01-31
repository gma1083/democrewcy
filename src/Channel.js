const noomman = require('noomman');
const ClassModel = noomman.ClassModel;
const MessageBoard = require('./MessageBoard');

const Channel = new ClassModel({
    className : 'Channel',
    superClasses : [MessageBoard],
    attributes : [
        {
            name : 'name',
            type : String,
            required : true,
        },
        {
            name : 'description',
            type : String,
            required : false,
        }
    ],
    relationships : [
        {
            name : 'channelable',
            toClass : 'Channelable',
            singular : true,
            required : true,
            mirrorRelationship : true
        }
    ]
  
});

module.exports = Channel;
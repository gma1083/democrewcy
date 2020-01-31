const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const Channelable = new ClassModel({
    className : 'Channelable',
   
    relationships : [
        {
            name : 'channel',
            toClass : 'Channel',
            singular : true,
            required : true,
            mirrorRelationship : true
        }
    ]
  
});

module.exports = Channelable;
const noomman = require('noomman');
const ClassModel = noomman.ClassModel;
const Channelable = require('./Channelable');

const Event = new ClassModel({
    className : 'Event',
    superClasses : [Channelable],
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
            name : 'attendees',
            toClass : 'User',
            singular : false,
            required : true,
            mirrorRelationship : true
        },
        {
            name : 'motions',
            toClass : 'Motion',
            singular : false,
            required : false,
            mirrorRelationship : true
        }
    ]
  
});

module.exports = Event;
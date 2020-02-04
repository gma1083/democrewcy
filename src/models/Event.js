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
        },
        {
            name : 'startTime',
            type : Date,
            required : true,
        },
        {
            name : 'endTime',
            type : Date,
            required : true,
        }
    ],
    relationships : [
        {
            name : 'attendees',
            toClass : 'User',
            singular : false,
            required : true,
            mirrorRelationship : 'events'
        },
        {
            name : 'motions',
            toClass : 'Motion',
            singular : false,
            required : false,
            mirrorRelationship : 'event'
        }
    ]
  
});

module.exports = Event;
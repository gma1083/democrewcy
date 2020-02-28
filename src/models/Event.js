const noomman = require('noomman');
const ClassModel = noomman.ClassModel;
const Channelable = require('./Channelable');
const MotionContext = require('./MotionContext');

const Event = new ClassModel({
    className : 'Event',
    superClasses : [Channelable, MotionContext],
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
            name : 'group',
            toClass : 'Group',
            singular : true,
            required : true,
            mirrorRelationship : 'events'
        },
        {
            name : 'rsvps',
            toClass : 'RSVP',
            singular : false,
            required : false,
            mirrorRelationship : 'event'
        },
    ]
  
});

module.exports = Event;
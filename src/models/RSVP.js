const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const RSVP = new ClassModel({
    className : 'RSVP',
    attributes : [
        {
            name : 'date',
            type : Date,
            required : true,
        },
    ],
    relationships : [
        {
            name : 'event',
            toClass : 'Event',
            singular : true,
            required : true,
            mirrorRelationship : 'rsvps'
        },
        {
            name : 'user',
            toClass : 'User',
            singular : true,
            required : true,
            mirrorRelationship : 'rsvps'
        },
    ]
  
});

module.exports = RSVP;
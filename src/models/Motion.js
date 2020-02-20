const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const Motion = new ClassModel({
    className : 'Motion',

    attributes : [
        {
            name : 'title',
            type : String,
            required : true
        },
        {
            name : 'description',
            type : String,
            required : true
        }
    ],
    
    relationships : [
        {
            name : 'position',
            toClass : 'Position',
            singular : true,
            required : true,
            mirrorRelationship : 'motion'
        },
        {
            name : 'group',
            toClass : 'Group',
            singular : true,
            required : true,
            mirrorRelationship : 'motion'
        },
        {
            name : 'proposedBy',
            toClass : 'Position',
            singular : true,
            required : true,
            mirrorRelationship : 'motion'
        },
        {
            name : 'vote',
            toClass : 'Vote',
            singular : true,
            required : true,
            mirrorRelationship : 'motion'
        },
        {
            name : 'event',
            toClass : 'Event',
            singular : false,
            required : false,
            mirrorRelationship : 'motion'
        },
        {
            name : 'previousMotion',
            toClass : 'Motion',
            singular : true,
            required : false,
            mirrorRelationship : 'nextMotion'
        },
        {
            name : 'nextMotion',
            toClass : 'Motion',
            singular : true,
            required : false,
            mirrorRelationship : 'previousMotion'
        }
    ]
  
});

module.exports = Motion;
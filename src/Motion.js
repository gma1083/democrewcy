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
            name : 'group',
            toClass : 'Group',
            singular : true,
            required : true,
            mirrorRelationship : true
        },
        {
            name : 'position',
            toClass : 'Position',
            singular : true,
            required : true,
            mirrorRelationship : true
        },
        {
            name : 'vote',
            toClass : 'Vote',
            singular : true,
            required : true,
            mirrorRelationship : true
        },
        {
            name : 'event',
            toClass : 'Event',
            singular : false,
            required : false,
            mirrorRelationship : true
        },
        {
            name : 'previousMotion',
            toClass : 'Motion',
            singular : false,
            required : false,
            mirrorRelationship : true
        },
        {
            name : 'nextMotion',
            toClass : 'Motion',
            singular : false,
            required : false,
            mirrorRelationship : true
        }
    ]
  
});

module.exports = Motion;
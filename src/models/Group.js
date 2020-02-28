const noomman = require('noomman');
const ClassModel = noomman.ClassModel;
const Channelable = require('./Channelable');
const MotionContext = require('./MotionContext');

const Group = new ClassModel({
    className : 'Group',
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
        }
    ],
    relationships : [
        {
            name : 'events',
            toClass : 'Event',
            singular : false,
            required : false,
            mirrorRelationship: 'group'
        },
        {
            name : 'positionDefinitions',
            toClass : 'PositionDefinition',
            singular : false,
            required : true
        },
        {
            name : 'positions',
            toClass : 'Position',
            singular : false,
            required : true,
            mirrorRelationship : 'group'
        },
        {
            name : 'subGroups',
            toClass : 'Group',
            singular : false,
            required : false,
            mirrorRelationship : 'superGroup'
        },
        {
            name : 'superGroup',
            toClass : 'Group',
            singular : true,
            required : false,
            mirrorRelationship : 'subGroups'
        }
    ]
  
});

module.exports = Group;
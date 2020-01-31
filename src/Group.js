const noomman = require('noomman');
const ClassModel = noomman.ClassModel;
const Channelable = require('./Channelable');

const Group = new ClassModel({
    className : 'Group',
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
            name : 'positionDefinitions',
            toClass : 'PositionDefinition',
            singular : false,
            required : false,
            mirrorRelationship : true
        },
        {
            name : 'positions',
            toClass : 'Position',
            singular : false,
            required : false,
            mirrorRelationship : true
        },
        {
            name : 'motions',
            toClass : 'Motion',
            singular : false,
            required : false,
            mirrorRelationship : true
        },
        {
            name : 'subGroups',
            toClass : 'Group',
            singular : true,
            required : false,
            mirrorRelationship : true
        },
        {
            name : 'superGroup',
            toClass : 'Group',
            singular : true,
            required : false,
            mirrorRelationship : true
        }
    ]
  
});

module.exports = Group;
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
            mirrorRelationship : 'group'
        },
        {
            name : 'positions',
            toClass : 'Position',
            singular : false,
            required : false,
            mirrorRelationship : 'group'
        },
        {
            name : 'motions',
            toClass : 'Motion',
            singular : false,
            required : false,
            mirrorRelationship : 'group'
        },
        {
            name : 'subGroups',
            toClass : 'Group',
            singular : true,
            required : false,
            mirrorRelationship : 'superGroup'
        },
        {
            name : 'superGroup',
            toClass : 'Group',
            singular : true,
            required : false,
            mirrorRelationship : 'subGroup'
        }
    ]
  
});

module.exports = Group;
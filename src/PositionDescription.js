const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const PositionDefinition = new ClassModel({
    className : 'PositionDefinition',
    attributes : [
        {
            name : 'title',
            type : String,
            required : true,
        },
        {
            name : 'description',
            type : String,
            required : true,
        },
        {
            name : 'unique',
            type : Boolean,
            required : true,
        }
    ],
    relationships : [
        {
            name : 'position',
            toClass : 'Position',
            singular : false,
            required : true,
            mirrorRelationship : true
        },
        {
            name : 'createPosition',
            toClass : 'CreatePosition',
            singular : true,
            required : true,
            mirrorRelationship : true
        },
        {
            name : 'group',
            toClass : 'Group',
            singular : true,
            required : true,
            mirrorRelationship : true
        }
    ]
  
});

module.exports = PositionDescription;
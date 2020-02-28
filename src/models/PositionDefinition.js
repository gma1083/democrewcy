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
            name : 'allowedPositions',
            type : Number,
            required : true,
        }
    ],
    relationships : [
        {
            name : 'createPosition',
            toClass : 'CreatePosition',
            singular : true,
            required : false,
            mirrorRelationship : 'positionDefinition'
        },
        {
            name: 'powers',
            toClass: 'Power',
            singular: false,
            required: false,
        },
    ]
  
});

module.exports = PositionDefinition;
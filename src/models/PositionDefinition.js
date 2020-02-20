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
            name : 'positions',
            toClass : 'Position',
            singular : false,
            required : false,
            mirrorRelationship : 'positionDefinition'
        },
        {
            name : 'createPosition',
            toClass : 'CreatePosition',
            singular : true,
            required : false,
            mirrorRelationship : 'positionDefinition'
        },
        {
            name : 'appointments',
            toClass : 'Appointment',
            singular : false,
            required : false,
            mirrorRelationship : 'positionDefinition'
        }
    ]
  
});

module.exports = PositionDefinition;
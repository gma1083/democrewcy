const noomman = require('noomman');
const ClassModel = noomman.ClassModel;
const Motion = require('./Motion');

const CreatePosition = new ClassModel({
    className : 'CreatePosition',
    superClasses : [Motion],
    
    relationships : [
        {
            name : 'positionDefinition',
            toClass : 'PositionDefinition',
            singular : true,
            required : true,
            mirrorRelationship : true
        }
    ]
  
});

module.exports = CreatePosition;
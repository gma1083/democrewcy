const noomman = require('noomman');
const ClassModel = noomman.ClassModel;
const Motion = require('./Motion');

const Appointment = new ClassModel({
    className : 'Appointment',
    superClasses : [Motion],
    
    relationships : [
        {
            name : 'createsPosition',
            toClass : 'Position',
            singular : true,
            required : false,
            mirrorRelationship : true
        },
        {
            name : 'user',
            toClass : 'User',
            singular : true,
            required : true,
            mirrorRelationship : true
        },
        {
            name : 'positionDefinition',
            toClass : 'PositionDefinition',
            singular : true,
            required : true,
            mirrorRelationship : true
        }
    ]
  
});

module.exports = Appointment;
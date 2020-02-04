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
            mirrorRelationship : 'appointments'
        },
        {
            name : 'user',
            toClass : 'User',
            singular : true,
            required : true,
            mirrorRelationship : 'appointments'
        },
        {
            name : 'positionDefinition',
            toClass : 'PositionDefinition',
            singular : true,
            required : true,
            mirrorRelationship : 'appointments'
        },
        {
            name : 'positions',
            toClass : 'Position',
            singular : false,
            required : false,
            mirrorRelationship : 'appointments'
        }

    ]
  
});

module.exports = Appointment;
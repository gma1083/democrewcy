const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const MotionContext = new ClassModel({
    className : 'MotionContext',
    relationships : [
        {
            name : 'motions',
            toClass : 'Motion',
            singular : false,
            required : false,
            mirrorRelationship : 'motionContext'
        },
    ],  
});

module.exports = MotionContext;
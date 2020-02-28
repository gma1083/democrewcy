const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const Power = new ClassModel({
    className : 'Power',
    attributes : [
        {
            name : 'name',
            type : String,
            required : true,
        },
        {
            name : 'description',
            type : String,
            required : true,
        },
    ],
});

module.exports = Power;
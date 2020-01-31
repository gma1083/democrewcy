const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const VoteOption = new ClassModel({
    className : 'VoteOption',
    
    attributes : [
        {
            name : 'name',
            type : String,
            required : true
        }, 
        {
            name : 'value',
            type : Number,
            required : true
        }
    ]
  
});

module.exports = VoteOption;
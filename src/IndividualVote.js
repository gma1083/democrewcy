const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const IndividualVote = new ClassModel({
    className : 'IndividualVote',
    
    relationships : [
        {
            name : 'position',
            toClass : 'Position',
            singular : true,
            required : true,
            mirrorRelationship : true
        },
        {
            name : 'vote',
            toClass : 'Vote',
            singular : true,
            required : true,
            mirrorRelationship : true
        },
        {
            name : 'voteOption',
            toClass : 'voteOption',
            singular : true,
            required : true
        },
        
    ]
  
});

module.exports = IndividualVote;
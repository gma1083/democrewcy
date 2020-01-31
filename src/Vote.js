const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const Vote = new ClassModel({
    className : 'Vote',
    
    relationships : [
        {
            name : 'individualVote',
            toClass : 'IndividualVote',
            singular : false,
            required : true,
            mirrorRelationship : true
        },
        {
            name : 'allowedVoteoptions',
            toClass : 'VoteOptions',
            singular : false,
            required : true
        },
        {
            name : 'motion',
            toClass : 'Motion',
            singular : true,
            required : true,
            mirrorRelationship : true
        }
    ]
  
});

module.exports = Vote;
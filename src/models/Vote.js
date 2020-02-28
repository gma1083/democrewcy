const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const Vote = new ClassModel({
    className : 'Vote',
    
    relationships : [
        {
            name : 'individualVotes',
            toClass : 'IndividualVote',
            singular : false,
            required : false,
            mirrorRelationship : 'vote'
        },
        {
            name : 'allowedVoteOptions',
            toClass : 'VoteOption',
            singular : false,
            required : true
        },
        {
            name : 'motion',
            toClass : 'Motion',
            singular : true,
            required : true,
            mirrorRelationship : 'vote'
        },
    ]
  
});

module.exports = Vote;
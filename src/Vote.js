const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const Vote = new ClassModel({
    className : 'Vote',
    
    relationships : [
        {
            name : 'individualVote',
            toClass : 'IndividualVote',
            singular : false,
            required : true
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
            required : true
        }
    ]
  
});

module.exports = Vote;
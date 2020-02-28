const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const Message = new ClassModel({
    className : 'Message',
    attributes : [
        {
            name : 'body',
            type : String,
            required : true,
        },
        {
            name : 'sentAt',
            type : Date,
            required : true,
        }
    ],
    relationships : [
        {
            name : 'user',
            toClass : 'User',
            singular : true,
            required : true,
            mirrorRelationship : 'messages'
        },
        {
            name : 'messageBoard',
            toClass : 'MessageBoard',
            singular : true,
            required : true,
            mirrorRelationship : 'messages'
        }
    ],
    crudControls: {
        createControl: requesterMatchesUser,
        updateControl: requesterMatchesUser,
        deleteControl: requesterMatchesUser,
    }
  
});

async function requesterMatchesUser(loggedInUser) {
    if((await this.user).id === loggedInUser.id) return true;
    else return false;
}

module.exports = Message;
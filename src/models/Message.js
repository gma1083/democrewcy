const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const Message = new ClassModel({
    className : 'Message',
    attributes : [
        {
            name : 'body',
            type : String,
            required : false,
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
        }//,
        // {
        //     name : 'externalLink',
        //     toClass : 'ExternalLink',
        //     singular : false,
        //     required : false,
        //     mirrorRelationship : 'messages'
        // }
    ],
    crudControls: {
        createControl: requesterMatchesUser,
        //readControl: requesterMatchesGroupUser,
        updateControl: requesterMatchesUser,
        deleteControl: requesterMatchesUser,
    }
  
});

async function requesterMatchesUser(loggedInUser) {
    if((await this.user).id === loggedInUser.id) return true;
    else return false;
}

// async function requesterMatchesGroupUser(loggedInUser) {
//     if((await (await this.messageBoard).users).hasInstanceWithId(loggedInUser._id)) return true;
//     else return false;
// }

module.exports = Message;
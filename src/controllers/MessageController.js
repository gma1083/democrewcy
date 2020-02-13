const Noomman = require('noomman');
const User = require('../models/User');
const Message = require('../models/Message');
const MessageBoard = require('../models/MessageBoard');
const Instance = Noomman.Instance;

async function createMessage(messageData, activeAccount) {
   if((await activeAccount.user).id !== messageData.user) throw new Error('Imposter Alert!');

    if(!messageData) throw new Error('Message Body Is Null Or Undefinied');
    const body = messageData.body;
    const sentAt = new Date(messageData.sentAt);
    const messageBoardId = messageData.messageBoard;
    const userId = messageData.user;

    const message = new Instance(Message);
    message.body = body;
    message.sentAt = sentAt;
    
    const user = await User.findById(Noomman.ObjectId(userId));
    const messageBoard = await MessageBoard.findById(Noomman.ObjectId(messageBoardId));
    
    message.user = user;
    message.messageBoard = messageBoard;

    await message.save();
    return message;
}

module.exports = {
    createMessage,
}


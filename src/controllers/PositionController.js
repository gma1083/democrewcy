const Noomman = require('noomman');
const User = require('../models/User');
const MiraController = require('./MiraController');

const InstanceSet = Noomman.InstanceSet;

async function getPositions(data) {
    if(!data) throw new Error('getPositions() requires a data object paramter with user Id');
    const user = await User.findById(data.user);
    if(!user) throw new Error('User Not Found');

    const response = [];

    const positions = await user.positions;

    for(const position of positions) {
        response.push(await MiraController.formatInstanceForGetRequest(position));
    }

    return response;
}

module.exports = {
    getPositions,
}
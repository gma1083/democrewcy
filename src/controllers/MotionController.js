const Noomman = require('noomman');
const User = require('../models/User');
const MiraController = require('./MiraController');

async function getMotions(data) {
    if(!data) throw new Error('getMotions() requires a data object paramter with user Id');
    const user = await User.findById(data.user);
    if(!user) throw new Error('User Not Found');

    const response = [];

    const motions = [];

    const positions = await user.positions;
    for(position of positions) {
        const positionMotions = await position.motions;
        for(positionMotion of positionMotions) {
            motions.push(positionMotion);
        }
    }

    console.log(positions);

    for(const motion of motions) {
        response.push(await MiraController.formatInstanceForGetRequest(motion));
    }

    return response;
}

module.exports = {
    getMotions,
}
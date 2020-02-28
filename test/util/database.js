const noomman = require('noomman');
const config = require('../../config.json');

async function connect() {
    return noomman.connect(config.databaseURI, config.unitTestDatabase)
}

async function close() {
    return noomman.close();
}

module.exports = {
    connect,
    close,
};
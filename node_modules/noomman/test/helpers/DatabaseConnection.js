const mongo_uri = "mongodb+srv://cody_jones:cody_jones@publicsquaredev-d3ue6.gcp.mongodb.net/test?retryWrites=true";
const testDatabase = 'noomman-test';
const noomman = require('../../noomman');

async function connect() {
    return noomman.connect(mongo_uri, testDatabase);
}

async function close() {
    return noomman.close();
}

module.exports = {
    mongo_uri,
    testDatabase,
    connect, 
    close,
}
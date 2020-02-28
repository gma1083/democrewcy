const seed = require('./seedDB');
const noomman = require('noomman');
const config = require('../config.json');

noomman.connect(config.databaseURI, config.frontEndTestDatabase)
    .then(() => {
        console.log('Connected....');
        seed.clearAll().then(() => {
            console.log('Cleared');
            seed.seedGroupModule().then(() => {
                console.log('Seeded');
                noomman.close().then(() => {
                    console.log('Done');
                });
            });
        });
    })
    .catch((error) => console.log('Connection Failed: ' + error.message));
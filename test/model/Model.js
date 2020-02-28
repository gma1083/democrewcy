const noomman = require('noomman');
const database = require('../util/database');


require('../../src/models/index');

describe('Model Integrity Tests', () => {

    before(async () => {
        await database.connect();
    });

    after(async () => {
        await database.close();
    });

    it('ClassModel.finalize()', async () => {
        await noomman.ClassModel.finalize();
    });
    
});
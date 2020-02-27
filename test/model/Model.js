const noomman = require('noomman');


require('../../src/models/index');

describe('Model Integrity Tests', () => {

    it('ClassModel.finalize()', async () => {
        await noomman.ClassModel.finalize();
    });
    
});
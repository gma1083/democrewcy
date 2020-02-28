const Router = require('koa-router');
const UserController = require('../controllers/UserController');
const GroupController = require('../controllers/GroupController');
const noomman = require('noomman');
const NoommanValidationError = noomman.NoommanErrors.NoommanValidationError;

const MiraController = require('../controllers/MiraController');

const router = new Router();

router.post('/getChannels', notImplemented);

router.post('/getDirectMessages', notImplemented);

router.post('/getMotions', notImplemented);

router.post('/getPositions', notImplemented);

router.post('/getSubGroups', async (ctx) => {
    try {
        const result = await GroupController.getSubGroups(ctx.request.body);
        ctx.status = 200;
        ctx.body = JSON.stringify(result);
    }
    catch(error) {
        ctx.status = 400;
        ctx.body = {
            message : error.message
        }
    }
});

router.post('/getTopLevelGroups', notImplemented);

router.post('/voteOnMotion', notImplemented);

router.post('/createAppointmentMotion', putRoute);

router.post('/createDirectMessage', putRoute);

router.post('/createEvent', putRoute);

router.post('/createMessage', putRoute);

router.post('/createMotion', putRoute);

router.post('/createPositionMotion', putRoute);

router.post('/createRSVP', putRoute);

router.post('/createSubGroup', putRoute);

router.post('/voteOnMotion', putRoute);

async function putRoute(ctx) {
    try {
        const result = await MiraController.put(ctx.request.body);
        ctx.status = 200;
        ctx.body = JSON.stringify(result);
    }
    catch(error) {
        ctx.status = 400;
        ctx.body = {
            message : error.message
        }
    }
}

async function notImplemented(ctx) {
    ctx.status = 500;
    ctx.body = {
        message : 'Not yet implemented.'
    }
}

module.exports = router;
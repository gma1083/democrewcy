const Router = require('koa-router');
const UserController = require('../controllers/UserController');
const GroupController = require('../controllers/GroupController');
const ChannelController = require('../controllers/ChannelController');
const DirectMessageController = require('../controllers/DirectMessageController');
const MotionController = require('../controllers/MotionController');
const noomman = require('noomman');
const NoommanValidationError = noomman.NoommanErrors.NoommanValidationError;

const MiraController = require('../controllers/MiraController');

const router = new Router();

router.post('/getChannels', async (ctx) => {
    try {
        const result = await ChannelController.getChannels(ctx.request.body);
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

router.post('/getDirectMessages', async (ctx) => {
    try {
        const result = await DirectMessageController.getDirectMessages(ctx.request.body);
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

router.post('/getMotions', async (ctx) => {
    try {
        const result = await Motion.getMotions(ctx.request.body);
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
        const document = result[0];
        const classModel = noomman.ClassModel.getClassModel(document.className);
        const instance = await classModel.findById(document.id);
        const response = {
            className: instance.classModel.className,
            id: instance.id,
            displayAs: instance.displayAs ? instance.displayAs() : instance.classModel.className + ': ' + instance.id
        }
        ctx.body = JSON.stringify(response);
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
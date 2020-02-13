const Router = require('koa-router');
const passport = require('koa-passport');
const AccountController = require('../controllers/AccountController');

const router = new Router();

router.post('/createAccount', async (ctx) => {
    try {
        await AccountController.createAccount(ctx.request.body);
        ctx.status = 200;
        ctx.body = {
            message : 'Account Created!'
        }
    }
    catch(error) {
        ctx.status = 400;
        ctx.body = {
            message : error.message
        }
    }
});


module.exports = router;
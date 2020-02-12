const Router = require('koa-router');
const passport = require('koa-passport');
const loginController = require('../controllers/loginController');

const router = new Router();

router.post('/auth/login', async (ctx) => {
    return passport.authenticate('local', (err, account, info, status) => {
        if (account) {
            ctx.login(account);
            ctx.body = { 
                message : 'Logged In with Account ID: ',
                accountId : account.id
            };
        } 
        else {
            ctx.status = 400;
            ctx.body = { 
                message : 'Route error' 
            };
        }
    })(ctx);
});

router.post('/auth/claimAccount', async (ctx) => {
    try {
        await loginController.claimAccount(ctx.request.body);
        ctx.status = 200;
        ctx.body = {
            message : 'Account Claimed!'
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
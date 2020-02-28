const Router = require('koa-router');
const passport = require('koa-passport');
const loginController = require('../controllers/LoginController');

const router = new Router();

router.post('/auth/login', async (ctx) => {
    return passport.authenticate('local', (err, user, info, status) => {
        if (user) {
            ctx.login(user);
            ctx.body = { 
                message : 'Logged In with Account ID: ',
                id : user.id
            };
        } 
        else {
            ctx.status = 400;
            ctx.body = { 
                message : 'Incorrect email or password' 
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
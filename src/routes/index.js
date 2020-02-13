const Router = require('koa-router');
const passport = require('koa-passport');
const UserController = require('../controllers/UserController');

const router = new Router();

router.post('/createAccount', async (ctx) => {

    if(ctx.state.user.admin) {
        try {
            await UserController.createUser(ctx.request.body);
            ctx.status = 200;
            ctx.body = {
                message : 'User Created!'
            }
        }
        catch(error) {
            ctx.status = 400;
            ctx.body = {
                message : error.message
            }
        }

    }
    else {
        ctx.status = 401;
        ctx.body = {
            message : "You are not allowed to do that you pleabean"
        }
    }
   
});


module.exports = router;
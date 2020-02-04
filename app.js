const Koa = require('koa');
const bodyParser = require('koa-body');
const logger = require('koa-logger');
const session = require('koa-session');
const passport = require('koa-passport');
const cors = require('koa-cors');
const Noomman = require('noomman');

require('./src/models/index');

Noomman.connect('mongodb+srv://GregArnheiter:GregArnheiter@cluster0-rqft7.gcp.mongodb.net/test?retryWrites=true&w=majority', "democrewcy_test")
    .then(() => console.log('Connected....'))
    .catch((error) => console.log('Connection Failed: ' + error.message));

const app = new Koa();

// Body Parser
app.use(bodyParser());

app.use(logger());
app.use(cors());

// Sessions
app.keys = ['super-secret-key'];
app.use(session(app));

// Authentication
require('./src/passport/auth');
app.use(passport.initialize());
app.use(passport.session());


const indexRoutes = require('./src/routes/routes');
const miraRoutes = require('./src/routes/mira');

// Routes
app.use(indexRoutes.routes());
app.use(miraRoutes.routes());
app.use(indexRoutes.allowedMethods);

app.use(async (ctx, next) => {
    try {
        await next();
    }
    catch(err) {
        ctx.status = err.status || 500;
        ctx.body = err.message;
        ctx.app.emit('error', err, ctx);
    }
});

app.listen(8000);




const Koa = require('koa');
const bodyParser = require('koa-body');
const logger = require('koa-logger');
const session = require('koa-session');
const cors = require('kcors');

const Noomman = require('noomman');


require('./src/models/index');

const config = require('./config.json');

Noomman.connect(config.databaseURI, config.frontEndTestDatabase)
    .then(() => console.log('Connected....'))
    .catch((error) => console.log('Connection Failed: ' + error.message));

const app = new Koa();

// Body Parser
app.use(bodyParser());

app.use(logger());
app.use(cors({credentials: true}));

// sessions
app.keys = [config.secretKey];
app.use(session(app));

// Authentication
const passport = require('./src/passport/passport');

app.use(passport.initialize());
app.use(passport.session());

// Protect Routes
async function protectRoutes(ctx, next) {
    if(ctx.req.url.includes('mira') && !ctx.isAuthenticated()) {
        ctx.status = 401;
        ctx.body =  {
            message : "Get outta here"
        }
    }
    else await next();
}

const indexRoutes = require('./src/routes/login');
const miraRoutes = require('./src/routes/mira');
const gregsRoutes = require('./src/routes/index');
const protectedRoutes = require('./src/routes/protected');

// Routes
app.use(protectRoutes);
app.use(indexRoutes.routes());
app.use(miraRoutes.routes());
app.use(gregsRoutes.routes());
app.use(protectedRoutes.routes());
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
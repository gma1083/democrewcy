const Koa = require('koa');
const bodyParser = require('koa-body')();
const logger = require('koa-logger')();
const routes = require('./routes');
const cors = require('koa-cors');
const Noomman = require('noomman');
//const index = require('./src/index.js');

const app = new Koa();
app.use(bodyParser);
app.use(logger);
app.use(cors());
app.use(routes.routes());
app.use(routes.allowedMethods);

app.use(async (ctx, next) => {
    try {
        await next();
    }
    catch(err) {
        ctz.status = err.status || 500;
        ctx.body = err.message;
        ctx.app.emit('error', err, ctx);
    }
});

app.listen(8080);




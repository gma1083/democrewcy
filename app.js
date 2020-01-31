const Koa = require('koa');
const bodyParser = require('koa-body')();
const logger = require('koa-logger')();
const routes = require('./routes');
const cors = require('koa-cors');
const Noomman = require('noomman');
//const index = require('./src/index.js');

Noomman.connect('mongodb+srv://GregArnheiter:<password>@cluster0-rqft7.gcp.mongodb.net/test?retryWrites=true&w=majority', "democrewcy_test")
    .then(() => console.log('Connected....'))
    .catch((error) => console.log('Connection Failed: ' + error.message));

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




console.log({ message: "starting..." })
import Koa from 'koa';
import Router from 'koa-router';
import Static from 'koa-static';
import Send from 'koa-send';

import server from './server';
import { constants } from 'http2'

const app: Koa = new Koa();
const port: number | string = process.env.PORT || 3000;



app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.get('X-Response-Time');
    console.log({
        method: ctx.method,
        response: ctx.status,
        host: ctx.host,
        path: ctx.path,
        request_url: ctx.URL.href,
        duration: rt,
    });
})

app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
});

const router: Router = new Router({
    prefix: "/api",
});
server(router)

// handle apis
app.use(router.routes());
app.use(router.allowedMethods());

// handle statics
app.use(Static("dist", { maxAge: 1000 }))
app.use(async (ctx, next) => {
    ctx.status = constants.HTTP_STATUS_NOT_FOUND
    await Send(ctx, "dist/index.html")
})

// listen
console.log({ listen: port })
app.listen(port);
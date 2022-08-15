import {constants} from 'node:http2';
import process from 'node:process';
import Koa from 'koa';
import Router from 'koa-router';
import koaStatic from 'koa-static';
import koaSend from 'koa-send';
import koaProxy from 'koa-proxy';
import server from '@/server';

console.log({message: 'starting...'});

const app: Koa = new Koa();
const port: number | string = process.env.PORT ?? 3000;
const proxy: string | undefined = process.env.PROXY ?? undefined;

(async () => {
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
	});

	app.use(async (ctx, next) => {
		const start = Date.now();
		await next();
		const ms = Date.now() - start;
		ctx.set('X-Response-Time', `${ms}ms`);
	});

	const router: Router = new Router({
		prefix: '/auth',
	});
	// Handle apis
	await server(router);
	app.use(router.routes());
	app.use(router.allowedMethods());

	if (proxy === undefined) {
		// Handle statics
		app.use(koaStatic('dist', {maxAge: 1000}));
		// Default index.html
		app.use(async (ctx, next) => {
			ctx.status = constants.HTTP_STATUS_NOT_FOUND;
			await koaSend(ctx, 'dist/index.html');
		});
	} else {
		console.log({message: 'use proxy mode', proxy});
		app.use(koaProxy({
			host: proxy,
		}));
	}

	// Listen
	console.log({listen: port});
	app.listen(port);
})();

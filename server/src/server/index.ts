import {constants} from 'node:http2';
import axios, {AxiosError} from 'axios';
import jose from 'jose';
import Router from 'koa-router';
import qs from 'qs';
import {OidcClient} from '@/oidc';

export const COOKIE_ID_TOKEN = 'id_token';

export const kakao_oidc = new OidcClient({
	configuration_uri: 'https://kauth.kakao.com/.well-known/openid-configuration',
	client_id: '1708e8acc96a6759b07816bed018a57a',
	redirect_uri: 'http://127.0.0.1:3000/auth/kakao/callback',
});

const buildRouter = async (router: Router) => {
	await kakao_oidc.init();

	router.get('/', (ctx, next) => {
		ctx.body = {hello: 'world'};
	});

	router.get('/kakao/login', (ctx, next) => {
		ctx.redirect(kakao_oidc.getAuthorizationRedirectURI().href);
	});

	router.get('/kakao/callback', async (ctx, next) => {
		const code = ctx.URL.searchParams.get('code') ?? '';
		if (code === '') {
			ctx.status = constants.HTTP_STATUS_BAD_REQUEST;
			ctx.body = {message: 'invalid request'};
			return;
		}

		const token = await kakao_oidc.fetchTokenUsingCode(code);
		console.log(await kakao_oidc.fetchUserinfo(token.access_token));
		ctx.cookies.set(COOKIE_ID_TOKEN, token.id_token, {
			overwrite: true,
			httpOnly: false,
		});

		ctx.redirect('/');
	});
};

export default buildRouter;

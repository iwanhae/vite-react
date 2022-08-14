import axios, { AxiosError } from 'axios';
import { constants } from 'http2';
import jose from 'jose'
import Router from 'koa-router';
import qs from 'qs'
import { OIDCClient } from '../oidc'

const kakao_oidc = new OIDCClient({
    configuration_uri: "https://kauth.kakao.com/.well-known/openid-configuration",
    client_id: "a8b1ecbe88809e47c378b1fdce1e1d61",
    redirect_uri: "http://127.0.0.1:3000/auth/oauth/kakao"
})

const COOKIE_ID_TOKEN = "id_token"

export default async (router: Router) => {
    await kakao_oidc.init()


    router.get('/', (ctx, next) => {
        ctx.body = { hello: "world" };
    });

    router.get('/login/kakao', (ctx, next) => {
        ctx.redirect(kakao_oidc.getAuthorizationRedirectURI().href)
    })

    router.get("/oauth/kakao", async (ctx, next) => {
        const code = ctx.URL.searchParams.get('code') || ""
        if (code === "") {
            ctx.status = constants.HTTP_STATUS_BAD_REQUEST
            ctx.body = { message: "invalid request" }
            return
        }

        const token = await kakao_oidc.fetchTokenUsingCode(code)
        console.log(await kakao_oidc.fetchUserinfo(token.access_token))
        ctx.cookies.set(COOKIE_ID_TOKEN, token.id_token, {
            overwrite: true,
            httpOnly: false
        })

        ctx.redirect("/")
    })
}
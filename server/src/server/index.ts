import axios, { AxiosError } from 'axios';
import { constants } from 'http2';
import Router from 'koa-router';
import qs from 'qs'

const kakao = {
    ENDPOINT: "https://kauth.kakao.com/oauth/authorize",
    REST_API_KEY: "a8b1ecbe88809e47c378b1fdce1e1d61",
    REDIRECT_URI: "http://127.0.0.1:3000/api/oauth/kakao"
}

export default (router: Router) => {
    router.get('/', (ctx, next) => {
        ctx.body = { hello: "world" };
    });

    router.get('/login/kakao', (ctx, next) => {
        const url = new URL(kakao.ENDPOINT)
        url.searchParams.set("client_id", kakao.REST_API_KEY)
        url.searchParams.set("redirect_uri", kakao.REDIRECT_URI)
        url.searchParams.set("response_type", "code")
        ctx.redirect(url.href)
    })

    router.get("/oauth/kakao", async (ctx, next) => {
        const code = ctx.URL.searchParams.get('code') || ""
        if (code === "") {
            ctx.status = constants.HTTP_STATUS_BAD_REQUEST
            ctx.body = { message: "invalid request" }
            return
        }
        try {
            const oidc_response = await axios({
                method: "POST",
                url: "https://kauth.kakao.com/oauth/token",
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
                data: qs.stringify({
                    grant_type: "authorization_code",
                    client_id: kakao.REST_API_KEY,
                    redirect_uri: kakao.REDIRECT_URI,
                    code: code
                }),
            })
            console.log(oidc_response)
            ctx.body = oidc_response.data
        } catch (error) {
            if (error instanceof AxiosError) {
                ctx.body = error.response?.data
            }

        }

    })
}
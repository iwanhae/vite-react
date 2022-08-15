import axios from 'axios';
import qs from 'qs';
import {jwtVerify, createRemoteJWKSet, JWTPayload, JWTVerifyGetKey} from 'jose';

export class OidcClient {
	public isReady = false;
	readonly config_uri: string;

	private issuer = '';
	private authorization_endpoint = '';
	private userinfo_endpoint = '';
	private token_endpoint = '';
	private jwks_uri = '';
	private jwks: JWTVerifyGetKey | undefined;
	private readonly client_id: string;
	private readonly redirect_uri: string;

	/**
     * @param configuration_uri e.g, https://kauth.kakao.com/.well-known/openid-configuration
     */
	constructor(conf: INIT_OIDC_CLIENT) {
		this.config_uri = conf.configuration_uri;
		this.client_id = conf.client_id;
		this.redirect_uri = conf.redirect_uri;
	}

	public async init() {
		const result = await axios.get<OIDC_CONFIGURATION_RESPONSE>(this.config_uri);
		this.issuer = result.data.issuer;
		this.authorization_endpoint = result.data.authorization_endpoint;
		this.userinfo_endpoint = result.data.userinfo_endpoint;
		this.jwks_uri = result.data.jwks_uri;
		this.jwks = createRemoteJWKSet(new URL(this.jwks_uri));
		this.token_endpoint = result.data.token_endpoint;
		this.isReady = true;
	}

	public getAuthorizationRedirectURI(): URL {
		const url = new URL(this.authorization_endpoint);
		url.searchParams.set('client_id', this.client_id);
		url.searchParams.set('redirect_uri', this.redirect_uri);
		url.searchParams.set('response_type', 'code');
		return url;
	}

	public async fetchTokenUsingCode(code: string): Promise<OIDC_TOKEN_RESPONSE> {
		const response = await axios.post<OIDC_TOKEN_RESPONSE>(this.token_endpoint,
			qs.stringify({
				grant_type: 'authorization_code',
				client_id: this.client_id,
				redirect_uri: this.redirect_uri,
				code,
			}),
			{headers: {'content-type': 'application/x-www-form-urlencoded'}});
		await this.validateToken(response.data.id_token);
		return response.data;
	}

	public async validateToken(id_token: string): Promise<JWTPayload> {
		if (this.jwks === undefined) {
			throw (new Error('OidcClient is not initialized yet'));
		}

		const result = await jwtVerify(id_token, this.jwks, {
			issuer: this.issuer,
		});
		return result.payload;
	}

	public async fetchUserinfo(access_token: string): Promise<OIDC_USER_RESPONSE> {
		const result = await axios.get<OIDC_USER_RESPONSE>(this.userinfo_endpoint, {
			headers: {Authorization: `Bearer ${access_token}`},
		});
		return result.data;
	}
}

type OIDC_CONFIGURATION_RESPONSE = {
	issuer: string;
	authorization_endpoint: string;
	token_endpoint: string;
	userinfo_endpoint: string;
	jwks_uri: string;
};

type OIDC_TOKEN_RESPONSE = {
	id_token: string;
	access_token: string;
};

type OIDC_USER_RESPONSE = {
	sub: string;
	name?: string;
	nickname?: string;
	picture?: string;
};

interface INIT_OIDC_CLIENT {
	configuration_uri: string;
	client_id: string;
	redirect_uri: string;
}

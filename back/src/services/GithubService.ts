import fetch from 'node-fetch';

import config from '@config/index';
import { needToHandle } from '@helper/tools';
import { IGithubUserInfo } from '@interfaces/GithubUserInfo';
import AuthError, { AuthErrorMessage } from './errors/AuthError';

const clientId = config.githubClient;
const clientSecret = config.githubSecret;
const tokenUrl = `https://github.com/login/oauth/access_token`;
const userInfoUrl = `https://api.github.com/user`;

export default class GithubService {
	static async getAccessToken(code: string): Promise<string> {
		try {
			if (code === undefined) throw new AuthError(AuthErrorMessage.INVALID_GITHUB_CODE);
			const result = await fetch(tokenUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				body: JSON.stringify({
					client_id: clientId,
					client_secret: clientSecret,
					code,
				}),
			});
			if (result.ok) {
				const accessToken = await result.json();
				return accessToken['access_token'];
			}
			throw new AuthError(AuthErrorMessage.GITHUB_CANNOT_GET_ACCESS_TOKEN);
		} catch (error) {
			if (false) needToHandle();
			throw error;
		}
	}

	static async getUserInfo(accessToken: string): Promise<IGithubUserInfo> {
		try {
			if (accessToken === undefined) throw new AuthError(AuthErrorMessage.INVALID_GITHUB_ACCESS_TOKEN);
			const result = await fetch(userInfoUrl, {
				method: 'GET',
				headers: {
					Authorization: `token ${accessToken}`,
					Accept: 'application/json',
				},
			});

			if (result.status === 200) {
				const userInfo = result.json();
				return await userInfo;
			}
			throw new AuthError(AuthErrorMessage.GITHUB_CANNOT_GET_USER_INFO);
		} catch (error) {
			if (false) needToHandle();
			throw error;
		}
	}
}

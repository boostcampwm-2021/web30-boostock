import CommonError from './CommonError';

export enum AuthErrorMessage {
	INVALID_GITHUB_CODE = 'INVALID_GITHUB_CODE',
	INVALID_GITHUB_ACCESS_TOKEN = 'INVALID_GITHUB_ACCESS_TOKEN',
	GITHUB_CANNOT_GET_ACCESS_TOKEN = 'CANNOT_GET_ACCESS_TOKEN',
	GITHUB_CANNOT_GET_USER_INFO = 'CANNOT_GET_ACCESS_TOKEN',
}

export default class AuthError extends CommonError {
	constructor(message: string) {
		super(message);
		this.name = 'Auth Error';
		this.status = 400;
	}
}

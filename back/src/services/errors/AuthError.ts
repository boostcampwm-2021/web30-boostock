import CommonError from './CommonError';

export default class AuthError extends CommonError {
	constructor(message: string) {
		super(message);
		this.name = 'Auth Error';
		this.status = 202;
	}
}

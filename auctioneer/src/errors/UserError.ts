import CommonError from './CommonError';

export enum UserErrorMessage {
	NOT_EXIST_USER = 'Not Exist User',
}

export default class UserError extends CommonError {
	constructor(message: UserErrorMessage | string) {
		super(message);
		this.name = 'User Error';
		this.status = 400;
	}
}

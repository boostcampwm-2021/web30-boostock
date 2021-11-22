import CommonError from './CommonError';

export enum NotFoundErrorMessage {
	NOT_FOUND = 'Not Found',
}
export default class NotFoundError extends CommonError {
	constructor(message: NotFoundErrorMessage | string) {
		super(message);
		this.name = 'Not Found Error';
		this.status = 404;
	}
}

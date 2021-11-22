export enum CommonErrorMessage {
	INVALID_REQUEST = 'Invalid Request',
	UNKNOWN_ERROR = 'Unknown Error',
}

export default class CommonError extends Error {
	public status: number;

	constructor(message: CommonErrorMessage | string) {
		super(message);
		this.name = 'Common Error';
		this.status = 500;
	}
}

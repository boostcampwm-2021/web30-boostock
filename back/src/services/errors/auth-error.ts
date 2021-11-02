export default class AuthError extends Error {
	private status: number;

	constructor(message: string) {
		super(message);
		this.name = 'AuthError';
		this.status = 202;
	}
}

import CommonError from './CommonError';

export enum DBErrorMessage {
	INSERT_FAIL = 'INSERT FAIL',
	UPDATE_FAIL = 'UPDATE FAIL',
	DELETE_FAIL = 'DELETE FAIL',
}
export default class DBError extends CommonError {
	constructor(message: DBErrorMessage) {
		super(message);
		this.name = 'DB Error';
		this.status = 422;
	}
}

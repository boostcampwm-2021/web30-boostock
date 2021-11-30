import CommonError from './CommonError';

export enum OptimisticVersionErrorMessage {
	OPTIMISTIC_LOCK_VERSION_MISMATCH_ERROR = 'OPTIMISTIC LOCK VERSION MISMATCH ERROR',
}
export default class OptimisticVersionError extends CommonError {
	constructor(message: OptimisticVersionErrorMessage) {
		super(message);
		this.name = 'OptimisticVersionError';
		this.status = 404;
	}
}

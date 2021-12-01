import AuthError, { AuthErrorMessage } from '@errors/AuthError';
import { Request, Response, NextFunction } from 'express';

const sessionValidator = (req: Request, res: Response, next: NextFunction): void => {
	try {
		const userId = req.session.data?.userId;
		if (userId === undefined) throw new AuthError(AuthErrorMessage.INVALID_SESSION);
		res.locals.userId = userId;
		next();
	} catch (error) {
		next(error);
	}
};

export default sessionValidator;

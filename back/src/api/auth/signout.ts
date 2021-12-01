import { AuthError, AuthErrorMessage } from 'errors';
import UserService from '@services/UserService';
import express, { NextFunction, Request, Response } from 'express';
import eventEmitter from '@helper/eventEmitter';
import session from 'express-session';
import sessionValidator from '@api/middleware/sessionValidator';

export default (): express.Router => {
	const router = express.Router();

	router.post('/signout', (req: Request, res: Response, next: NextFunction) => {
		try {
			const { alarmToken } = req.cookies;
			res.clearCookie('connect.sid');
			res.clearCookie('alarmToken');
			req.session.destroy(() => res.status(200).json({}));

			eventEmitter.emit('LOGOUT', alarmToken);
		} catch (error) {
			next(error);
		}
	});

	router.delete('/signout', sessionValidator, async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { userId } = res.locals;
			await UserService.destroyAllSession(userId);

			res.status(200).json({});
		} catch (error) {
			next(error);
		}
	});

	return router;
};

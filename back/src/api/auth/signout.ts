import express, { NextFunction, Request, Response } from 'express';
import config from '@config/index';
import UserService from '@services/UserService';
import { AuthError, AuthErrorMessage } from '@errors/index';

export default (): express.Router => {
	const router = express.Router();

	router.post('/signout', (req: Request, res: Response, next: NextFunction) => {
		try {
			res.clearCookie(config.sessionCookieId);
			req.session.destroy(() => res.status(200).json({}));
		} catch (error) {
			next(error);
		}
	});

	router.delete('/signout', async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userId = req.session.data?.userId;
			if (userId === undefined) throw new AuthError(AuthErrorMessage.INVALID_SESSION);
			await UserService.destroyAllSession(userId);
			res.status(200).json({});
		} catch (error) {
			next(error);
		}
	});

	return router;
};

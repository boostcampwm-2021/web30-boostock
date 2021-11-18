import { AuthError, AuthErrorMessage } from '@services/errors';
import UserService from '@services/UserService';
import express, { NextFunction, Request, Response } from 'express';

export default (): express.Router => {
	const router = express.Router();

	router.post('/signout', (req: Request, res: Response, next: NextFunction) => {
		try {
			res.clearCookie('connect.sid');
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

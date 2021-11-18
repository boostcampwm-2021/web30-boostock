import express, { NextFunction, Request, Response } from 'express';
import { AuthError, AuthErrorMessage, ParamError, UserError } from '@services/errors/index';
import { UserService } from '@services/index';

export default (): express.Router => {
	const router = express.Router();

	router.get('/', async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userId = req.session.data?.userId;
			if (userId === undefined) throw new AuthError(AuthErrorMessage.INVALID_SESSION);
			const user = await UserService.getUserById(userId);
			res.status(200).json({ user });
		} catch (error) {
			next(error);
		}
	});

	router.get('/email', async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { email } = req.query;
			await UserService.getUserByEmail(String(email));
			return res.status(200).json({ result: false });
		} catch (error) {
			if (error instanceof UserError) return res.status(200).json({ result: true });
			if (error instanceof ParamError) return res.status(200).json({ result: false });
			return next(error);
		}
	});

	return router;
};

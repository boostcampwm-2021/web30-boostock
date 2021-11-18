import express, { NextFunction, Request, Response } from 'express';
import { AuthError, AuthErrorMessage } from '@services/errors/index';
import { UserService } from '@services/index';

export default (): express.Router => {
	const router = express.Router();
	router.post('/transaction', async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userId = req.session.data?.userId;
			if (userId === undefined) throw new AuthError(AuthErrorMessage.INVALID_SESSION);
			const { start, end, type } = req.body;
			const history = await UserService.readTransactionHistory(userId, start, end, type);
			res.status(200).json({ history });
		} catch (error) {
			next(error);
		}
	});

	return router;
};

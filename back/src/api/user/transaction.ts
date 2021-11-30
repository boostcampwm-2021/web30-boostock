import express, { NextFunction, Request, Response } from 'express';
import { UserService } from '@services/index';
import sessionValidator from '@api/middleware/sessionValidator';

export default (): express.Router => {
	const router = express.Router();

	router.get('/transaction', sessionValidator, async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { userId } = res.locals;
			const { type, start, end } = req.query;
			const log = await UserService.readTransactionLog(userId, Number(start), Number(end), Number(type));

			res.status(200).json({ log });
		} catch (error) {
			next(error);
		}
	});

	return router;
};

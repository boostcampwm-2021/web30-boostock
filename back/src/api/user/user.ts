import express, { NextFunction, Request, Response } from 'express';
import { ParamError, UserError } from '@errors/index';
import { UserService } from '@services/index';
import sessionValidator from '@api/middleware/sessionValidator';

export default (): express.Router => {
	const router = express.Router();

	router.get('/', sessionValidator, async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { userId } = res.locals;
			const user = await UserService.readById(userId);

			res.status(200).json({ user });
		} catch (error) {
			next(error);
		}
	});

	router.get('/email', async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { email } = req.query;
			await UserService.readByEmail(String(email));

			return res.status(200).json({ result: false });
		} catch (error) {
			if (error instanceof UserError) return res.status(200).json({ result: true });
			if (error instanceof ParamError) return res.status(200).json({ result: false });
			return next(error);
		}
	});

	return router;
};

import express, { NextFunction, Request, Response } from 'express';
import { AuthError, AuthErrorMessage, ParamError, ParamErrorMessage } from '@services/errors/index';
import { UserService } from '@services/index';
import { IBalanceHistory, STATUSTYPE } from '@models/index';

export default (): express.Router => {
	const router = express.Router();
	router.get('/balance', async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userId = req.session.data?.userId;
			if (userId === undefined) throw new AuthError(AuthErrorMessage.INVALID_SESSION);
			const { start, end, type } = req.body;
			const result = await UserService.getUserById(userId);
			const { balance } = result;
			const history = await UserService.readBalanceHistory(userId, start, end, type);
			res.status(200).json({ balance, history });
		} catch (error) {
			next(error);
		}
	});

	router.post('/balance/deposit', async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userId = req.session.data?.userId;
			if (userId === undefined) throw new AuthError(AuthErrorMessage.INVALID_SESSION);
			const { bank, bankAccount } = req.body;
			const { changeValue } = req.body;
			if (!changeValue || changeValue < 0 || Number.isNaN(changeValue) || !bank || !bankAccount)
				throw new ParamError(ParamErrorMessage.INVALID_PARAM);
			const result = await UserService.updateBalance(userId, changeValue);
			const { balance } = result;

			const newBalanceHistory: IBalanceHistory = {
				type: BALANCETYPE.DEPOSIT,
				volume: changeValue,
				status: STATUSTYPE.FINISHED,
				bank,
				bankAccount,
				createdAt: new Date(),
			};
			await UserService.pushBalanceHistory(userId, newBalanceHistory);
			res.status(200).json({ balance });
		} catch (error) {
			next(error);
		}
	});

	router.post('/balance/withdraw', async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userId = req.session.data?.userId;
			if (userId === undefined) throw new AuthError(AuthErrorMessage.INVALID_SESSION);
			const { changeValue, bank, bankAccount } = req.body;
			if (!changeValue || changeValue < 0 || Number.isNaN(changeValue) || !bank || !bankAccount)
				throw new ParamError(ParamErrorMessage.INVALID_PARAM);
			const result = await UserService.updateBalance(userId, changeValue * -1);
			const { balance } = result;

			const newBalanceHistory: IBalanceHistory = {
				type: BALANCETYPE.WITHDRAW,
				volume: changeValue,
				status: STATUSTYPE.FINISHED,
				bank,
				bankAccount,
				createdAt: new Date(),
			};
			await UserService.pushBalanceHistory(userId, newBalanceHistory);
			res.status(200).json({ balance });
		} catch (error) {
			next(error);
		}
	});

	return router;
};

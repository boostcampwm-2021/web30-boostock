import express, { NextFunction, Request, Response } from 'express';
import { AuthError, AuthErrorMessage, ParamError, ParamErrorMessage } from '@services/errors/index';
import { UserService } from '@services/index';
import { IBalanceHistory, BALANCETYPE, STATUSTYPE } from '@models/index';

export default (): express.Router => {
	const router = express.Router();
	router.get('/balance', async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userId = req.session.data?.userId;
			if (userId === undefined) throw new AuthError(AuthErrorMessage.INVALID_SESSION);
			const type = Number(req.query.type);
			const start = Number(req.query.start);
			const end = Number(req.query.end);
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
			const changeValue = Number(req.body.changeValue);
			if (
				!changeValue ||
				Number.isNaN(changeValue) ||
				!bank ||
				!bankAccount ||
				changeValue <= 0 ||
				changeValue >= 10000000000
			)
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
			const { bank, bankAccount } = req.body;
			const changeValue = Number(req.body.changeValue);
			if (
				!changeValue ||
				Number.isNaN(changeValue) ||
				!bank ||
				!bankAccount ||
				changeValue <= 0 ||
				changeValue >= 10000000000
			)
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

import express, { NextFunction, Request, Response } from 'express';
import { ParamError, ParamErrorMessage } from 'errors/index';
import { UserService } from '@services/index';
import { IBalanceLog, BALANCETYPE, STATUSTYPE } from '@models/index';
import config from '@config/index';
import sessionValidator from '@api/middleware/sessionValidator';
import { balanceValidator } from '@api/middleware/orderValidator';

export default (): express.Router => {
	const router = express.Router();
	router.get('/balance', sessionValidator, async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { userId } = res.locals;
			const { type, start, end } = req.query;
			const result = await UserService.readById(userId);
			const { balance } = result;
			const log = await UserService.readBalanceLog(userId, Number(start), Number(end), Number(type));

			res.status(200).json({ balance, log });
		} catch (error) {
			next(error);
		}
	});
  
	router.post(
		'/balance/deposit',
		sessionValidator,
		balanceValidator,
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				const { userId } = res.locals;
				const { bank, bankAccount, changeValue } = req.body;
				const result = await UserService.updateBalance(userId, changeValue);
				const { balance } = result;

				const newBalanceLog: IBalanceLog = {
					type: BALANCETYPE.DEPOSIT,
					volume: changeValue,
					status: STATUSTYPE.FINISHED,
					bank,
					bankAccount,
					createdAt: new Date().getTime(),
				};
				await UserService.pushBalanceLog(userId, newBalanceLog);

			  res.status(201).json({});
			} catch (error) {
				next(error);
			}
		},
	);

	router.post(
		'/balance/withdraw',
		sessionValidator,
		balanceValidator,
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				const { userId } = res.locals;
				const { bank, bankAccount, changeValue } = req.body;

				const result = await UserService.updateBalance(userId, changeValue * -1);
				const { balance } = result;

				const newBalanceLog: IBalanceLog = {
					type: BALANCETYPE.WITHDRAW,
					volume: changeValue,
					status: STATUSTYPE.FINISHED,
					bank,
					bankAccount,
					createdAt: new Date().getTime(),
				};
				await UserService.pushBalanceLog(userId, newBalanceLog);

			  res.status(201).json({});
			} catch (error) {
				next(error);
			}
		},
	);

	return router;
};

import { Request, Response, NextFunction } from 'express';

export default function AsyncHelper(fn) {
	return (req: Request, res: Response, next: NextFunction): void => {
		fn(req, res, next).catch(next);
	};
}

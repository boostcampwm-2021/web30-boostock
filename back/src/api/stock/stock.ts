import express, { Request, Response } from 'express';
import Emitter from '../../helper/eventEmitter';

export default (): express.Router => {
	const router = express.Router();
	router.post('/conclusion', (req: Request, res: Response) => {
		const { data } = req.body;

		// 종목 코드 추출 과정 필요
		Emitter.emit('broadcast', { stockCode: 'HNX', msg: data });
		res.end();
	});

	return router;
};

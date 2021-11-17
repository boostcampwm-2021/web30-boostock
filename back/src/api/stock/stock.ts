import express, { Request, Response } from 'express';
import Emitter from '../../helper/eventEmitter';

export default (): express.Router => {
	const router = express.Router();
	router.post('/conclusion', (req: Request, res: Response) => {
		const msg = req.body;
		console.log(msg);
		const stockCode = msg.match.code;
		Emitter.emit('broadcast', { stockCode, msg });

		res.end();
	});

	return router;
};

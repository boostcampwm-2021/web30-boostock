import express, { Request, Response } from 'express';
import Emitter from '../../helper/eventEmitter';
// import User from '@models/User';
// import StockService from '@services/StockService';

export default (): express.Router => {
	const router = express.Router();
	router.get('/', (req: Request, res: Response) => {
		console.log('라우터 진입');
		Emitter.emit('broadcast');
	});

	return router;
};

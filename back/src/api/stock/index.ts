import express from 'express';
import stock from './stock';
import log from './log';
import bidAsk from './bid-ask';

export default (): express.Router => {
	const router = express.Router();
	router.use('/', stock());
	router.use('/', log());
	router.use('/', bidAsk());

	return router;
};

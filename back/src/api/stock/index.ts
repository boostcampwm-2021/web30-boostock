import express from 'express';
import stock from './stock';
import log from './log';

export default (): express.Router => {
	const router = express.Router();
	router.use('/', stock());
	router.use('/', log());

	return router;
};

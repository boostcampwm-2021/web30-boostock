import express from 'express';

import user from './user/index';
import order from './order/index';
import stock from './stock/index';

export default (): express.Router => {
	const router = express.Router();
	router.use('/user', user());
	router.use('/order', order());
	router.use('/stock', stock());

	return router;
};

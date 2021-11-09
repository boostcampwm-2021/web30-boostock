import express from 'express';

import user from './user/index';
import order from './order/index';

export default (): express.Router => {
	const router = express.Router();
	router.use('/user', user());
	router.use('/order', order());
	return router;
};

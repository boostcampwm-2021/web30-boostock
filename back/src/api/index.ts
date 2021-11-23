import express from 'express';

import user from './user/index';
import stock from './stock/index';
import auth from './auth/index';

export default (): express.Router => {
	const router = express.Router();
	router.use('/user', user());
	router.use('/stock', stock());
	router.use('/auth', auth());

	return router;
};

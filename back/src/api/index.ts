import express from 'express';

import user from './user/index';

export default (): express.Router => {
	const router = express.Router();
	router.use('/user', user());
	return router;
};

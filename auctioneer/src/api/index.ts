import express from 'express';

import message from './message/index';

export default (): express.Router => {
	const router = express.Router();
	router.use('/message', message());
	return router;
};

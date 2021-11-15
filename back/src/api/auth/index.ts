import express from 'express';
import github from './github';

export default (): express.Router => {
	const router = express.Router();
	router.use('/github', github());

	return router;
};

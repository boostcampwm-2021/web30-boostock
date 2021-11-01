import DotenvWebpackPlugin from 'dotenv-webpack';
import { merge } from 'webpack-merge';

import common from './webpack.common.js';

export default merge(common, {
	mode: 'production',
	plugins: [
		new DotenvWebpackPlugin({
			path: './.env',
		}),
	],
});

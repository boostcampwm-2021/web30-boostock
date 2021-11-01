import path from 'path';
import DotenvWebpackPlugin from 'dotenv-webpack';
import { merge } from 'webpack-merge';

import common from './webpack.common.js';

export default merge(common, {
	mode: 'development',
	devtool: 'source-map',
	devServer: {
		historyApiFallback: true,
		compress: true,
		static: path.resolve('./dist'),
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
			'Access-Control-Allow-Headers':
				'X-Requested-With, content-type, Authorization',
		},
	},
	plugins: [
		new DotenvWebpackPlugin({
			path: path.resolve('.env.dev'),
		}),
	],
});

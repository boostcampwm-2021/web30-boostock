import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
	entry: {
		app: './src/App.tsx',
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve('dist'),
		publicPath: '/',
		clean: true,
	},
	resolve: {
		extensions: ['.wasm', '.ts', '.tsx', '.mjs', '.cjs', '.js', '.json'],
		alias: {
			'@src': path.resolve('src'),
			'@common': path.resolve('src', 'common'),
			'@assets': path.resolve('assets'),
			'@pages': path.resolve('src', 'pages'),
			'@tools': path.resolve('src', 'tools'),
			'@recoil': path.resolve('src', 'recoil'),
			'@lib': path.resolve('src', 'lib'),
		},
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx|ts|tsx)$/,
				use: {
					loader: 'babel-loader',
				},
				exclude: /node_modules/,
			},
			{
				test: /\.(scss|css)$/i,
				use: ['style-loader', 'css-loader', 'sass-loader'],
				exclude: [/\.module\.css$/i, /node_modules/],
			},
			{
				test: /\.module\.css$/i,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: { modules: true },
					},
					'sass-loader',
				],
				exclude: /node_modules/,
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: 'asset/resource',
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				type: 'asset/resource',
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.resolve('src/index.html'),
			filename: path.resolve('dist/index.html'),
			chunks: ['app'],
		}),
	],
};

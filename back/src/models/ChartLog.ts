import mongoose from 'mongoose';

import IChartLog from '@interfaces/IChartLog';

const { Schema } = mongoose;

export const ChartLogSchema = new Schema<IChartLog>(
	{
		code: String,
		type: Number,
		priceBefore: Number,
		priceStart: Number,
		priceEnd: Number,
		priceHigh: Number,
		priceLow: Number,
		amount: Number,
		volume: Number,
		createdAt: Number,
	},
	{ collection: 'ChartLog' },
);

export default mongoose.model('ChartLog', ChartLogSchema);

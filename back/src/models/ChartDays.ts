import mongoose from 'mongoose';

import IChartCandle from '@interfaces/IChartCandle';

const { Schema } = mongoose;

export const ChartDaysSchema = new Schema<IChartCandle>(
	{
		code: String,
		priceBefore: Number,
		priceStart: Number,
		priceEnd: Number,
		priceHigh: Number,
		priceLow: Number,
		amount: Number,
		volume: Number,
		createdAt: Date,
	},
	{ collection: 'ChartDays' },
);

export default mongoose.model('ChartDays', ChartDaysSchema);

import mongoose from 'mongoose';

const { Schema } = mongoose;

export interface ITransactionLog {
	transactionId: number;
	bidUserId: number;
	askUserId: number;
	stockCode: string;
	amount: number;
	price: number;
	createdAt: number;
}

export const TransactionLogSchema = new Schema<ITransactionLog>(
	{
		transactionId: Number,
		bidUserId: Number,
		askUserId: Number,
		stockCode: String,
		amount: Number,
		price: Number,
		createdAt: Number,
	},
	{ collection: 'TransactionLog' },
);

export default mongoose.model('TransactionLog', TransactionLogSchema);

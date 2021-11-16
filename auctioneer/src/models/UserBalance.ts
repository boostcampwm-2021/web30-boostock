import mongoose from 'mongoose';

const { Schema } = mongoose;

export interface ITransaction {
	transactionId: number;
	bidUserId: number;
	askUserId: number;
	stockCode: string;
	amount: number;
	price: number;
	createdAt: number;
}

export interface IBalanceHistory {
	type: number;
	volume: number;
	status: number;
	bank: string;
	bankAccount: number;
}

export interface IUserBalance {
	userId: number;
	balanceHistory: IBalanceHistory[];
}

export const UserBalanceSchema = new Schema<IUserBalance>(
	{
		userId: Number,
		balanceHistory: Document,
	},
	{ collection: 'UserBalance' },
);

export default mongoose.model('UserBalance', UserBalanceSchema);

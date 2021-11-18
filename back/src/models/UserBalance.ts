import mongoose from 'mongoose';

const { Schema } = mongoose;
export interface IBalanceHistory {
	type: number;
	volume: number;
	status: number;
	bank: string;
	bankAccount: string;
	createdAt: Date;
}

export interface IUserBalance {
	userId: number;
	balanceHistory: IBalanceHistory[];
}

export const BalanceHistorySchema = new Schema<IBalanceHistory>({
	type: { type: Number, required: true },
	volume: { type: Number, required: true },
	status: { type: Number, required: true },
	bank: { type: String, required: true },
	bankAccount: { type: String, required: true },
	createdAt: { type: Date, required: true },
});

export const UserBalanceSchema = new Schema<IUserBalance>(
	{
		userId: { type: Number, required: true },
		balanceHistory: [BalanceHistorySchema],
	},
	{ collection: 'UserBalance' },
);

export default mongoose.model('UserBalance', UserBalanceSchema);

import mongoose from 'mongoose';

export enum BALANCETYPE {
	DEPOSIT = 1,
	WITHDRAW = 2,
}

const { Schema } = mongoose;
export interface IBalanceLog {
	type: number;
	volume: number;
	status: number;
	bank: string;
	bankAccount: string;
	createdAt: number;
}

export interface IUserBalance {
	userId: number;
	balanceLog: IBalanceLog[];
}

export const BalanceLogSchema = new Schema<IBalanceLog>({
	type: { type: Number, required: true },
	volume: { type: Number, required: true },
	status: { type: Number, required: true },
	bank: { type: String, required: true },
	bankAccount: { type: String, required: true },
	createdAt: Number,
});

export const UserBalanceSchema = new Schema<IUserBalance>(
	{
		userId: { type: Number, required: true },
		balanceLog: [BalanceLogSchema],
	},
	{ collection: 'UserBalance' },
);

export default mongoose.model('UserBalance', UserBalanceSchema);

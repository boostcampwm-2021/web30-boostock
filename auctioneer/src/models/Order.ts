import 'reflect-metadata';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum ORDERTYPE {
	ASK = 1,
	BID = 2,
}

export enum STATUSTYPE {
	PENDING = 1,
	PROCEEDEING = 2,
	FINISHED = 3,
	CANCELED = 4,
}

@Entity()
export default class Order {
	@PrimaryGeneratedColumn({ name: 'order_id' })
	orderId: number;

	@Column({ name: 'user_id' })
	userId: number;

	@Column({ name: 'stock_id' })
	stockId: number;

	@Column({ type: 'enum', enum: ORDERTYPE })
	type: number;

	@Column()
	amount: number;

	@Column()
	price: number;

	@Column({ name: 'created_at', type: 'datetime' })
	createdAt: Date;

	@Column({
		type: 'enum',
		enum: STATUSTYPE,
		default: STATUSTYPE.PENDING,
	})
	status: STATUSTYPE;
}

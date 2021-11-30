/* eslint-disable import/no-cycle */
import 'reflect-metadata';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, VersionColumn } from 'typeorm';
import { Stock } from './index';

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

	@ManyToOne(() => Stock, (stock: Stock) => stock.stockId)
	@JoinColumn({ name: 'stock_id', referencedColumnName: 'stockId' })
	stock: Stock;

	@Column({ name: 'stock_id' })
	stockId: number;

	@Column({ type: 'enum', enum: ORDERTYPE })
	type: ORDERTYPE;

	@Column()
	amount: number;

	@Column()
	price: number;

	@Column({ name: 'created_at', type: 'datetime' })
	createdAt: Date;

	@VersionColumn()
	version: number;
}

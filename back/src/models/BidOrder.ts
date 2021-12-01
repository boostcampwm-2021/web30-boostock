/* eslint-disable import/no-cycle */
import 'reflect-metadata';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, VersionColumn } from 'typeorm';
import { Stock } from './index';

@Entity({ name: 'bid_order' })
export default class BidOrder {
	@PrimaryGeneratedColumn({ name: 'order_id' })
	orderId: number;

	@Column({ name: 'user_id' })
	userId: number;

	@ManyToOne(() => Stock, (stock: Stock) => stock.stockId)
	@JoinColumn({ name: 'stock_id', referencedColumnName: 'stockId' })
	stock: Stock;

	@Column({ name: 'stock_id' })
	stockId: number;

	@Column()
	amount: number;

	@Column()
	price: number;

	@Column({ name: 'created_at', type: 'datetime' })
	createdAt: Date;

	@VersionColumn()
	version: number;
}

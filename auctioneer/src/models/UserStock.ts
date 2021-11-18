/* eslint-disable import/no-cycle */
import 'reflect-metadata';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user_stock' })
export default class UserStock {
	@PrimaryGeneratedColumn({ name: 'user_stock_id' })
	userStockId: number;

	@Column({ name: 'user_id' })
	userId: number;

	@Column({ name: 'stock_id' })
	stockId: number;

	@Column()
	amount: number;

	@Column()
	average: number;
}

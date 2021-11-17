/* eslint-disable import/no-cycle */
import 'reflect-metadata';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Stock, User } from './index';

@Entity({ name: 'user_stock' })
export default class UserStock {
	@PrimaryGeneratedColumn({ name: 'user_stock_id' })
	userStockId: number;

	@ManyToOne(() => User, (user: User) => user.userId)
	@JoinColumn({ name: 'user_id' })
	userId: User;

	@ManyToOne(() => Stock, (stock: Stock) => stock.stockId)
	@Column({ name: 'stock_id' })
	stockId: Stock;

	@Column()
	amount: number;

	@Column()
	average: number;
}

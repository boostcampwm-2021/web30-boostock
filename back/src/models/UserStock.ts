/* eslint-disable import/no-cycle */
import 'reflect-metadata';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Stock, User } from './index';

@Entity({ name: 'user_stock' })
export default class UserStock {
	@PrimaryGeneratedColumn({ name: 'user_stock_id' })
	userStockId: number;

	@ManyToOne(() => User, (user: User) => user.userId)
	@JoinColumn({ name: 'user_id', referencedColumnName: 'userId' })
	user: User;

	@ManyToOne(() => Stock, (stock: Stock) => stock.stockId)
	@JoinColumn({ name: 'stock_id', referencedColumnName: 'stockId' })
	stock: Stock;

	@Column({ name: 'user_id' })
	userId: number;

	@Column({ name: 'stock_id' })
	stockId: number;

	@Column()
	amount: number;

	@Column()
	average: number;
}

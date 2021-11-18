/* eslint-disable import/no-cycle */
import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Stock, User } from './index';

@Entity({ name: 'user_favorite' })
export default class UserFavorite {
	@PrimaryGeneratedColumn({ name: 'user_favorite_id' })
	userFavoriteId: number;

	@ManyToOne(() => User, (user: User) => user.userId, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'user_id', referencedColumnName: 'userId' })
	userId: User;

	@ManyToOne(() => Stock, (stock: Stock) => stock.stockId, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'stock_id', referencedColumnName: 'stockId' })
	stockId: Stock;
}

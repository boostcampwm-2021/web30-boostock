/* eslint-disable import/no-cycle */
import 'reflect-metadata';
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	ManyToOne,
	JoinColumn,
} from 'typeorm';
import User from './User';

@Entity({ name: 'user_stock' })
export default class UserStock {
	@PrimaryGeneratedColumn()
	user_stock_id: number;

	@ManyToOne(() => User, (user: User) => user.user_id)
	@JoinColumn({ name: 'user_id' })
	user_id: number;

	@Column()
	stock_id: number;

	@Column()
	amount: number;

	@Column()
	average: number;
}

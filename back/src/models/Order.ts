import 'reflect-metadata';
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	ManyToOne,
	JoinColumn,
} from 'typeorm';
import User from './User';
import Stock from './Stock';

export enum OrderType {
	SELL = 1,
	BUY = 2,
}

export enum OrderStatus {
	PENDING = 'pending',
	FINISHED = 'finished',
	CANCELING = 'canceling',
	CANCELED = 'canceled',
}

@Entity()
export default class Order {
	@PrimaryGeneratedColumn()
	order_id: number;

	@ManyToOne(() => User, (user: User) => user.user_id)
	@JoinColumn({ name: 'user_id' })
	userId: number;

	@ManyToOne(() => Stock, (stock: Stock) => stock.stock_id)
	@JoinColumn({ name: 'stock_id' })
	stockId: number;

	@Column({ type: 'enum', enum: OrderType })
	type: number;

	@Column()
	amount: number;

	@Column()
	price: number;

	@Column({ type: 'datetime' })
	created_at: Date;

	@Column({
		type: 'enum',
		enum: OrderStatus,
		default: OrderStatus.PENDING,
	})
	status: OrderStatus;
}

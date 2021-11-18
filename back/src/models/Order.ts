import 'reflect-metadata';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Order {
	@PrimaryGeneratedColumn({ name: 'order_id' })
	orderId: number;

	@Column({ name: 'user_id' })
	userId: number;

	@Column({ name: 'stock_id' })
	stockId: number;

	@Column({ type: 'enum', enum: OrderType })
	type: number;

	@Column()
	amount: number;

	@Column()
	price: number;

	@Column({ name: 'created_at', type: 'datetime' })
	createdAt: Date;

	@Column({
		type: 'enum',
		enum: OrderStatus,
		default: OrderStatus.PENDING,
	})
	status: OrderStatus;
}

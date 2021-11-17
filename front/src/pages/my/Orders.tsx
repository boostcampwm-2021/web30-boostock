import React, { useState, useEffect } from 'react';
import toDateString from '@src/common/utils/toDateString';

import './Orders.scss';

interface IOrder {
	orderTime: number;
	orderType: string;

	stockCode: string;
	stockName: string;

	price: number;
	orderAmount: number;

	status: string;
}

const Orders = () => {
	const [orders, setOrders] = useState<IOrder[]>([
		{
			orderTime: 1637043806237,
			orderType: '매도',

			stockCode: 'HNX',
			stockName: '호눅스',

			price: 1234567,
			orderAmount: 1234567,

			status: 'PENDING',
		},
	]);

	useEffect(() => {
		fetch(`${process.env.SERVER_URL}/api/user/orders`, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
			},
		}).then((res: Response) => {
			console.log(res.ok);
			// setOrders([]);
		});
	}, []);

	const getOrder = (order: IOrder) => {
		let status = ' ';
		if (order.orderType === '매수') status = ' my__item--up';
		else if (order.orderType === '매도') status = ' my__item--down';

		return (
			<div className="my__item" key={order.orderTime}>
				<div>{toDateString(order.orderTime)}</div>
				<div className={status}>{order.orderType}</div>
				<div>
					<span className="my__item-unit">{order.stockCode}</span>
					<br />
					<span className="my__item-title">{order.stockName}</span>
				</div>
				<div className="my__item-number">{order.price.toLocaleString()}</div>
				<div className="my__item-number">{order.orderAmount.toLocaleString()}</div>
				<div className="my__item-number">{order.status}</div>
			</div>
		);
	};

	return (
		<div className="my-orders">
			<div className="my__legend">
				<div>주문시간</div>
				<div>주문종류</div>
				<div>종목명</div>
				<div className="my__legend-number">주문가격 (원)</div>
				<div className="my__legend-number">주문수량 (주)</div>
				<div className="my__legend-number">상태</div>
			</div>
			{orders.map((order: IOrder) => getOrder(order))}
		</div>
	);
};

export default Orders;

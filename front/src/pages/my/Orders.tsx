import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import toDateString from '@src/common/utils/toDateString';

import './Orders.scss';

export enum ORDERTYPE {
	매도 = 1,
	매수 = 2,
}

interface IOrder {
	orderId: number;
	orderTime: number;
	orderType: ORDERTYPE;

	stockCode: string;
	stockName: string;

	price: number;
	orderAmount: number;
}

const Orders = () => {
	const [orders, setOrders] = useState<IOrder[]>([]);

	const refresh = () => {
		fetch(`${process.env.SERVER_URL}/api/user/order`, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
			},
		}).then((res: Response) => {
			if (res.ok) {
				res.json().then((data) => {
					setOrders(
						data.pendingOrder.map(
							(order: {
								orderId: number;
								stockCode: string;
								nameKorean: string;
								type: ORDERTYPE;
								amount: number;
								price: number;
								createdAt: number;
							}) => {
								return {
									orderId: order.orderId,
									orderTime: order.createdAt,
									orderType: order.type,
									stockCode: order.stockCode,
									stockName: 'order.nameKorean',
									price: order.price,
									orderAmount: order.amount,
								};
							},
						),
					);
				});
			}
		});
	};

	const cancel = (orderId: number) => {
		fetch(`${process.env.SERVER_URL}/api/user/order?id=${orderId}`, {
			method: 'DELETE',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
		}).then((res: Response) => {
			if (res.ok) toast.success('주문이 취소되었습니다.');
			else toast.error('주문이 취소하지 못했습니다. 잠시후 재시도해주세요.');

			refresh();
		});
	};

	useEffect(() => {
		refresh();
	}, []);

	const getOrder = (order: IOrder) => {
		let status = ' ';
		if (order.orderType === ORDERTYPE.매수) status = ' my__item--up';
		else if (order.orderType === ORDERTYPE.매도) status = ' my__item--down';
		return (
			<div className="my__item" key={order.orderId}>
				<div>{toDateString(order.orderTime)}</div>
				<div className={status}>{ORDERTYPE[order.orderType]}</div>
				<div>
					<span className="my__item-unit">{order.stockCode}</span>
					<br />
					<span className="my__item-title">{order.stockName}</span>
				</div>
				<div className="my__item-number">{order.price.toLocaleString()}</div>
				<div className="my__item-number">{order.orderAmount.toLocaleString()}</div>
				<div className="my__item-center" onClick={() => cancel(order.orderId)}>
					취소
				</div>
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
				<div className="my__legend-center">취소</div>
			</div>
			{orders.map((order: IOrder) => getOrder(order))}
		</div>
	);
};

export default Orders;

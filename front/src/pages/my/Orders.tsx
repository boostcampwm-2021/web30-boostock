import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import toDateString from '@src/common/utils/toDateString';
import { useRecoilValue } from 'recoil';
import StockList, { IStockListItem } from '@src/recoil/stockList';

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
	const stockList = useRecoilValue<IStockListItem[]>(StockList);
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
									orderTime: new Date(order.createdAt).getTime() + 32400000,
									orderType: order.type,
									stockCode: order.stockCode,
									stockName: stockList.find((stock) => stock.code === order.stockCode)?.nameKorean,
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
		let status = 'my__item-center';
		if (order.orderType === ORDERTYPE.매수) status += ' my__item--up';
		else if (order.orderType === ORDERTYPE.매도) status += ' my__item--down';

		return (
			<tr className="my__item" key={order.orderId}>
				<td>{toDateString(order.orderTime)}</td>
				<td className={status}>{ORDERTYPE[order.orderType]}</td>
				<td className="my__item-center">
					<span className="my__item-unit">{order.stockCode}</span>
					<br />
					<span className="my__item-title">{order.stockName}</span>
				</td>
				<td className="my__item-number">{order.price.toLocaleString()}</td>
				<td className="my__item-number">{order.orderAmount.toLocaleString()}</td>
				<td className="my__item-center">
					<button className="cancel-order-btn" type="button" onClick={() => cancel(order.orderId)}>
						주문취소
					</button>
				</td>
			</tr>
		);
	};

	return (
		<table className="my-orders">
			<thead className="my__legend">
				<tr className="my-legend-row">
					<th className="my__legend-left">주문시간</th>
					<th className="my__legend-center">주문종류</th>
					<th className="my__legend-center">종목명</th>
					<th className="my__legend-number">주문가격 (원)</th>
					<th className="my__legend-number">주문수량 (주)</th>
					<th className="my__legend-center">&nbsp;</th>
				</tr>
			</thead>
			<tbody className="my-order-items">{orders.map((order: IOrder) => getOrder(order))}</tbody>
		</table>
	);
};

export default Orders;

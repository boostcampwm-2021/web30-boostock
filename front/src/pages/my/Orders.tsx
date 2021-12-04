import React, { useState, LegacyRef } from 'react';
import TOAST from '@lib/toastify';
import { toDateString } from '@common/utils';
import { useRecoilValue } from 'recoil';
import { IStockListItem } from '@src/types';
import { stockListAtom } from '@recoil';
import { NINE_HOURS_IN_MILLISECONDS } from '@common/constants';
import useInfinityScroll from './useInfinityScroll';

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

const refresh = (
	type: ORDERTYPE,
	stockList: IStockListItem[],
	orders: IOrder[],
	setOrders: React.Dispatch<React.SetStateAction<IOrder[]>>,
	setLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
	setLoading(true);

	const id = orders[orders.length - 1]?.orderId || 0;
	fetch(`${process.env.SERVER_URL}/api/user/order?type=${type}&end=${id}`, {
		method: 'GET',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
		},
	}).then((res: Response) => {
		if (res.ok) {
			res.json().then((data) => {
				setOrders((prev) => [
					...prev,
					...data.pendingOrder.map(
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
								orderTime: new Date(order.createdAt).getTime() + NINE_HOURS_IN_MILLISECONDS,
								orderType: order.type,
								stockCode: order.stockCode,
								stockName: stockList.find((stock) => stock.code === order.stockCode)?.nameKorean,
								price: order.price,
								orderAmount: order.amount,
							};
						},
					),
				]);

				if (data.pendingOrder.length > 0) setLoading(false);
			});
		}
	});
};

const cancel = (orderId: number, orderType: ORDERTYPE, setOrders: React.Dispatch<React.SetStateAction<IOrder[]>>) => {
	fetch(`${process.env.SERVER_URL}/api/user/order?id=${orderId}&type=${orderType}`, {
		method: 'DELETE',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
	}).then((res: Response) => {
		if (res.ok) TOAST.success('주문이 취소되었습니다.');
		else TOAST.error('주문이 취소하지 못했습니다. 잠시후 재시도해주세요.');

		setOrders((prev) => [...prev.filter((order) => order.orderId !== orderId)]);
	});
};

const Orders = ({ type }: { type: ORDERTYPE }) => {
	const stockList = useRecoilValue<IStockListItem[]>(stockListAtom);
	const [orders, setOrders] = useState<IOrder[]>([]);
	const [rootRef, targetRef, loading] = useInfinityScroll(refresh.bind(undefined, type, stockList, orders, setOrders));

	const getOrder = (order: IOrder) => {
		return (
			<tr className="my__item" key={order.orderId}>
				<td>{toDateString(order.orderTime)}</td>
				<td className="my__item-center">
					<span className="my__item-unit">{order.stockCode}</span>
					<br />
					<span className="my__item-title">{order.stockName}</span>
				</td>
				<td className="my__item-number">{order.price.toLocaleString()}</td>
				<td className="my__item-number">{order.orderAmount.toLocaleString()}</td>
				<td className="my__item-center">
					<button
						className="cancel-order-btn"
						type="button"
						onClick={() => cancel(order.orderId, order.orderType, setOrders)}
					>
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
					<th className="my__legend-center">종목명</th>
					<th className="my__legend-number">주문가격 (원)</th>
					<th className="my__legend-number">주문수량 (주)</th>
					<th className="my__legend-center">&nbsp;</th>
				</tr>
			</thead>
			<tbody className="my-order-items" ref={rootRef as LegacyRef<HTMLTableSectionElement>}>
				{orders.length > 0 ? (
					orders.map((order: IOrder) => getOrder(order))
				) : (
					<tr className="my__item">
						<td className="my__item-center">주문 내역이 없습니다.</td>
					</tr>
				)}
				{loading === false && (
					<tr className="my__item" ref={targetRef as LegacyRef<HTMLTableRowElement>}>
						<td className="my__item-center" />
					</tr>
				)}
			</tbody>
		</table>
	);
};

export default Orders;

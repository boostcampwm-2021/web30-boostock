import React from 'react';
import { IBidOrderItem } from '@recoil/stockOrders/index';
import formatNumber from '@common/utils/formatNumber';
import ITotalAndMaxAmount from './ITotalAndMaxAmount';

interface IProps {
	bidOrder: IBidOrderItem;
	totalAndMaxAmount: ITotalAndMaxAmount;
	volumeWidth: (amount: number, maxAmount: number) => string;
	setBidAskPrice: (price: number) => void;
}

const BidOrderItem = ({ bidOrder, totalAndMaxAmount, volumeWidth, setBidAskPrice }: IProps) => {
	return (
		<tr>
			<td className="order-row-amount sell-amount" />
			<td className="order-row-price">
				<button type="button" className="order-row-price-data order-buy" onClick={() => setBidAskPrice(bidOrder.price)}>
					{formatNumber(bidOrder.price)}
				</button>
			</td>
			<td className="order-row-amount buy-amount active">
				<button type="button" className="amount-button" onClick={() => setBidAskPrice(bidOrder.price)}>
					<div
						style={{
							width: volumeWidth(bidOrder.amount, totalAndMaxAmount.maxAmount),
						}}
						className="amount-bar buy-amount-bar"
					>
						&nbsp;
					</div>
					<p className="amount-buy-text">{formatNumber(bidOrder.amount)}</p>
				</button>
			</td>
		</tr>
	);
};

export default BidOrderItem;

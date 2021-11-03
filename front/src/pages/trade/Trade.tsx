import React from 'react';
import BidAsk from './BidAsk';
import './Trade.scss';

// interface Props {}

const Trade = () => {
	return (
		<main className="trade">
			<section className="trade-container">
				<aside className="aside-bar">aside</aside>
				<section className="trade-body">
					<section className="trade-info">info</section>
					<section className="trade-chart">chart</section>
					<section className="trade-status">
						<section className="trade-order">order</section>
						<section className="trade-bid-ask">
							<BidAsk />
						</section>
					</section>
					<section className="trade-conclusion">conclusion</section>
				</section>
			</section>
		</main>
	);
};

export default Trade;

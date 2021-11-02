import React from 'react';
import './Trade.scss';

// interface Props {}

const Trade = () => {
	return (
		<>
			<header className="trade-header">header</header>
			<main className="trade-container">
				<aside className="aside-bar">aside</aside>
				<section className="trade-body">
					<section className="trade-info">info</section>
					<section className="trade-chart">chart</section>
					<section className="trade-status">
						<section className="trade-order">order</section>
						<section className="trade-bid-ask">bid-ask</section>
					</section>
					<section className="trade-conclusion">conclusion</section>
				</section>
			</main>
		</>
	);
};

export default Trade;

import React, { useState } from 'react';

import Info from './Info';
import Holds from './Holds';
import Transactions from './Transactions';
import Orders from './Orders';

import './My.scss';

enum TAB {
	HOLDS = '보유종목',
	TRANSACTIONS = '체결내역',
	ORDERS = '주문내역',
}

const My = () => {
	const [tab, setTab] = useState<TAB>(TAB.HOLDS);

	const switchTab = (index: number) => setTab(Object.values(TAB)[index]);

	const getCurrentTab = () => {
		switch (tab) {
			case TAB.HOLDS:
				return <Holds key={tab} />;
			case TAB.TRANSACTIONS:
				return <Transactions key={tab} />;
			case TAB.ORDERS:
				return <Orders key={tab} />;
			default:
				return <Holds key={tab} />;
		}
	};

	return (
		<div className="my">
			<div className="my__container">
				<Info />
			</div>
			<div className="my__container">
				<div className="my__tab">
					{Object.keys(TAB).map((key, index) => (
						<div
							key={key}
							className={`my__tab-item ${tab === TAB[key as keyof typeof TAB] ? 'selected' : ''}`}
							role="button"
							tabIndex={0}
							onClick={() => switchTab(index)}
							onKeyDown={() => switchTab(index)}
						>
							{Object.values(TAB)[index]}
						</div>
					))}
				</div>
				{getCurrentTab()}
			</div>
		</div>
	);
};

export default My;

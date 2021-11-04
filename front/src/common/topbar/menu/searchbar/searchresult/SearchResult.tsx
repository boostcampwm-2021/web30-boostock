import React from 'react';
import { Link } from 'react-router-dom';

import style from './searchResult.module.scss';

const SearchResult = ({
	stockList,
	search,
	focus,
}: {
	stockList: any;
	search: string;
}) => {
	return (
		<div className={style.container}>
			{stockList
				.filter((elem) => elem.english.startsWith(search))
				.map(({ english, target }) => (
					<Link to={`/exchange/${target}`}>{english}</Link>
				))}
		</div>
	);
};

export default SearchResult;

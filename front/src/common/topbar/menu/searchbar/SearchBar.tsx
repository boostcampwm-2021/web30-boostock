import React, { useState, useRef } from 'react';
import SearchResult from './searchresult/SearchResult';

interface Props {}

const stockList = [
	{ korean: '호눅스코인', english: 'honux', target: '호눅스코인' },
	{ korean: '크롱코인', english: 'crong', target: '크롱코인' },
	{ korean: 'JK코인', english: 'jk', target: 'JK코인' },
];

const SearchBar = (props: Props) => {
	const [search, setSearch] = useState('');

	const searchEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(event?.target?.value);
	};

	return (
		<>
			<input
				style={{ color: '#000' }}
				type="search"
				placeholder="What stocks are you looking for"
				onChange={searchEvent}
			/>
			<SearchResult stockList={stockList} search={search} />
		</>
	);
};

export default SearchBar;

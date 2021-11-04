import React, { useState } from 'react';

interface Props {}

const searchResult = [
	{ korean: '호눅스', code: 'honux', target: '호눅스' },
	{ korean: '크롱', code: 'crong', target: '크롱' },
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
			<div></div>
		</>
	);
};

export default SearchBar;

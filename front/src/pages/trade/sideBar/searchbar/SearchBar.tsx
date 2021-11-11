import React from 'react';
import { BsSearch } from 'react-icons/bs';

import './SearchBar.scss';

const SearchBar = ({
	searchEvent,
}: {
	searchEvent: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
	return (
		<div className="search-bar-container">
			<input
				className="search-bar"
				type="search"
				placeholder="What stocks are you looking for"
				onChange={searchEvent}
			/>
			<div className="search-bar-icon-container">
				<BsSearch />
			</div>
		</div>
	);
};

export default SearchBar;

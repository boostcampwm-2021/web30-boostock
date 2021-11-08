import React from 'react';

// interface Props {}

const SearchBar = ({
	searchEvent,
}: {
	searchEvent: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
	return (
		<>
			<input
				type="search"
				placeholder="What stocks are you looking for"
				onChange={searchEvent}
			/>
		</>
	);
};

export default SearchBar;

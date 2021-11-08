import React from 'react';

export enum MENU {
	ALL = '전체',
	FAVORITE = '관심',
	HOLD = '보유',
}

interface Props {
	setMenu: React.Dispatch<React.SetStateAction<MENU>>;
	index: number;
	className: string;
}

const SideBarMenu: React.FC<Props> = ({ setMenu, index, className }) => {
	return (
		<div
			className={className}
			role="button"
			tabIndex={0}
			onClick={() => setMenu(Object.values(MENU)[index])}
			onKeyDown={() => setMenu(Object.values(MENU)[index])}
		>
			{Object.values(MENU)[index]}
		</div>
	);
};

export default SideBarMenu;

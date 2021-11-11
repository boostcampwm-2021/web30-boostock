import React from 'react';
import { useSetRecoilState } from 'recoil';
import userAtom from '@src/recoil/user';
import { BsFillSunFill, BsMoonStarsFill } from 'react-icons/bs';

import style from './modeSwitch.module.scss';

const ModeSwitch = () => {
	const setUser = useSetRecoilState(userAtom);

	const toggleTheme = () => {
		setUser((user) => {
			return {
				...user,
				theme: user.theme === 'light' ? 'dark' : 'light',
			};
		});
	};

	return (
		<div className={style['switch-container']}>
			<input id={style['mode-switch']} role="switch" type="checkbox" onChange={toggleTheme} />
			<label htmlFor={style['mode-switch']} className={style['switch-label']}>
				<span className={style['mode-switch-day-icon']}>
					<BsFillSunFill />
				</span>
				<span className={style['mode-switch-night-icon']}>
					<BsMoonStarsFill />
				</span>
			</label>
		</div>
	);
};

export default ModeSwitch;

import React from 'react';
import { BsFillSunFill, BsMoonStarsFill } from 'react-icons/bs';

import style from './modeSwitch.module.scss';

const ModeSwitch = () => {
	return (
		<div className={style['switch-container']}>
			<input id={style['mode-switch']} role="switch" type="checkbox" />
			<label
				htmlFor={style['mode-switch']}
				className={style['switch-label']}
			>
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

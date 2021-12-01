import React from 'react';
import toast from 'react-hot-toast';
import { AiFillStar } from 'react-icons/ai';

interface IProps {
	isFavorite: boolean;
	isLoggedIn: boolean;
	stockCode: string;
	nameKorean: string;
	onRefresh: (isLoggedIn: boolean) => void;
}

const ToggleFavorite = ({ isFavorite, isLoggedIn, stockCode, nameKorean, onRefresh }: IProps) => {
	const toggleFavorite = async () => {
		if (!isLoggedIn) {
			toast.error('로그인이 필요합니다');
			return;
		}

		const config: RequestInit = {
			method: isFavorite ? 'DELETE' : 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
			body: JSON.stringify({ stockCode }),
		};

		try {
			const res = await fetch(`${process.env.SERVER_URL}/api/user/favorite`, config);
			if (!res.ok) throw new Error();

			const toastMessage = isFavorite ? ` 종목이 관심 종목에서 제거되었습니다.` : ` 종목이 관심 종목으로 등록되었습니다.`;

			toast.success(
				<span>
					<b>{nameKorean}</b>
					{toastMessage}
				</span>,
			);
			onRefresh(isLoggedIn);
		} catch (error) {
			toast.error('관심 종목 설정에 실패했습니다. 다시 시도해 주세요!');
		}
	};

	return (
		<button type="button" className="sidebar__item-favorite" onClick={toggleFavorite}>
			<AiFillStar color={isFavorite ? '#FFA800' : '#999'} />
		</button>
	);
};

export default ToggleFavorite;

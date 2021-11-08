// https://taegon.kim/archives/9919

function getPattern(ch: string) {
	const offset = '가'.charCodeAt(0);
	if (/[가-힣]/.test(ch)) {
		const chCode = ch.charCodeAt(0) - offset;
		// 종성이 있는 경우
		if (chCode % 28 > 0) {
			return ch;
		}
		const begin = Math.floor(chCode / 28) * 28 + offset;
		const end = begin + 27;
		return `[\\u${begin.toString(16)}-\\u${end.toString(16)}]`;
	}
	if (/[ㄱ-ㅎ]/.test(ch)) {
		const con2syl = {
			ㄱ: '가'.charCodeAt(0),
			ㄲ: '까'.charCodeAt(0),
			ㄴ: '나'.charCodeAt(0),
			ㄷ: '다'.charCodeAt(0),
			ㄸ: '따'.charCodeAt(0),
			ㄹ: '라'.charCodeAt(0),
			ㅁ: '마'.charCodeAt(0),
			ㅂ: '바'.charCodeAt(0),
			ㅃ: '빠'.charCodeAt(0),
			ㅅ: '사'.charCodeAt(0),
		};
		const begin =
			con2syl[ch as keyof typeof con2syl] ||
			(ch.charCodeAt(0) - 'ㅅ'.charCodeAt(0)) * 588 + con2syl['ㅅ'];
		const end = begin + 587;
		return `[${ch}\\u${begin.toString(16)}-\\u${end.toString(16)}]`;
	}
	return `[${ch}]`;
}

export default function getRegExp(keyword: string): RegExp {
	const pattern = keyword.toLowerCase().split('').map(getPattern).join('{1}');
	return new RegExp(pattern);
}

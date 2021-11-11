import { atom } from 'recoil';

const webSocketAtom = atom<WebSocket | null>({
	key: 'webSocketAtom',
	default: null,
});

export default webSocketAtom;

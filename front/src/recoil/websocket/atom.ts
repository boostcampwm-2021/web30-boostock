import { atom } from 'recoil';

const webSocketAtom = atom<WebSocket>({
	key: 'webSocketAtom',
	default: new WebSocket(process.env.WEBSOCKET || ''),
});

export default webSocketAtom;

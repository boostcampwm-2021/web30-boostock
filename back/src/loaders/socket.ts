import wsModule from 'ws';
import fs from 'fs';
import _http from 'http';
import _https from 'https';
import setSocketEvent from '@services/SocketService';

const startHttpServer = () => {
	return _http.createServer();
};
const startHttpsServer = () => {
	return _https.createServer({
		ca: fs.readFileSync('/etc/ssl/ca_bundle.crt'),
		key: fs.readFileSync('/etc/ssl/private.key'),
		cert: fs.readFileSync('/etc/ssl/certificate.crt'),
	});
};

export default (): void => {
	const server = process.env.NODE_ENV === 'production' ? startHttpsServer() : startHttpServer();
	const webSocketServer = new wsModule.WebSocketServer({ server });

	webSocketServer['binaryType'] = 'arraybuffer';
	server.listen(process.env.SOCKET_PORT || 3333);

	setSocketEvent(webSocketServer);
};

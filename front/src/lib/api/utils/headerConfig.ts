export function generateConfig(options: RequestInit = {}, body: unknown = null): RequestInit {
	const requestConfig = {
		method: options.method ?? 'GET',
		credentials: options.credentials ?? 'include',
		...options,
	};

	if (body) {
		requestConfig.body = typeof body === 'object' ? JSON.stringify(body) : (body as BodyInit);
	}

	return requestConfig;
}

export function generateURL(path: string, query?: string): string {
	const base = `${process.env.SERVER_URL}/api/${path}`;
	return query ? `${base}?${encodeURI(query)}` : base;
}

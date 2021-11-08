export const translateRequestData = (data: object | []) => JSON.stringify(data);
export const translateResponseData = (data: string) => JSON.parse(data);

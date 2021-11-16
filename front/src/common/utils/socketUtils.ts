const binArrayToJson = (binArray: Uint8Array) => JSON.parse(new TextDecoder().decode(binArray));
const JsonToBinArray = (json: JSON): Uint8Array => new TextEncoder().encode(JSON.stringify(json, null, 0));

export const translateRequestData = (data: JSON) => new Uint8Array(JsonToBinArray(data)).buffer;
export const translateResponseData = (data: Uint8Array) => binArrayToJson(data);

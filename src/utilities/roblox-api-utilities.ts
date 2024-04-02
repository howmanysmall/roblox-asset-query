import { nullifyNull } from "./nullify-null";

export interface AssetIdName {
	readonly assetId: number;
	readonly name: string;
}

export interface RequestDictionary {
	Body?: BodyInit;
	Headers?: HeadersInit;
	Method?: string;
	Url: string;
}

export function promiseRequest(requestDictionary: RequestDictionary) {
	return fetch(requestDictionary.Url, {
		body: requestDictionary.Body,
		headers: requestDictionary.Headers,
		method: requestDictionary.Method,
	});
}

const xsrfCache = new Map<string, string>();

export async function promiseXsrf(cookie: string) {
	const cache = xsrfCache.get(cookie);
	if (cache) return cache;

	const responseDictionary = await promiseRequest({
		Headers: {
			"content-type": "application/json;charset=utf-8",
			cookie,
		},
		Method: "POST",
		Url: "https://auth.roblox.com/v2/login",
	});

	const xsrf = nullifyNull(responseDictionary.headers.get("x-csrf-token"));
	if (xsrf === undefined) {
		const exception = new Error("XSRF token not found");
		Error.captureStackTrace(exception, promiseXsrf);
		throw exception;
	}

	xsrfCache.set(cookie, xsrf);
	return xsrf;
}

export async function promiseSignedInHeaders(cookie: string) {
	const xsrf = await promiseXsrf(cookie);
	return {
		cookie,
		"x-csrf-token": xsrf,
	};
}

export async function promiseSignedInRequest(cookie: string, requestDictionary: RequestDictionary) {
	const requestHeaders = await promiseSignedInHeaders(cookie);
	return await promiseRequest({
		...requestDictionary,
		Headers: {
			...requestDictionary.Headers,
			...requestHeaders,
		},
	});
}

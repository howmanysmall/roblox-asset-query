import type { FileSink } from "bun";
import type AssetType from "../meta/asset-type";
import { LastKnownCursor } from "./get-last-known-cursor";
import promiseDelay from "./promise-delay";
import { promiseSignedInRequest } from "./roblox-api-utilities";
import { isNull } from "./nullify-null";

function getWithoutCase(headers: Headers, lookFor: string) {
	lookFor = lookFor.toLowerCase();

	for (const [key, value] of headers) {
		if (typeof value !== "string") continue;
		if (key.toLowerCase() === lookFor) return value;
	}

	return undefined;
}

export default function createRetry<T>(
	cookie: string,
	url: string,
	assetType: AssetType,
	lastKnownCursorFile: FileSink,
) {
	let hasRan = false;
	return function retry(cursor?: string) {
		if (isNull(cursor) && hasRan) throw "We're at the end!";
		if (isNull(cursor)) LastKnownCursor.lastKnownCursor = cursor;
		hasRan = true;

		return promiseSignedInRequest(cookie, {
			Method: "GET",
			Url: `${url}${cursor === undefined ? "" : cursor}`,
		}).then((responseDictionary) => {
			if (!responseDictionary.ok) {
				const retryAfter = getWithoutCase(responseDictionary.headers, "retry-after");
				if (retryAfter) console.log(`retrying after ${retryAfter}`);

				return promiseDelay(Number(retryAfter ?? 15) || 15).then(async () => {
					if (!isNull(cursor))
						try {
							lastKnownCursorFile.write(`${cursor}\n`);
						} catch (error) {
							console.warn(`failed to write file ${cursor} - ${error}`);
						} finally {
							await lastKnownCursorFile.flush();
						}

					throw `Failed to get ${assetType}: ${responseDictionary.status} (${responseDictionary.statusText}) (we're on cursor ${cursor})`;
				});
			}

			if (responseDictionary.status === 429) {
				const retryAfter = getWithoutCase(responseDictionary.headers, "retry-after");
				if (retryAfter) console.log(`retrying after ${retryAfter}`);

				return promiseDelay(Number(retryAfter ?? 15) || 15).then(async () => {
					if (!isNull(cursor))
						try {
							lastKnownCursorFile.write(`${cursor}\n`);
						} catch (error) {
							console.warn(`failed to write file ${cursor} - ${error}`);
						} finally {
							await lastKnownCursorFile.flush();
						}

					throw `Failed to get ${assetType}: ${responseDictionary.status} (${responseDictionary.statusText}) (we're on cursor ${cursor})`;
				});
			}

			return responseDictionary.json() as Promise<T>;
		});
	};
}

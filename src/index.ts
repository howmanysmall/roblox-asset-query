import prompts from "prompts";
import AssetType from "./meta/asset-type";
import { LastKnownCursor } from "./utilities/get-last-known-cursor";
import Pages, { type PagesResponse } from "./classes/pages";
import createRetry from "./utilities/create-retry";
import promiseRetry from "./utilities/promise-retry";
import AssetTypeMeta from "./meta/asset-type-meta";
import pagesIterator from "./utilities/pages-iterator";
import type { AssetIdName } from "./utilities/roblox-api-utilities";

// biome-ignore lint/complexity/useLiteralKeys: necessary
const foundRobloxCookie = Bun.env["COOKIE"];

const lastKnownCursor = await LastKnownCursor.getLastKnownCursor();
const lastKnownCursorFile = Bun.file("LastKnownCursor.txt");
const lastKnownCursorStream = lastKnownCursorFile.writer();

async function getRobloxCookie() {
	if (foundRobloxCookie) return { robloxCookie: foundRobloxCookie };

	return await prompts({
		hint: "Get it from cookies in your browser",
		message: "Provide your Roblox Cookie.",
		name: "robloxCookie",
		type: "password",
	});
}

const { robloxCookie } = await getRobloxCookie();

const { assetType } = await prompts({
	choices: [
		{
			description: "Search for shirt assets",
			title: "Shirt",
			value: AssetType.Shirt,
		},
		{
			description: "Search for pants assets",
			title: "Pants",
			value: AssetType.Pants,
		},
	],
	message: "What type of asset are you grabbing?",
	name: "assetType",
	type: "select",
});

const { write } = await prompts({
	initial: `${process.cwd()}/${assetType}.txt`,
	message: "Where do you want to write the files?",
	name: "write",
	type: "text",
});

async function getContinueFrom() {
	return lastKnownCursor === undefined
		? { continueFrom: false }
		: await prompts({
				message: `Continue from last known cursor? ${lastKnownCursor}`,
				name: "continueFrom",
				type: "confirm",
			});
}

const { continueFrom } = await getContinueFrom();

// console.log(assetType);
// console.log(robloxCookie);
// console.log(write);
// console.log(continueFrom);

const retry = createRetry<PagesResponse<AssetIdName>>(
	robloxCookie,
	AssetTypeMeta[assetType as AssetType].url,
	assetType,
	lastKnownCursorStream,
);

const pages = new Pages<AssetIdName>((cursor) => {
	if (cursor === undefined && continueFrom && lastKnownCursor !== undefined) cursor = lastKnownCursor;
	return promiseRetry(retry, 20, cursor);
});

const writeFile = Bun.file(write);
const writeFileStream = writeFile.writer();

try {
	for await (const item of pagesIterator(pages)) {
		writeFileStream.write(`${item.assetId} - ${item.name}\n`);
		writeFileStream.flush();
	}
} catch (error) {
	console.warn(`failed to process pages: ${error}`);
}

console.log("\rclosing B%)");
await writeFileStream.end();
await lastKnownCursorStream.end();

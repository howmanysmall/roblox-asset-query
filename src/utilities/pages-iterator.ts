import type Pages from "../classes/pages";

export default async function* pagesIterator<T>(pages: Pages<T>) {
	while (!pages.isFinished) {
		const currentPage = await pages.getCurrentPage();
		for (const item of currentPage) yield item;

		try {
			await pages.advanceToNextPageAsync();
		} catch (error) {
			console.warn(`Failed to advance to next page: ${error}`);
			break;
		}
	}
}

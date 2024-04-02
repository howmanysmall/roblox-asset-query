export interface PagesResponse<T> {
	readonly data: ReadonlyArray<T>;
	readonly nextPageCursor?: string;
	readonly previousPageCursor?: string;
}

export default class Pages<T> {
	public isFinished = false;
	public constructor(private readonly requestFunction: (cursor?: string) => Promise<PagesResponse<T>>) {}

	public async advanceToNextPageAsync() {
		if (this.isFinished) {
			const exception = new Error("No more pages to fetch.");
			Error.captureStackTrace(exception, this.advanceToNextPageAsync);
			throw exception;
		}

		const response = await this.requestFunction(this.nextPageCursor);
		this.currentPage = response.data;
		this.nextPageCursor = response.nextPageCursor;
		this.isFinished = this.nextPageCursor === undefined;
	}

	public async getCurrentPage() {
		if (!this.currentPage) await this.advanceToNextPageAsync();
		return this.currentPage!;
	}

	private currentPage?: ReadonlyArray<T>;
	private nextPageCursor?: string;
}

export default function promiseRetry<P extends ReadonlyArray<unknown>, T>(
	callback: (...promiseArguments: P) => Promise<T>,
	amount: number,
	...promiseArguments: P
): Promise<T> {
	return Promise.resolve(callback(...promiseArguments)).catch((error) => {
		if (amount > 0) return promiseRetry(callback, amount - 1, ...promiseArguments);
		throw error;
	});
}

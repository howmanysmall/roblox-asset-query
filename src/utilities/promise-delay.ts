export default function promiseDelay(delay: number): Promise<number> {
	return new Promise((resolve) => setTimeout(resolve, delay));
}

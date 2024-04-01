export default function deferred<T>() {
	let resolve: (value: PromiseLike<T> | T) => void;
	let reject: (reason?: any) => void;

	const promise = new Promise<T>((internalResolve, internalReject) => {
		resolve = internalResolve;
		reject = internalReject;
	});

	return {
		promise,
		reject: reject!,
		resolve: resolve!,
	};
}

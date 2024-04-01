import { useEffect, useState } from "react";

export default function useDebouncedValue<T>(value: T, delay: number) {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(
		function handleDelay() {
			const timer = setTimeout(() => setDebouncedValue(value), delay);
			return () => clearTimeout(timer);
		},
		[delay, value],
	);

	return debouncedValue;
}

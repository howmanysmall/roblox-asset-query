export function nullifyNull<T>(value?: T | null): T | undefined {
	return value === null ? undefined : value;
}

export function isNull<T>(value?: T | null): value is null | undefined {
	return value === null || value === undefined;
}

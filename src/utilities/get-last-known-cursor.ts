export namespace LastKnownCursor {
	export let lastKnownCursor: string | undefined;
	export async function getLastKnownCursor() {
		const file = Bun.file("LastKnownCursor.txt");
		const exists = await file.exists();

		if (exists) {
			const fileText = await file.text();
			const split = fileText.split("\n");

			let last = split.at(-1);
			if (!last) last = split.at(-2);
			// eslint-disable-next-line unicorn/prefer-logical-operator-over-ternary, unicorn/no-negated-condition
			return !last ? undefined : last;
		}

		return undefined;
	}
}

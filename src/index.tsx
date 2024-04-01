import { render, type Instance } from "ink";
import meow from "meow";
import React from "react";
import App from "./components/app";

const cli = meow(
	`
	Usage
	  $ roblox-asset-query

	Options
		--name  Your name

	Examples
	  $ roblox-asset-query --name=Jane
	  Hello, Jane
`,
	{
		flags: {
			name: {
				type: "string",
			},
		},
		importMeta: import.meta,
	},
);

// biome-ignore lint/style/useConst: necessary
let app: Instance; // eslint-disable-line prefer-const
function unmount() {
	app.unmount();
}
React;

app = render(<App key="App" unmount={unmount} />);

await app.waitUntilExit();

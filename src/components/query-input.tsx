import TextInput from "@inkkit/ink-text-input";
import { Box, Text } from "ink";
import React from "react";

export interface QueryInputProperties {
	readonly onChange: (query: string) => void;
	readonly placeholder: string;
	readonly query: string;
}

export function QueryInputNoMemo({ onChange, placeholder, query }: QueryInputProperties): React.ReactElement {
	return (
		<Box>
			<Text bold color="cyan" key="Text">
				›{" "}
			</Text>

			<TextInput key="TextInput" onChange={onChange} placeholder={placeholder} showCursor={false} value={query} />
		</Box>
	);
}

export const QueryInput = React.memo(QueryInputNoMemo);
QueryInput.displayName = "QueryInput";
export default QueryInput;

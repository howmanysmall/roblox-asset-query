import TextInput from "@inkkit/ink-text-input";
import { Text } from "ink";
import React, { useCallback } from "react";
import useAppStore, { AppStoreSelectors } from "../hooks/use-app-store";
import useInputStageStore, { InputStageSelectors } from "../hooks/use-input-stage";
import UnmountProvider from "../providers/unmount-provider";

export interface AppProperties extends React.PropsWithChildren {
	readonly unmount: () => void;
}

export function AppNoMemo({ unmount }: AppProperties): React.ReactElement {
	const inputState = useInputStageStore(InputStageSelectors.selectInputState);
	const proceedToNextState = useInputStageStore(InputStageSelectors.selectProceedToNextState);

	const cookie = useAppStore(AppStoreSelectors.selectRobloxCookie);
	const setCookie = useAppStore(AppStoreSelectors.selectSetRobloxCookie);

	const onSubmit = useCallback(() => {
		// if (inputState === InputState.Querying) {
		// 	unmount();
		// } else {
		// 	proceedToNextState();
		// }

		proceedToNextState();
		unmount();
	}, [proceedToNextState, unmount]);

	return (
		<UnmountProvider unmount={unmount}>
			<Text color="green">Enter your ROBLOSECURITY cookie.</Text>
			<TextInput
				focus
				key="TextInput"
				mask="*"
				onChange={setCookie}
				onSubmit={onSubmit}
				showCursor
				type="text"
				value={cookie}
			/>
		</UnmountProvider>
	);
}

export const App = React.memo(AppNoMemo);
App.displayName = "App";
export default App;

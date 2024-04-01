import { create } from "zustand";
import InputState from "../meta/input-state";

interface InputStageState {
	readonly inputState: InputState;
	readonly proceedToNextState: () => void;
}

export const useInputStageStore = create<InputStageState>((setState) => ({
	inputState: InputState.RequestCookie,
	proceedToNextState: () =>
		setState((currentState) => {
			switch (currentState.inputState) {
				case InputState.RequestCookie:
					return { inputState: InputState.RequestAssetType };

				case InputState.RequestAssetType:
					return { inputState: InputState.UseLastCursor };

				case InputState.UseLastCursor:
					return { inputState: InputState.WriteLocation };

				case InputState.WriteLocation:
					return { inputState: InputState.Querying };

				default:
					return currentState;
			}
		}),
}));

export default useInputStageStore;

export namespace InputStageSelectors {
	export function selectInputState(state: InputStageState) {
		return state.inputState;
	}
	export function selectProceedToNextState(state: InputStageState) {
		return state.proceedToNextState;
	}
}

import { create } from "zustand";
import AssetType from "../meta/asset-type";

interface AppState {
	readonly assetType: AssetType;
	readonly robloxCookie: string;
	readonly setAssetType: (assetType: AssetType) => void;
	readonly setRobloxCookie: (robloxCookie: string) => void;
	readonly setWriteLocation: (writeLocation: string) => void;
	readonly writeLocation: string;
}

export const useAppStore = create<AppState>((setState) => ({
	assetType: AssetType.None,
	robloxCookie: "",
	setAssetType: (assetType) => setState({ assetType }),
	setRobloxCookie: (robloxCookie) => setState({ robloxCookie }),
	setWriteLocation: (writeLocation) => setState({ writeLocation }),
	writeLocation: "",
}));

export default useAppStore;

export namespace AppStoreSelectors {
	export function selectAssetType(state: AppState) {
		return state.assetType;
	}
	export function selectRobloxCookie(state: AppState) {
		return state.robloxCookie;
	}
	export function selectWriteLocation(state: AppState) {
		return state.writeLocation;
	}

	export function selectSetAssetType(state: AppState) {
		return state.setAssetType;
	}
	export function selectSetRobloxCookie(state: AppState) {
		return state.setRobloxCookie;
	}
	export function selectSetWriteLocation(state: AppState) {
		return state.setWriteLocation;
	}
}

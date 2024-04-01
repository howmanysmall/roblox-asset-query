import React from "react";
import UnmountContext from "../contexts/unmount-context";

export interface UnmountProviderProperties extends React.PropsWithChildren {
	readonly unmount: () => void;
}

export function UnmountProviderNoMemo({ children, unmount }: UnmountProviderProperties): React.ReactElement {
	return <UnmountContext.Provider value={unmount}>{children}</UnmountContext.Provider>;
}

export const UnmountProvider = React.memo(UnmountProviderNoMemo);
UnmountProvider.displayName = "UnmountProvider";
export default UnmountProvider;

import React from "react";

export const UnmountContext = React.createContext<() => void>(undefined!);
UnmountContext.displayName = "UnmountContext";
export default UnmountContext;

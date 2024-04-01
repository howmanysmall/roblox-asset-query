import { useContext } from "react";
import UnmountContext from "../contexts/unmount-context";

export default function useUnmount() {
	const unmount = useContext(UnmountContext);
	if (unmount === undefined) {
		const exception = new Error("useUnmount must be used under a <UnmountProvider>.");
		Error.captureStackTrace(exception, useUnmount);
		throw exception;
	}

	return unmount;
}

import React from "react";

export function QueryCookieNoMemo(): React.ReactElement {
	return <></>;
}

export const QueryCookie = React.memo(QueryCookieNoMemo);
QueryCookie.displayName = "QueryCookie";
export default QueryCookie;

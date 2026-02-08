/**
 * File: src/components/Container/Container.jsx
 * Description: Simple layout container providing max-width and horizontal
 * padding used across pages.
 */

import React from "react";

function Container({ children }) {
	return <div className="w-full max-w-7xl mx-auto px-4">{children}</div>;
}

export default Container;

/**
 * File: src/hooks/useDocTitle.js
 * Description: React hook to set the document title for each page. Accepts a
 * title string and updates document.title while optionally restoring the
 * previous title on unmount.
 */

import { useEffect } from "react";

/**
 * Sets the document title. Resets to default on unmount.
 * @param {string} title - The page title
 */
export default function useDocTitle(title) {
	useEffect(() => {
		const prev = document.title;
		document.title = title ? `${title} — DEVBLOG` : "DEVBLOG";
		return () => {
			document.title = prev;
		};
	}, [title]);
}

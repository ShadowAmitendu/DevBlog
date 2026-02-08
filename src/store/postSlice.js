/**
 * File: src/store/postSlice.js
 * Description: Redux slice that caches posts with a short TTL to reduce
 * Appwrite requests. Exposes actions to set/clear posts and selectors to
 * check cache freshness.
 */

import { createSlice } from "@reduxjs/toolkit";

/**
 * Redux slice for caching fetched posts.
 * Avoids repeated Appwrite API calls when navigating between pages.
 */

const initialState = {
	posts: [],
	lastFetched: null, // timestamp of last fetch
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const postSlice = createSlice({
	name: "posts",
	initialState,
	reducers: {
		setPosts: (state, action) => {
			state.posts = action.payload;
			state.lastFetched = Date.now();
		},
		clearPosts: (state) => {
			state.posts = [];
			state.lastFetched = null;
		},
	},
});

/**
 * Returns true if cached posts are still fresh (< 5 min old).
 */
export const selectIsCacheFresh = (state) => {
	const { lastFetched } = state.posts;
	if (!lastFetched) return false;
	return Date.now() - lastFetched < CACHE_DURATION;
};

export const { setPosts, clearPosts } = postSlice.actions;
export default postSlice.reducer;

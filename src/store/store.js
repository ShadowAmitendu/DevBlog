/**
 * File: src/store/store.js
 * Description: Redux store setup combining auth and post reducers. Export the
 * configured store for use with React-Redux Provider.
 */

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import postReducer from "./postSlice";

const store = configureStore({
	reducer: {
		auth: authReducer,
		posts: postReducer,
	},
});

export default store;

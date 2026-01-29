import { createSlice } from "@reduxjs/toolkit";

/**
 * @typedef {Object} User
 * @property {string} $id - The user's unique ID
 * @property {string} name - The user's display name
 * @property {string} email - The user's email address
 * @property {boolean} emailVerification - Whether the user's email is verified
 * @property {string} $createdAt - Account creation timestamp
 * @property {string} $updatedAt - Account last update timestamp
 */

/**
 * @typedef {Object} AuthState
 * @property {boolean} isAuthenticated - Whether the user is currently logged in
 * @property {User|null} user - The current user's data or null if not logged in
 */

/** @type {AuthState} */
const initialState = {
	isAuthenticated: false,
	user: null,
};

/**
 * Redux slice for managing authentication state.
 * Handles user login/logout and stores user information.
 */
const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		/**
		 * Sets the user as authenticated and stores their data.
		 * @param {AuthState} state - The current auth state
		 * @param {Object} action - The action object
		 * @param {Object} action.payload - The payload containing user data
		 * @param {User} action.payload.user - The authenticated user's data
		 */
		login: (state, action) => {
			state.isAuthenticated = true;
			state.user = action.payload.user;
		},

		/**
		 * Clears the authentication state and removes user data.
		 * @param {AuthState} state - The current auth state
		 */
		logout: (state) => {
			state.isAuthenticated = false;
			state.user = null;
		},
	},
});

export const { login, logout } = authSlice.actions;

// /**
//  * Selector to get the current user from state.
//  * @param {Object} state - The Redux root state
//  * @returns {User|null} The current user or null
//  */
// export const selectUser = (state) => state.auth.user;

// /**
//  * Selector to check if user is authenticated.
//  * @param {Object} state - The Redux root state
//  * @returns {boolean} Whether the user is authenticated
//  */
// export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export default authSlice.reducer;

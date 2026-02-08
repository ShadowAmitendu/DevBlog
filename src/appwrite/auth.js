/**
 * File: src/appwrite/auth.js
 * Description: Authentication helper wrapping Appwrite Account operations
 * (createAccount, login, logout, getCurrentUser). Returns normalized errors
 * and uses the shared client instance.
 */

import { Account, ID } from "appwrite";
import client from "./client.js";

/**
 * Custom error class for authentication service errors.
 * @class AuthServiceError
 * @extends Error
 */
class AuthServiceError extends Error {
	/**
	 * @param {string} method - The method where the error occurred
	 * @param {string} message - The error message
	 * @param {Error} [originalError] - The original error that was caught
	 */
	constructor(method, message, originalError = null) {
		super(message);
		this.name = "AuthServiceError";
		this.method = method;
		this.originalError = originalError;
		this.code = originalError?.code || null;
		this.timestamp = new Date().toISOString();
	}
}

/**
 * Handles and logs errors consistently across the auth service.
 * @param {string} method - The method name where error occurred
 * @param {Error} error - The caught error
 * @param {Object} [context={}] - Additional context about the operation (avoid sensitive data)
 * @returns {AuthServiceError} The formatted error
 */
const handleError = (method, error, context = {}) => {
	const errorMessage = error?.message || "Unknown error occurred";
	const errorCode = error?.code || "UNKNOWN";

	console.error(`[AuthService] ${method} failed`, {
		errorCode,
		errorMessage,
		context,
		timestamp: new Date().toISOString(),
	});

	return new AuthServiceError(method, errorMessage, error);
};

/**
 * AuthService class handles all authentication operations using Appwrite.
 * Provides methods for user registration, login, session management, and logout.
 *
 * @class AuthService
 */
export class AuthService {
	/** @type {Account} */
	account;

	/**
	 * Initializes the Account service with the shared client instance.
	 * @constructor
	 */
	constructor() {
		this.account = new Account(client);
	}

	/**
	 * Creates a new user account and automatically logs them in.
	 *
	 * @async
	 * @param {Object} params - The account creation parameters
	 * @param {string} params.name - The user's display name
	 * @param {string} params.email - The user's email address
	 * @param {string} params.password - The user's password (min 8 characters)
	 * @returns {Promise<Object|null>} The session object if successful, null if creation fails
	 * @throws {AuthServiceError} If account creation fails critically
	 */
	async createAccount({ name, email, password }) {
		try {
			const userAccount = await this.account.create({
				userId: ID.unique(),
				email,
				password,
				name,
			});

			if (userAccount) {
				return await this.login({ email, password });
			}
			return null;
		} catch (error) {
			const authError = handleError("createAccount", error, { email, name });
			throw authError;
		}
	}

	/**
	 * Logs in a user with email and password.
	 *
	 * @async
	 * @param {Object} params - The login parameters
	 * @param {string} params.email - The user's email address
	 * @param {string} params.password - The user's password
	 * @returns {Promise<Object|null>} The session object if successful, null if login fails
	 */
	async login({ email, password }) {
		try {
			return await this.account.createEmailPasswordSession({ email, password });
		} catch (error) {
			handleError("login", error, { email });
			return null;
		}
	}

	/**
	 * Retrieves the currently logged-in user's account details.
	 *
	 * @async
	 * @returns {Promise<Object|null>} The user object if logged in, null otherwise
	 */
	async getCurrentUser() {
		try {
			return await this.account.get();
		} catch (error) {
			// Don't log as error for "not logged in" scenarios (expected behavior)
			if (error?.code === 401) {
				console.debug("[AuthService] No active session");
			} else {
				handleError("getCurrentUser", error);
			}
			return null;
		}
	}

	/**
	 * Logs out the user by deleting all their sessions.
	 *
	 * @async
	 * @returns {Promise<boolean>} True if logout was successful, false otherwise
	 */
	async logout() {
		try {
			await this.account.deleteSessions();
			return true;
		} catch (error) {
			handleError("logout", error);
			return false;
		}
	}
}

/** @type {AuthService} */
const authService = new AuthService();

export default authService;

import { Client, Account, ID } from "appwrite";
import conf from "../conf/conf.js";

/**
 * AuthService class handles all authentication operations using Appwrite.
 * Provides methods for user registration, login, session management, and logout.
 */
export class AuthService {
	client = new Client();
	account;

	/**
	 * Initializes the Appwrite client with endpoint and project configuration.
	 */
	constructor() {
		this.client
			.setEndpoint(conf.appWriteURL)
			.setProject(conf.appWriteProjectID);

		this.account = new Account(this.client);
	}

	/**
	 * Creates a new user account and automatically logs them in.
	 * @param {Object} params - The account creation parameters.
	 * @param {string} params.name - The user's display name.
	 * @param {string} params.email - The user's email address.
	 * @param {string} params.password - The user's password (min 8 characters).
	 * @returns {Promise<Object>} The session object if successful.
	 * @throws {Error} If account creation fails.
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
			} else {
				console.log("ERROR OCCURED");
				return userAccount;
			}
		} catch (error) {
			console.log("APPWRITE ERROR :: createAccount :: ERROR ->", error);
			throw error;
		}
	}

	/**
	 * Logs in a user with email and password.
	 * @param {Object} params - The login parameters.
	 * @param {string} params.email - The user's email address.
	 * @param {string} params.password - The user's password.
	 * @returns {Promise<Object>} The session object if successful.
	 * @throws {Error} If login fails.
	 */
	async login({ email, password }) {
		try {
			return await this.account.createEmailPasswordSession({ email, password });
		} catch (error) {
			console.log("APPWRITE ERROR :: login :: ERROR ->", error);
		}
		return null;
	}

	/**
	 * Retrieves the currently logged-in user's account details.
	 * @returns {Promise<Object|null>} The user object if logged in, null otherwise.
	 */
	async getCurrentUser() {
		try {
			return await this.account.get();
		} catch (error) {
			console.log("APPWRITE ERROR :: getCurrentUser :: ERROR ->", error);
		}
		return null;
	}

	/**
	 * Logs out the user by deleting all their sessions.
	 * @returns {Promise<Object|null>} The response object if successful, null otherwise.
	 */
	async logout() {
		try {
			return await this.account.deleteSessions();
		} catch (error) {
			console.log("APPWRITE ERROR :: logout :: ERROR ->", error);
		}
		return null;
	}
}

const authService = new AuthService();

export default authService;

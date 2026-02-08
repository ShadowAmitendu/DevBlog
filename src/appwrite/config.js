/**
 * File: src/appwrite/config.js
 * Description: Appwrite wrapper providing database and storage helper methods
 * (createBlog, updateBlog, uploadFile, deleteFile, etc.). Centralizes error
 * handling and maps app logic to Appwrite SDK calls.
 */

import { ID, Databases, Query, Storage } from "appwrite";
import client from "./client.js";
import conf from "../conf/conf.js";

/**
 * Custom error class for database service errors.
 * @class DatabaseServiceError
 * @extends Error
 */
class DatabaseServiceError extends Error {
	/**
	 * @param {string} method - The method where the error occurred
	 * @param {string} message - The error message
	 * @param {Error} [originalError] - The original error that was caught
	 */
	constructor(method, message, originalError = null) {
		super(message);
		this.name = "DatabaseServiceError";
		this.method = method;
		this.originalError = originalError;
		this.code = originalError?.code || null;
		this.timestamp = new Date().toISOString();
	}
}

/**
 * Handles and logs errors consistently across the service.
 * @param {string} method - The method name where error occurred
 * @param {Error} error - The caught error
 * @param {Object} [context={}] - Additional context about the operation
 * @returns {DatabaseServiceError} The formatted error
 */
const handleError = (method, error, context = {}) => {
	const errorMessage = error?.message || "Unknown error occurred";
	const errorCode = error?.code || "UNKNOWN";

	console.error(`[DatabaseService] ${method} failed`, {
		errorCode,
		errorMessage,
		context,
		timestamp: new Date().toISOString(),
	});

	return new DatabaseServiceError(method, errorMessage, error);
};

/**
 * @typedef {Object} BlogData
 * @property {string} title - The title of the blog post
 * @property {string} slug - The unique slug/identifier for the blog post
 * @property {string} content - The main content of the blog post
 * @property {string} featuredImage - The file ID of the featured image
 * @property {string} status - The publication status ('active' or 'inactive')
 * @property {string} userId - The ID of the user who created the blog
 */

/**
 * Service class for interacting with Appwrite Databases and Storage.
 * Provides methods for CRUD operations on blog posts and file management.
 *
 * @class DatabaseService
 */
export class DatabaseService {
	/** @type {Databases} */
	databases;

	/** @type {Storage} */
	bucket;

	/**
	 * Initializes Databases and Storage services with the shared client instance.
	 * This ensures authenticated sessions are automatically included in all requests.
	 * @constructor
	 */
	constructor() {
		this.databases = new Databases(client);
		this.bucket = new Storage(client);
	}

	/**
	 * Creates a new blog post in the database.
	 *
	 * @async
	 * @param {Object} params - The blog post parameters
	 * @param {string} params.title - The title of the blog post
	 * @param {string} params.slug - The unique slug used as the document ID
	 * @param {string} params.content - The main content of the blog post
	 * @param {string} params.featuredImage - The file ID of the featured image
	 * @param {string} params.status - The publication status ('active' or 'inactive')
	 * @param {string} params.userId - The ID of the user creating the blog
	 * @returns {Promise<Object|null>} The created blog document or null if creation fails
	 */
	async createBlog({
		title,
		slug,
		content,
		featuredImage,
		status,
		userId,
		authorName,
	}) {
		try {
			return await this.databases.createDocument({
				databaseId: conf.appWriteDatabaseID,
				collectionId: conf.appWriteCollectionID,
				documentId: slug,
				data: {
					title,
					content,
					featuredImage,
					status,
					userId,
					authorName: authorName || "Anonymous",
				},
			});
		} catch (error) {
			handleError("createBlog", error, { slug, title, userId });
			return null;
		}
	}

	/**
	 * Updates an existing blog post in the database.
	 *
	 * @async
	 * @param {string} slug - The unique slug/document ID of the blog to update
	 * @param {Object} params - The blog post parameters to update
	 * @param {string} params.title - The updated title
	 * @param {string} params.content - The updated content
	 * @param {string} params.featuredImage - The updated featured image file ID
	 * @param {string} params.status - The updated publication status
	 * @returns {Promise<Object|null>} The updated blog document or null if update fails
	 */
	async updateBlog(
		slug,
		{ title, content, featuredImage, status, authorName },
	) {
		try {
			return await this.databases.updateDocument({
				databaseId: conf.appWriteDatabaseID,
				collectionId: conf.appWriteCollectionID,
				documentId: slug,
				data: {
					title,
					content,
					featuredImage,
					status,
					authorName,
				},
			});
		} catch (error) {
			handleError("updateBlog", error, { slug, title });
			return null;
		}
	}

	/**
	 * Deletes a blog post from the database.
	 *
	 * @async
	 * @param {string} slug - The unique slug/document ID of the blog to delete
	 * @returns {Promise<boolean>} True if deletion was successful, false otherwise
	 */
	async deleteBlog(slug) {
		try {
			await this.databases.deleteDocument({
				databaseId: conf.appWriteDatabaseID,
				collectionId: conf.appWriteCollectionID,
				documentId: slug,
			});
			return true;
		} catch (error) {
			handleError("deleteBlog", error, { slug });
			return false;
		}
	}

	/**
	 * Retrieves a single blog post by its slug.
	 *
	 * @async
	 * @param {string} slug - The unique slug/document ID of the blog to retrieve
	 * @returns {Promise<Object|null>} The blog document data or null if retrieval fails
	 */
	async getBlog(slug) {
		try {
			return await this.databases.getDocument({
				databaseId: conf.appWriteDatabaseID,
				collectionId: conf.appWriteCollectionID,
				documentId: slug,
			});
		} catch (error) {
			handleError("getBlog", error, { slug });
			return null;
		}
	}

	/**
	 * Lists blog posts with optional query filters.
	 *
	 * @async
	 * @param {string[]} [queries=[Query.equal("status", "active")]] - Array of query strings for filtering
	 * @returns {Promise<Object|null>} Object containing documents array and total count, or null if listing fails
	 */
	async listBlogs(queries = [Query.equal("status", "active")]) {
		try {
			return await this.databases.listDocuments({
				databaseId: conf.appWriteDatabaseID,
				collectionId: conf.appWriteCollectionID,
				queries,
			});
		} catch (error) {
			handleError("listBlogs", error, { queries });
			return null;
		}
	}

	/**
	 * Uploads a file to the Appwrite storage bucket.
	 *
	 * @async
	 * @param {File} file - The file object to upload
	 * @returns {Promise<Object|null>} The uploaded file object or null if upload fails
	 */
	async uploadFile(file) {
		try {
			return await this.bucket.createFile({
				bucketId: conf.appWriteBucketID,
				fileId: ID.unique(),
				file,
			});
		} catch (error) {
			handleError("uploadFile", error, {
				fileName: file?.name,
				fileSize: file?.size,
			});
			return null;
		}
	}

	/**
	 * Deletes a file from the Appwrite storage bucket.
	 *
	 * @async
	 * @param {string} fileId - The ID of the file to delete
	 * @returns {Promise<boolean>} True if deletion was successful, false otherwise
	 */
	async deleteFile(fileId) {
		try {
			await this.bucket.deleteFile({
				bucketId: conf.appWriteBucketID,
				fileId,
			});
			return true;
		} catch (error) {
			handleError("deleteFile", error, { fileId });
			return false;
		}
	}

	/**
	 * Gets a view URL for a file to display in the browser.
	 *
	 * @param {string} fileId - The ID of the file to view
	 * @returns {URL|null} The view URL or null if retrieval fails
	 */
	getFileView(fileId) {
		try {
			return this.bucket.getFileView({
				bucketId: conf.appWriteBucketID,
				fileId,
			});
		} catch (error) {
			handleError("getFileView", error, { fileId });
			return null;
		}
	}
}

/** @type {DatabaseService} */
const databaseService = new DatabaseService();
export default databaseService;

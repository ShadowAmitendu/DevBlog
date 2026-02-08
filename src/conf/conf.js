/**
 * File: src/conf/conf.js
 * Description: Central configuration values pulled from environment variables
 * (Appwrite endpoints, project IDs, database/collection/bucket IDs). Keep
 * sensitive values in .env and reference via Vite env variables.
 */

const conf = {
	appWriteURL: String(import.meta.env.VITE_APPWRITE_URL),
	appWriteProjectID: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
	appWriteDatabaseID: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
	appWriteCollectionID: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID),
	appWriteBucketID: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
};

export default conf;

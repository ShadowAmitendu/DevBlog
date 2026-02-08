/**
 * File: src/appwrite/client.js
 * Description: Creates and exports a single Appwrite client instance configured
 * with project and endpoint from configuration. Used across Appwrite services
 * to ensure session persistence and consistent configuration.
 */

import { Client } from "appwrite";
import conf from "../conf/conf.js";

/**
 * Shared Appwrite client instance.
 * This ensures all services (Auth, Database, Storage) share the same session state.
 * The SDK maintains session cookies automatically when using a single client instance.
 */
const client = new Client()
	.setEndpoint(conf.appWriteURL)
	.setProject(conf.appWriteProjectID);

export default client;

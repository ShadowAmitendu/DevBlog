import { Client, ID, Databases, Query, Storage } from "appwrite";
import conf from "../conf/conf.js";

export class DatabaseService {
	client = new Client();
	databases;
	bucket;

	constructor() {
		this.client
			.setEndpoint(conf.appWriteURL)
			.setProject(conf.appWriteProjectID);
		this.databases = new Databases(this.client);
		this.bucket = new Storage(this.client);
	}

	async createBlog({ title, slug, content, featuredImage, status, userId }) {
		try {
			return await this.databases.createDocument(
				conf.appWriteDatabaseID,
				conf.appWriteCollectionID,
				slug,
				{
					title,
					content,
					featuredImage,
					status,
					userId,
				},
			);
		} catch (error) {
			console.log("APPWRITE ERROR :: createBlog :: ERROR ->", error);
		}
		return null;
	}

	async updateBlog(slug, { blogId, title, content, featuredImage, status }) {
		try {
			return await this.databases.update(
				conf.appWriteDatabaseID,
				conf.appWriteCollectionID,
				slug,
				{
					title,
					content,
					featuredImage,
					status,
				},
			);
		} catch (error) {
			console.log("APPWRITE ERROR :: updateBlog :: ERROR ->", error);
		}
	}
	async deleteBlog
}

const databaseService = new DatabaseService();
export default databaseService;

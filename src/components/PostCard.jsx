/**
 * File: src/components/PostCard.jsx
 * Description: Visual card component for displaying a single post preview
 * (image + title). Links to the post detail page.
 */

import React from "react";
import appwriteService from "../appwrite/config";
import { Link } from "react-router-dom";

function PostCard({ $id, title, featuredImage }) {
	return (
		<Link to={`/post/${$id}`}>
			<div className="w-full bg-white border-4 border-[#2c3e50] overflow-hidden shadow-[4px_4px_0px_0px_rgba(44,62,80,1)] hover:shadow-[8px_8px_0px_0px_rgba(44,62,80,1)] hover:-translate-x-1 hover:-translate-y-1 active:shadow-none active:translate-x-0 active:translate-y-0">
				<div className="w-full aspect-video bg-[#bdc3c7] overflow-hidden">
					<img
						src={appwriteService.getFileView(featuredImage)}
						alt={title}
						className="w-full h-full object-cover"
					/>
				</div>
				<div className="p-4 bg-white border-t-4 border-[#2c3e50]">
					<h2 className="text-lg font-black text-[#2c3e50] uppercase tracking-tight line-clamp-2">
						{title}
					</h2>
				</div>
			</div>
		</Link>
	);
}

export default PostCard;

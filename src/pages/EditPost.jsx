/**
 * File: src/pages/EditPost.jsx
 * Description: Page for editing an existing blog post. Loads post data and
 * renders PostForm in edit mode.
 */

import React, { useEffect, useState } from "react";
import { Container, PostForm } from "../components";
import appwriteService from "../appwrite/config";
import { useNavigate, useParams } from "react-router-dom";
import useDocTitle from "../hooks/useDocTitle";

function EditPost() {
	const [post, setPosts] = useState(null);
	useDocTitle(post ? `Edit — ${post.title}` : "Edit Post");
	const { slug } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		if (slug) {
			appwriteService.getBlog(slug).then((post) => {
				if (post) {
					setPosts(post);
				}
			});
		} else {
			navigate("/");
		}
	}, [slug, navigate]);
	return post ? (
		<div className="py-8">
			<Container>
				<h1 className="text-3xl font-black text-[#2c3e50] uppercase tracking-tight mb-8">
					Edit Post
				</h1>
				<PostForm post={post} />
			</Container>
		</div>
	) : (
		<div className="w-full py-16 flex justify-center">
			<div className="w-12 h-12 bg-[#3498db] border-b-4 border-[#2980b9] animate-bounce"></div>
		</div>
	);
}

export default EditPost;

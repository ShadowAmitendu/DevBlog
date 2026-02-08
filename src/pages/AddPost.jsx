import React from "react";
import { Container, PostForm } from "../components";
import useDocTitle from "../hooks/useDocTitle";

function AddPost() {
	useDocTitle("Create Post");
	return (
		<div className="py-8">
			<Container>
				<h1 className="text-3xl font-black text-[#2c3e50] uppercase tracking-tight mb-8">
					Create Post
				</h1>
				<PostForm />
			</Container>
		</div>
	);
}

export default AddPost;

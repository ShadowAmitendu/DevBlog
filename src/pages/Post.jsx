import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector, useDispatch } from "react-redux";
import { clearPosts } from "../store/postSlice";
import useDocTitle from "../hooks/useDocTitle";

export default function Post() {
	const [post, setPost] = useState(null);
	useDocTitle(post ? post.title : "Loading...");
	const { slug } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const userData = useSelector((state) => state.auth.userData);

	const isAuthor = post && userData ? post.userId === userData.$id : false;

	useEffect(() => {
		if (slug) {
			appwriteService.getBlog(slug).then((post) => {
				if (post) setPost(post);
				else navigate("/");
			});
		} else navigate("/");
	}, [slug, navigate]);

	const deletePost = () => {
		appwriteService.deleteBlog(post.$id).then((status) => {
			if (status) {
				appwriteService.deleteFile(post.featuredImage);
				dispatch(clearPosts()); // invalidate cache
				navigate("/");
			}
		});
	};

	return post ? (
		<div className="py-8">
			<Container>
				{/* Featured Image */}
				<div className="w-full flex justify-center mb-8 relative border-4 border-[#2c3e50] bg-white shadow-[8px_8px_0px_0px_rgba(44,62,80,1)]">
					<img
						src={appwriteService.getFileView(post.featuredImage)}
						alt={post.title}
						className="w-full max-h-125 object-cover"
					/>

					{isAuthor && (
						<div className="absolute right-4 top-4 flex gap-3">
							<Link to={`/edit-post/${post.$id}`}>
								<Button bgColor="bg-[#27ae60]" className="mr-0">
									Edit
								</Button>
							</Link>
							<Button bgColor="bg-[#e74c3c]" onClick={deletePost}>
								Delete
							</Button>
						</div>
					)}
				</div>

				{/* Title */}
				<div className="w-full mb-8">
					<h1 className="text-4xl font-black text-[#2c3e50] uppercase tracking-tight">
						{post.title}
					</h1>
					<p className="mt-2 text-sm font-bold text-[#7f8c8d] uppercase tracking-wide">
						By{" "}
						<span className="text-[#2980b9]">
							{post.authorName || (isAuthor && userData?.name) || "Anonymous"}
						</span>
					</p>
					<div className="h-2 w-24 bg-[#2980b9] mt-4"></div>
				</div>

				{/* Content: isolate author HTML in an iframe to avoid global CSS interference */}
				<div className="bg-white border-4 border-[#2c3e50] p-8 shadow-[4px_4px_0px_0px_rgba(44,62,80,1)]">
					<div className="w-full">
						<iframe
							ref={iframeRef}
							title="post-content"
							srcDoc={post.content}
							className="w-full"
							style={{ border: "none", width: "100%" }}
							onLoad={() => {
								try {
									const doc = iframeRef.current?.contentWindow?.document;
									if (doc) {
										iframeRef.current.style.height =
											doc.body.scrollHeight + "px";
									}
								} catch (e) {
									// ignore cross-origin or timing errors
								}
							}}
						/>
					</div>
				</div>
			</Container>
		</div>
	) : null;
}

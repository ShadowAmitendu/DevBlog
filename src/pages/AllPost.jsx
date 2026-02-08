import React, { useState, useEffect } from "react";
import { Container, PostCard } from "../components";
import appwriteService from "../appwrite/config";
import { useSelector, useDispatch } from "react-redux";
import {
	setPosts as cachePostsAction,
	selectIsCacheFresh,
} from "../store/postSlice";
import useDocTitle from "../hooks/useDocTitle";

function AllPosts() {
	useDocTitle("All Posts");
	const [loading, setLoading] = useState(true);
	const cachedPosts = useSelector((state) => state.posts.posts);
	const isCacheFresh = useSelector(selectIsCacheFresh);
	const dispatch = useDispatch();

	const posts = cachedPosts;

	useEffect(() => {
		// Skip API call if cache is fresh
		if (isCacheFresh && cachedPosts.length > 0) {
			setLoading(false);
			return;
		}

		setLoading(true);
		appwriteService
			.listBlogs([])
			.then((response) => {
				if (response && response.documents) {
					dispatch(cachePostsAction(response.documents));
				} else {
					dispatch(cachePostsAction([]));
				}
			})
			.catch(() => {
				dispatch(cachePostsAction([]));
			})
			.finally(() => {
				setLoading(false);
			});
	}, [isCacheFresh, cachedPosts.length, dispatch]);

	if (loading) {
		return (
			<div className="w-full py-16 text-center">
				<Container>
					<div className="flex justify-center">
						<div className="w-12 h-12 bg-[#3498db] border-b-4 border-[#2980b9] animate-bounce"></div>
					</div>
				</Container>
			</div>
		);
	}

	return (
		<div className="w-full py-8">
			<Container>
				<h1 className="text-3xl font-black text-[#2c3e50] uppercase tracking-tight mb-8">
					All Posts
				</h1>
				{posts && posts.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{posts.map((post) => (
							<PostCard key={post.$id} {...post} />
						))}
					</div>
				) : (
					<div className="bg-white border-4 border-[#2c3e50] p-12 text-center">
						<h2 className="text-2xl font-black text-[#7f8c8d] uppercase">
							No Posts Found
						</h2>
						<div className="h-2 w-16 bg-[#3498db] mx-auto mt-4"></div>
					</div>
				)}
			</Container>
		</div>
	);
}

export default AllPosts;

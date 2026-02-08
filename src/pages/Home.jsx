import React, { useEffect, useState } from "react";
import appwriteService from "../appwrite/config";
import { Container, PostCard } from "../components";
import { useSelector, useDispatch } from "react-redux";
import {
	setPosts as cachePostsAction,
	selectIsCacheFresh,
} from "../store/postSlice";
import useDocTitle from "../hooks/useDocTitle";

function Home() {
	useDocTitle("Home");
	const [loading, setLoading] = useState(true);
	const authStatus = useSelector((state) => state.auth.status);
	const cachedPosts = useSelector((state) => state.posts.posts);
	const isCacheFresh = useSelector(selectIsCacheFresh);
	const dispatch = useDispatch();

	// Local posts state derived from cache
	const posts = cachedPosts;

	useEffect(() => {
		if (!authStatus) {
			setLoading(false);
			return;
		}

		// Skip API call if cache is fresh
		if (isCacheFresh && cachedPosts.length > 0) {
			setLoading(false);
			return;
		}

		setLoading(true);
		appwriteService
			.listBlogs()
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
	}, [authStatus, isCacheFresh, cachedPosts.length, dispatch]);

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

	if (!posts || posts.length === 0) {
		return (
			<div className="w-full py-8 mt-4 text-center">
				<Container>
					<div className="flex flex-wrap justify-center">
						<div className="p-8 w-full max-w-2xl">
							<div className="bg-white border-4 border-[#2c3e50] p-12">
								<h1 className="text-4xl font-black text-[#2c3e50] uppercase tracking-tight mb-4">
									{authStatus ? "No Posts Yet" : "Login to Read Posts"}
								</h1>
								<div className="h-2 w-24 bg-[#3498db] mx-auto"></div>
								{!authStatus && (
									<p className="mt-6 text-[#7f8c8d] text-lg font-medium">
										Please sign in to view all blog posts
									</p>
								)}
							</div>
						</div>
					</div>
				</Container>
			</div>
		);
	}
	return (
		<div className="w-full py-8">
			<Container>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{posts.map((post) => (
						<PostCard key={post.$id} {...post} />
					))}
				</div>
			</Container>
		</div>
	);
}

export default Home;

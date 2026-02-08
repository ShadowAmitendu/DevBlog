import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import { useSelector, useDispatch } from "react-redux";
import { clearPosts } from "../store/postSlice";
import useDocTitle from "../hooks/useDocTitle";

export default function Post() {
	const [post, setPost] = useState(null);
	const [loading, setLoading] = useState(true);
	useDocTitle(post?.title || "Loading...");

	const { slug } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const iframeRef = useRef(null);

	const userData = useSelector((state) => state.auth.userData);
	const isAuthor = post && userData ? post.userId === userData.$id : false;

	useEffect(() => {
		if (!slug) {
			navigate("/");
			return;
		}

		setLoading(true);
		appwriteService
			.getBlog(slug)
			.then((post) => {
				if (post) {
					setPost(post);
				} else {
					navigate("/");
				}
			})
			.catch(() => navigate("/"))
			.finally(() => setLoading(false));
	}, [slug, navigate]);

	const deletePost = async () => {
		if (!window.confirm("Are you sure you want to delete this post?")) return;

		try {
			const status = await appwriteService.deleteBlog(post.$id);
			if (status) {
				await appwriteService.deleteFile(post.featuredImage);
				dispatch(clearPosts());
				navigate("/");
			}
		} catch (error) {
			console.error("Failed to delete post:", error);
		}
	};

	const resizeIframe = () => {
		try {
			const iframe = iframeRef.current;
			const doc = iframe?.contentWindow?.document;
			if (doc && iframe) {
				const height = Math.max(
					doc.body.scrollHeight,
					doc.documentElement.scrollHeight,
					doc.body.offsetHeight,
					doc.documentElement.offsetHeight,
				);
				iframe.style.height = `${height}px`;
			}
		} catch {
			// Cross-origin or other errors - ignore
		}
	};

	const handleIframeLoad = () => {
		resizeIframe();
		setTimeout(resizeIframe, 100);
		setTimeout(resizeIframe, 500);
		setTimeout(resizeIframe, 1000);
	};

	if (loading) {
		return (
			<div className="py-8">
				<Container>
					<div className="flex justify-center items-center min-h-100">
						<div className="text-lg">Loading...</div>
					</div>
				</Container>
			</div>
		);
	}

	if (!post) return null;

	const iframeContent = `
    <!DOCTYPE html>
    <html style="height: auto;">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            max-width: 100%;
          }

          html, body {
            height: auto;
            overflow: visible;
            overflow-wrap: break-word;
            word-wrap: break-word;
          }

          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            line-height: 1.7;
            color: #2c3e50;
            padding: 0;
            margin: 0;
            font-size: 16px;
          }

          h1, h2, h3, h4, h5, h6 {
            margin: 1.2em 0 0.6em;
            font-weight: 700;
            line-height: 1.3;
            overflow-wrap: break-word;
            word-wrap: break-word;
          }

          h1 { font-size: 2em; }
          h2 { font-size: 1.5em; }
          h3 { font-size: 1.25em; }

          p {
            margin: 0.8em 0;
            overflow-wrap: break-word;
            word-wrap: break-word;
          }

          ul, ol {
            margin: 0.8em 0;
            padding-left: 2em;
          }

          li {
            margin: 0.3em 0;
            overflow-wrap: break-word;
            word-wrap: break-word;
          }

          img {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 1em 0;
            border-radius: 4px;
          }

          a {
            color: #2980b9;
            text-decoration: underline;
            overflow-wrap: break-word;
            word-wrap: break-word;
          }

          a:hover {
            color: #1a5490;
          }

          pre {
            white-space: pre-wrap;
            overflow-wrap: break-word;
            word-wrap: break-word;
            background: #f5f5f5;
            padding: 1em;
            border-radius: 4px;
            margin: 1em 0;
          }

          code {
            background: #f5f5f5;
            padding: 0.2em 0.4em;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
          }

          blockquote {
            border-left: 4px solid #ddd;
            padding-left: 1em;
            margin: 1em 0;
            color: #666;
            font-style: italic;
          }

          table {
            border-collapse: collapse;
            width: 100%;
            margin: 1em 0;
          }

          th, td {
            border: 1px solid #ddd;
            padding: 0.5em;
            text-align: left;
          }

          th {
            background: #f5f5f5;
            font-weight: 600;
          }
        </style>
      </head>
      <body>${post.content}</body>
    </html>
  `;

	return (
		<div className="py-8">
			<Container>
				<div className="max-w-4xl mx-auto">
					{/* Featured Image */}
					<div className="mb-8 rounded-xl overflow-hidden shadow-lg">
						<img
							src={appwriteService.getFileView(post.featuredImage)}
							alt={post.title}
							className="w-full h-auto object-cover"
						/>
					</div>

					{/* Action Buttons */}
					{isAuthor && (
						<div className="flex gap-3 mb-6">
							<Link to={`/edit-post/${post.$id}`}>
								<Button bgColor="bg-green-500" className="hover:bg-green-600">
									Edit
								</Button>
							</Link>
							<Button
								bgColor="bg-red-500"
								className="hover:bg-red-600"
								onClick={deletePost}>
								Delete
							</Button>
						</div>
					)}

					{/* Title */}
					<h1 className="text-4xl font-bold mb-4 text-gray-900">
						{post.title}
					</h1>

					{/* Author Info */}
					<div className="text-gray-600 mb-8 pb-6 border-b border-gray-200">
						By{" "}
						<span className="font-medium text-gray-800">
							{post.authorName || (isAuthor && userData?.name) || "Anonymous"}
						</span>
					</div>

					{/* Content */}
					<div className="prose max-w-none">
						<iframe
							ref={iframeRef}
							srcDoc={iframeContent}
							title="Post Content"
							className="w-full border-0"
							style={{
								border: "none",
								width: "100%",
								display: "block",
								minHeight: "200px",
							}}
							onLoad={handleIframeLoad}
							sandbox="allow-same-origin"
						/>
					</div>
				</div>
			</Container>
		</div>
	);
}

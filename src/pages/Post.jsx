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
            font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.8;
            color: #374151;
            padding: 20px;
            margin: 0;
            font-size: 1.125rem;
            background-color: #ffffff;
          }

          h1, h2, h3, h4, h5, h6 {
            color: #111827;
            margin: 2em 0 0.8em;
            font-weight: 800;
            line-height: 1.3;
            letter-spacing: -0.025em;
          }

          h1 { font-size: 2.25em; margin-top: 0; }
          h2 { font-size: 1.75em; border-bottom: 2px solid #e5e7eb; padding-bottom: 0.3em; }
          h3 { font-size: 1.5em; }

          p { margin: 1.25em 0; }

          a {
            color: #2563eb;
            text-decoration: none;
            border-bottom: 1px solid transparent;
            transition: border-color 0.2s;
          }
          a:hover { border-bottom-color: #2563eb; }

          img {
            border-radius: 8px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            margin: 2em auto;
          }

          code {
            background-color: #f3f4f6;
            color: #ec4899;
            padding: 0.25rem 0.375rem;
            border-radius: 0.375rem;
            font-size: 0.875em;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          }

          pre {
            background-color: #1f2937;
            color: #f3f4f6;
            padding: 1.25rem;
            border-radius: 0.5rem;
            overflow-x: auto;
            margin: 1.5em 0;
          }
          pre code {
            background-color: transparent;
            color: inherit;
            padding: 0;
            border-radius: 0;
          }

          blockquote {
            font-style: italic;
            border-left: 4px solid #e5e7eb;
            padding-left: 1.5em;
            margin: 1.5em 0;
            color: #4b5563;
          }

          ul, ol { padding-left: 1.5em; margin: 1.25em 0; }
          li { margin: 0.5em 0; padding-left: 0.3em; }
          li::marker { color: #9ca3af; }


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

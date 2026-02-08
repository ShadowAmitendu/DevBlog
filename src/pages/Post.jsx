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
			/* ignore */
		}
	};

	const handleIframeLoad = () => {
		resizeIframe();
		[100, 500, 1000].forEach((delay) => setTimeout(resizeIframe, delay));
	};

	if (loading) {
		return (
			<div className="py-8 bg-[#ecf0f1] min-h-screen flex items-center justify-center">
				<div className="w-16 h-16 bg-[#2980b9] border-b-8 border-[#1f6391] animate-bounce"></div>
			</div>
		);
	}

	if (!post) return null;

	// --- 2D Flat Styling for Iframe Content ---
	const iframeContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html { width: 100%; height: 100%; }
          body {
            font-family: system-ui, -apple-system, sans-serif;
            line-height: 1.6;
            color: #2c3e50;
            background-color: transparent;
            font-size: clamp(14px, 4vw, 1.1rem);
            overflow: hidden;
            word-wrap: break-word;
            overflow-wrap: break-word;
            word-break: break-word;
            width: 100%;
            padding: 0;
            margin: 0;
          }
          p {
            margin-bottom: 1.5rem;
            word-wrap: break-word;
            overflow-wrap: break-word;
            word-break: break-word;
          }
          h1, h2, h3 {
            color: #2c3e50;
            text-transform: uppercase;
            font-weight: 900;
            margin: 1.5rem 0 0.8rem;
            letter-spacing: -0.02em;
            word-wrap: break-word;
            overflow-wrap: break-word;
            word-break: break-word;
            font-size: clamp(1.2rem, 5vw, 2rem);
          }
          h1 { font-size: clamp(1.5rem, 6vw, 2.5rem); }
          h2 {
            border-left: 8px solid #2980b9;
            padding-left: 0.8rem;
            font-size: clamp(1.25rem, 5vw, 1.8rem);
          }
          h3 { font-size: clamp(1.1rem, 4.5vw, 1.5rem); }
          img {
            border: 4px solid #2c3e50;
            display: block;
            margin: 2rem auto;
            max-width: 100%;
            width: 100%;
            height: auto;
          }
          blockquote {
            background: #ecf0f1;
            border: 2px solid #2c3e50;
            padding: 1rem;
            margin: 1.5rem 0;
            font-weight: bold;
            word-wrap: break-word;
            overflow-wrap: break-word;
            word-break: break-word;
          }
          code {
            background: #2c3e50;
            color: #ecf0f1;
            padding: 2px 4px;
            font-size: 0.9em;
            word-wrap: break-word;
            overflow-wrap: break-word;
            word-break: break-word;
          }
          pre {
            background: #2c3e50;
            color: #ecf0f1;
            padding: 0.8rem;
            overflow-x: hidden;
            border-bottom: 6px solid #2980b9;
            word-wrap: break-word;
            overflow-wrap: break-word;
            word-break: break-word;
            white-space: pre-wrap;
            font-size: 0.85rem;
          }
          a {
            color: #2980b9;
            text-decoration: underline;
            word-wrap: break-word;
            overflow-wrap: break-word;
            word-break: break-word;
          }
          ul, ol {
            margin: 1.2rem 0;
            padding-left: 1.5rem;
            overflow-wrap: break-word;
            word-wrap: break-word;
          }
          li {
            margin: 0.3rem 0;
            overflow-wrap: break-word;
            word-wrap: break-word;
            word-break: break-word;
          }
          /* Text alignment (from react-quill) */
          .ql-align-left { text-align: left; }
          .ql-align-center { text-align: center; }
          .ql-align-right { text-align: right; }
          .ql-align-justify { text-align: justify; }
        </style>
      </head>
      <body>${post.content}</body>
    </html>
  `;

	return (
		<div className="py-8 bg-[#ecf0f1] min-h-screen">
			<Container>
				<div className="max-w-4xl mx-auto">
					{/* Featured Image - Sticker style */}
					<div className="mb-8 border-4 border-[#2c3e50] bg-white p-2 shadow-[10px_10px_0px_0px_rgba(44,62,80,1)]">
						<img
							src={appwriteService.getFileView(post.featuredImage)}
							alt={post.title}
							className="w-full h-auto block border-2 border-[#2c3e50]"
						/>
					</div>

					{/* Author & Header Block */}
					<div className="bg-white border-4 border-[#2c3e50] p-8 mb-8 shadow-[8px_8px_0px_0px_rgba(44,62,80,1)]">
						<h1 className="text-5xl font-black uppercase tracking-tighter text-[#2c3e50] leading-none mb-4">
							{post.title}
						</h1>
						<div className="flex items-center gap-2">
							<span className="bg-[#2980b9] text-white text-[10px] font-black px-2 py-1 uppercase">
								Author
							</span>
							<span className="font-bold text-[#2c3e50] uppercase text-sm tracking-widest">
								{post.authorName || (isAuthor && userData?.name) || "Anonymous"}
							</span>
						</div>
					</div>

					{/* Action Buttons - Tactile 2D Style */}
					{isAuthor && (
						<div className="flex gap-4 mb-8">
							<Link to={`/edit-post/${post.$id}`}>
								<Button className="bg-[#27ae60] hover:bg-[#2ecc71] border-b-4 border-[#219150] active:border-b-0 active:mt-1 font-black uppercase text-white px-8">
									Edit Post
								</Button>
							</Link>
							<Button
								onClick={deletePost}
								className="bg-[#e74c3c] hover:bg-[#ff5e57] border-b-4 border-[#c0392b] active:border-b-0 active:mt-1 font-black uppercase text-white px-8">
								Delete
							</Button>
						</div>
					)}

					{/* Main Content Box */}
					<div className="bg-white border-4 border-[#2c3e50] p-6 md:p-10 shadow-[8px_8px_0px_0px_rgba(44,62,80,1)] mb-12">
						<iframe
							ref={iframeRef}
							srcDoc={iframeContent}
							title="Post Content"
							className="w-full border-0"
							style={{ width: "100%", display: "block", minHeight: "200px" }}
							onLoad={handleIframeLoad}
						/>
					</div>
				</div>
			</Container>
		</div>
	);
}

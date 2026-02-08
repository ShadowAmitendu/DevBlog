/**
 * File: src/components/post-form/PostForm.jsx
 * Description: Post creation/edit form with image compression, preview,
 * status select and validation. Integrates with Appwrite services for file
 * upload and blog creation/update.
 */

import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearPosts } from "../../store/postSlice";
import imageCompression from "browser-image-compression";

export default function PostForm({ post }) {
	const {
		register,
		handleSubmit,
		setValue,
		control,
		getValues,
		formState: { errors },
	} = useForm({
		defaultValues: {
			title: post?.title || "",
			slug: post?.$id || "",
			content: post?.content || "",
			status: post?.status || "active",
		},
	});

	const navigate = useNavigate();
	const userData = useSelector((state) => state.auth.userData);
	const dispatch = useDispatch();

	const [preview, setPreview] = useState(null);
	const [compressing, setCompressing] = useState(false);
	const [compressedFile, setCompressedFile] = useState(null);
	const [compressionInfo, setCompressionInfo] = useState(null);
	const [submitting, setSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState(null);

	const compressImage = async (file) => {
		setCompressing(true);
		setCompressionInfo(null);
		try {
			const originalSize = file.size;
			const compressed = await imageCompression(file, {
				maxSizeMB: 1,
				maxWidthOrHeight: 1920,
				useWebWorker: true,
			});
			const newSize = compressed.size;
			const saved = Math.round((1 - newSize / originalSize) * 100);
			setCompressionInfo({
				original: (originalSize / 1024).toFixed(0),
				compressed: (newSize / 1024).toFixed(0),
				saved,
			});
			// Ensure it's a proper File (not just a Blob) for Appwrite
			const compressedAsFile = new File([compressed], file.name, {
				type: compressed.type || file.type,
				lastModified: Date.now(),
			});
			setCompressedFile(compressedAsFile);
		} catch (err) {
			console.error("Compression failed, using original:", err);
			setCompressedFile(file);
			setCompressionInfo(null);
		} finally {
			setCompressing(false);
		}
	};

	const handleImageChange = (e) => {
		const file = e.target.files?.[0];
		if (file) {
			// Show preview immediately
			const url = URL.createObjectURL(file);
			setPreview(url);
			// Compress in background
			compressImage(file);
		} else {
			setPreview(null);
			setCompressedFile(null);
			setCompressionInfo(null);
		}
	};

	const submit = async (data) => {
		const imageToUpload = compressedFile || data.image?.[0];
		setSubmitting(true);
		setSubmitError(null);

		try {
			if (post) {
				const file = imageToUpload
					? await appwriteService.uploadFile(imageToUpload)
					: null;

				if (file) {
					appwriteService.deleteFile(post.featuredImage);
				}

				const dbPost = await appwriteService.updateBlog(post.$id, {
					...data,
					featuredImage: file ? file.$id : undefined,
				});

				if (dbPost) {
					dispatch(clearPosts());
					navigate(`/post/${dbPost.$id}`);
				}
			} else {
				if (!imageToUpload) {
					setSubmitError("Please select a featured image.");
					setSubmitting(false);
					return;
				}
				const file = await appwriteService.uploadFile(imageToUpload);

				if (file) {
					const fileId = file.$id;
					data.featuredImage = fileId;
					const dbPost = await appwriteService.createBlog({
						...data,
						userId: userData.$id,
					});

					if (dbPost) {
						dispatch(clearPosts());
						navigate(`/post/${dbPost.$id}`);
					}
				}
			}
		} catch (err) {
			console.error("Submit failed:", err);
			setSubmitError("Something went wrong. Please try again.");
		} finally {
			setSubmitting(false);
		}
	};

	const slugTransform = useCallback((value) => {
		if (value && typeof value === "string")
			return value
				.trim()
				.toLowerCase()
				.replace(/[^a-zA-Z\d\s]+/g, "-")
				.replace(/\s/g, "-");

		return "";
	}, []);

	return (
		<form
			onSubmit={handleSubmit(submit)}
			className="flex flex-col lg:flex-row gap-6">
			{/* Left Column: Content Area */}
			<div className="w-full lg:w-2/3">
				<div className="bg-white border-4 border-[#2c3e50] p-6 shadow-[8px_8px_0px_0px_rgba(44,62,80,1)]">
					{/* Validation / submit errors */}
					{(Object.keys(errors).length > 0 || submitError) && (
						<div className="mb-6 border-2 border-[#e74c3c] bg-[#fdeaea] p-4">
							<p className="font-black uppercase text-xs tracking-wider text-[#e74c3c] mb-1">
								⚠ Attention
							</p>
							{errors.title && (
								<p className="text-sm text-[#c0392b] font-bold">
									• Title is required
								</p>
							)}
							{errors.slug && (
								<p className="text-sm text-[#c0392b] font-bold">
									• Slug is required
								</p>
							)}
							{errors.status && (
								<p className="text-sm text-[#c0392b] font-bold">
									• Status is required
								</p>
							)}
							{submitError && (
								<p className="text-sm text-[#c0392b] font-bold">
									• {submitError}
								</p>
							)}
						</div>
					)}

					<Input
						label="Title :"
						placeholder="Enter an catchy title"
						className="mb-6 border-2 border-[#2c3e50] rounded-none focus:bg-[#ecf0f1]"
						{...register("title", {
							required: true,
							onChange: (e) => {
								setValue("slug", slugTransform(e.target.value), {
									shouldValidate: true,
								});
							},
						})}
					/>
					<Input
						label="Slug :"
						placeholder="slug-url-here"
						className="mb-6 border-2 border-[#2c3e50] rounded-none focus:bg-[#ecf0f1]"
						{...register("slug", { required: true })}
						onInput={(e) => {
							setValue("slug", slugTransform(e.currentTarget.value), {
								shouldValidate: true,
							});
						}}
					/>
					<RTE
						label="Content :"
						name="content"
						control={control}
						defaultValue={getValues("content")}
					/>
				</div>
			</div>

			{/* Right Column: Settings Area */}
			<div className="w-full lg:w-1/3">
				<div className="bg-white border-4 border-[#2c3e50] p-6 shadow-[8px_8px_0px_0px_rgba(44,62,80,1)] sticky top-24">
					{/* Image upload with hidden register for react-hook-form validation */}
					<input
						type="hidden"
						{...register("image", {
							required: !post && !compressedFile,
						})}
					/>
					<label className="block font-black uppercase text-xs tracking-wider text-[#2c3e50] mb-2">
						Featured Image :
					</label>
					<input
						type="file"
						accept="image/png, image/jpg, image/jpeg, image/gif, image/webp"
						onChange={handleImageChange}
						className="mb-2 w-full border-2 border-[#2c3e50] rounded-none bg-white px-3 py-2 text-sm file:bg-[#2c3e50] file:text-white file:border-none file:px-4 file:py-2 file:font-bold file:uppercase file:text-xs cursor-pointer focus:bg-[#ecf0f1] outline-none"
					/>

					{/* Compression progress */}
					{compressing && (
						<div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase text-[#2980b9]">
							<svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
									fill="none"
								/>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
								/>
							</svg>
							Compressing image…
						</div>
					)}

					{/* Compression result info */}
					{compressionInfo && !compressing && (
						<div className="mb-4 bg-[#ecf0f1] border-2 border-[#2c3e50] p-2 text-xs font-bold">
							<span className="text-[#e74c3c] line-through">
								{compressionInfo.original} KB
							</span>
							{" → "}
							<span className="text-[#27ae60]">
								{compressionInfo.compressed} KB
							</span>
							<span className="ml-1 text-[#2c3e50]">
								({compressionInfo.saved}% saved)
							</span>
						</div>
					)}

					{/* Image preview — new upload takes priority, then existing post image */}
					{(preview || (post && post.featuredImage)) && (
						<div className="w-full mb-6 border-4 border-[#2c3e50] overflow-hidden">
							<img
								src={preview || appwriteService.getFileView(post.featuredImage)}
								alt={post?.title || "Preview"}
								className="w-full h-auto block"
							/>
							<div className="bg-[#2c3e50] text-white text-[10px] font-black uppercase p-1 text-center">
								{preview ? "New Image Preview" : "Current Preview"}
							</div>
						</div>
					)}

					<Select
						options={["active", "inactive"]}
						label="Status :"
						className="mb-6"
						{...register("status", { required: true })}
					/>

					<Button
						type="submit"
						disabled={compressing || submitting}
						className={`w-full font-black uppercase py-4 border-b-4 transition-all active:border-b-0 active:mt-1 ${
							compressing || submitting
								? "bg-gray-400 border-gray-500 cursor-not-allowed"
								: post
									? "bg-[#27ae60] hover:bg-[#2ecc71] border-[#219150]"
									: "bg-[#2980b9] hover:bg-[#3498db] border-[#1f6391]"
						} text-white`}>
						{compressing
							? "Compressing…"
							: submitting
								? "Publishing…"
								: post
									? "Update Post"
									: "Publish Post"}
					</Button>
				</div>
			</div>
		</form>
	);
}

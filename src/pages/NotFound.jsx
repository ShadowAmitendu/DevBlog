import React from "react";
import { Link } from "react-router-dom";
import { Container } from "../components";
import useDocTitle from "../hooks/useDocTitle";

function NotFound() {
	useDocTitle("404 — Page Not Found");

	return (
		<div className="w-full py-16">
			<Container>
				<div className="flex justify-center">
					<div className="w-full max-w-lg text-center bg-white border-4 border-[#2c3e50] p-12 shadow-[12px_12px_0px_0px_rgba(44,62,80,1)]">
						<div className="text-8xl font-black text-[#2c3e50] leading-none mb-2">
							404
						</div>
						<div className="h-2 w-20 bg-[#e74c3c] mx-auto mb-6"></div>
						<h1 className="text-2xl font-black text-[#2c3e50] uppercase tracking-tight mb-4">
							Page Not Found
						</h1>
						<p className="text-[#7f8c8d] font-medium mb-8">
							The page you're looking for doesn't exist or has been moved.
						</p>
						<Link
							to="/"
							className="inline-block px-8 py-3 bg-[#2980b9] text-white font-black uppercase tracking-wide border-b-4 border-[#1f6391] hover:bg-[#3498db] active:border-b-0 active:mt-1">
							Go Home
						</Link>
					</div>
				</div>
			</Container>
		</div>
	);
}

export default NotFound;

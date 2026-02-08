/**
 * File: src/components/Logo.jsx
 * Description: Small presentational component rendering the site's logo.
 */

import React from "react";

function Logo({ className = "" }) {
	return (
		<div className={`flex items-center gap-2 select-none ${className}`}>
			{/* The "Icon" Block - 2D Square with sharp corners */}
			<div className="bg-[#2980b9] text-[#ecf0f1] font-black text-xl w-10 h-10 flex items-center justify-center border-b-4 border-[#1f6391]">
				{/* Simple geometric representation of code: </> */}
				<span className="mb-1">{"{"}</span>
				<span className="mb-1">{"}"}</span>
			</div>

			{/* The Typography - Bold and Flat */}
			<div className="flex flex-col leading-none">
				<span className="text-[#ecf0f1] font-black text-2xl tracking-tighter">
					DEV<span className="text-[#2980b9]">BLOG</span>
				</span>
				{/* Optional Subtitle - pure flat style */}
				<div className="h-1 w-full bg-[#e74c3c] mt-0.5"></div>
			</div>
		</div>
	);
}

export default Logo;

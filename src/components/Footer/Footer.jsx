/**
 * File: src/components/Footer/Footer.jsx
 * Description: Footer component displayed at the bottom of pages.
 */

import React from "react";
import { Logo } from "../index";

function Footer() {
	return (
		<footer className="mt-auto w-full bg-[#2c3e50] border-t-8 border-[#2980b9] py-4 text-[#ecf0f1]">
			<div className="max-w-7xl mx-auto px-6">
				<div className="flex flex-col md:flex-row justify-between items-center gap-6">
					{/* Brand Section */}
					<div className="flex items-center gap-4">
						<div className="bg-[#212f3d] p-2 border-2 border-[#2c3e50]">
							<Logo />
						</div>
					</div>

					{/* Copyright & Info Section */}
					<div className="flex flex-col md:items-end text-center md:text-right gap-1">
						<p className="text-[10px] font-black tracking-tight uppercase">
							&copy; {new Date().getFullYear()} All Rights Reserved
						</p>
						<p className="text-[9px] font-bold text-[#7f8c8d] tracking-widest uppercase">
							No Warranties • Just Code
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
}

export default Footer;

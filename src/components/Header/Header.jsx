/**
 * File: src/components/Header/Header.jsx
 * Description: Top navigation/header component with brand, navigation links
 * and logout button. Reflects authentication state and shows user actions.
 */

import React, { useState } from "react";
import { Container, Logo, LogoutBtn } from "../index";
import { Link, NavLink, useNavigate } from "react-router-dom";

/**
 * Note: Header is already documented at top of file.
 */
import { useSelector } from "react-redux";

function Header() {
	const authStatus = useSelector((state) => state.auth.status);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const navigate = useNavigate();

	const navItems = [
		{ name: "HOME", slug: "/", active: true },
		{ name: "LOGIN", slug: "/login", active: !authStatus },
		{ name: "SIGNUP", slug: "/signup", active: !authStatus },
		{ name: "ALL POSTS", slug: "/all-posts", active: authStatus },
		{ name: "ADD POST", slug: "/add-post", active: authStatus },
	];

	return (
		// Bold, flat background with no shadow (border used for separation)
		<header className="bg-[#2c3e50] border-b-4 border-[#2980b9] sticky top-0 z-50">
			<Container>
				<nav className="flex h-20 items-center justify-between">
					{/* Flat 2D Logo Section */}
					<div className="flex items-center">
						<Link to="/">
							<Logo />
						</Link>
					</div>

					{/* Desktop Navigation - Sharp Corners and Solid Colors */}
					<ul className="hidden md:flex items-center h-full">
						{navItems.map((item) =>
							item.active ? (
								<li key={item.name} className="h-full flex items-center">
									<NavLink
										to={item.slug}
										className={({ isActive }) =>
											`px-6 h-full flex items-center text-sm font-black tracking-widest transition-colors duration-150 ${
												isActive
													? "bg-[#2980b9] text-[#ecf0f1]" // Active: Solid Blue
													: "text-[#bdc3c7] hover:bg-[#34495e] hover:text-[#ecf0f1]" // Hover: Darker shade
											}`
										}>
										{item.name}
									</NavLink>
								</li>
							) : null,
						)}
						{authStatus && (
							<li className="ml-4">
								{/* Ensure LogoutBtn uses a flat style: bg-[#e74c3c] */}
								<LogoutBtn />
							</li>
						)}
					</ul>

					{/* Mobile Menu Toggle (Flat Style) */}
					<div className="md:hidden">
						<button
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className="p-2 bg-[#34495e] text-[#ecf0f1] active:bg-[#2980b9]">
							<svg
								className="h-8 w-8"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor">
								<path
									strokeLinecap="square"
									strokeLinejoin="miter"
									strokeWidth={3}
									d={
										isMenuOpen
											? "M6 18L18 6M6 6l12 12"
											: "M4 6h16M4 12h16M4 18h16"
									}
								/>
							</svg>
						</button>
					</div>
				</nav>

				{/* Mobile Dropdown Menu (Flat Blocks) */}
				{isMenuOpen && (
					<div className="md:hidden bg-[#34495e] border-t-2 border-[#2c3e50]">
						<ul className="flex flex-col">
							{navItems.map((item) =>
								item.active ? (
									<li key={item.name}>
										<button
											onClick={() => {
												navigate(item.slug);
												setIsMenuOpen(false);
											}}
											className="w-full text-left px-6 py-4 text-[#ecf0f1] font-bold border-b border-[#2c3e50] active:bg-[#2980b9]">
											{item.name}
										</button>
									</li>
								) : null,
							)}
							{authStatus && (
								<li className="p-4 bg-[#c0392b]">
									<LogoutBtn />
								</li>
							)}
						</ul>
					</div>
				)}
			</Container>
		</header>
	);
}

export default Header;

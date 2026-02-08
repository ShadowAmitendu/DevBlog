/**
 * File: src/components/Header/LogoutBtn.jsx
 * Description: Small logout button used in the header; dispatches logout and
 * clears client-side session state.
 */

import React from "react";
import { useDispatch } from "react-redux";
import authService from "../../appwrite/auth";
import { logout } from "../../store/authSlice";
import { clearPosts } from "../../store/postSlice";

function LogoutBtn() {
	const dispatch = useDispatch();
	const logoutHandler = () => {
		authService
			.logout()
			.then(() => {
				dispatch(clearPosts());
				dispatch(logout());
			})
			.catch((error) => {
				console.error("Logout failed:", error);
			});
	};
	return (
		<button
			className="inline-block px-5 py-2 bg-[#e74c3c] text-white font-black uppercase tracking-wide transition-all hover:bg-[#c0392b] active:translate-y-1"
			onClick={logoutHandler}>
			Logout
		</button>
	);
}

export default LogoutBtn;

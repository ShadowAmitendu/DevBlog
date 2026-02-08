import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import authService from "./appwrite/auth";
import { login, logout } from "./store/authSlice";
import { Header, Footer } from "./components/index.js";
import "./App.css";
import { Outlet } from "react-router-dom";

function App() {
	const [loading, setLoading] = useState(true);
	const dispatch = useDispatch();

	useEffect(() => {
		// getCurrentUser() calls Appwrite's GET /account.
		// If no session exists, Appwrite returns 401 — this is EXPECTED.
		// The browser will always show the 401 network error in the console;
		// this cannot be suppressed from JS. In production (no StrictMode),
		// it fires only once instead of twice.
		authService
			.getCurrentUser()
			.then((userData) => {
				if (userData) {
					dispatch(login(userData));
				} else {
					dispatch(logout());
				}
			})
			.finally(() => setLoading(false));
	}, [dispatch]);

	// --- 2D FLAT LOADING STATE ---
	if (loading) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center bg-[#2c3e50]">
				<div className="flex flex-col items-center gap-6">
					{/* Flat 2D Square Loader (No Gradients/Shadows) */}
					<div className="w-16 h-16 bg-[#3498db] border-b-8 border-[#2980b9] animate-bounce"></div>
					<p className="text-[#ecf0f1] text-2xl font-black tracking-[0.2em] uppercase">
						Loading...
					</p>
				</div>
			</div>
		);
	}

	return (
		// min-h-screen + flex-col ensures the footer sticks to the bottom
		<div className="min-h-screen flex flex-col bg-[#ecf0f1]">
			<Header />

			{/* flex-grow: pushes the footer down by taking all available space */}
			<main className="flex-grow">
				<Outlet />
			</main>

			<Footer />
		</div>
	);
}

export default App;

/**
 * File: src/components/Login.jsx
 * Description: Login form component used in authentication flow. Integrates
 * with Appwrite auth helpers and dispatches auth state on success.
 */

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as authLogin } from "../store/authSlice";
import { Button, Input, Logo } from "./index";
import { useDispatch } from "react-redux";
import authService from "../appwrite/auth";
import { useForm } from "react-hook-form";

function Login() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { register, handleSubmit } = useForm();
	const [error, setError] = useState("");

	const login = async (data) => {
		setError("");
		try {
			const session = await authService.login(data);
			if (session) {
				const userData = await authService.getCurrentUser();
				if (userData) dispatch(authLogin(userData));
				navigate("/");
			}
		} catch (error) {
			setError(error.message);
		}
	};

	return (
		<div className="flex items-center justify-center w-full py-8">
			{/* Container: Sharp corners, thick dark border, and a solid 2D shadow
			 */}
			<div className="mx-auto w-full max-w-lg bg-white border-4 border-[#2c3e50] p-10 shadow-[12px_12px_0px_0px_rgba(44,62,80,1)]">
				<div className="mb-6 flex justify-center">
					<span className="inline-block p-4 bg-[#2c3e50]">
						<Logo />
					</span>
				</div>

				<h2 className="text-center text-3xl font-black uppercase tracking-tighter text-[#2c3e50]">
					Sign in to your account
				</h2>

				<p className="mt-2 text-center text-sm font-bold text-[#7f8c8d] uppercase tracking-wide">
					Don&apos;t have an account?&nbsp;
					<Link
						to="/signup"
						className="text-[#2980b9] transition-all duration-150 hover:text-[#3498db] underline decoration-2 underline-offset-4">
						Sign Up
					</Link>
				</p>

				{/* Flat Error Box */}
				{error && (
					<div className="bg-[#e74c3c] border-2 border-[#c0392b] text-white p-3 mt-8 font-bold text-center uppercase text-xs tracking-widest">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit(login)} className="mt-8">
					<div className="space-y-6">
						<Input
							label="Email: "
							placeholder="Enter your email"
							type="email"
							{...register("email", {
								required: true,
								validate: {
									matchPatern: (value) =>
										/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
										"Email address must be a valid address",
								},
							})}
						/>

						<Input
							label="Password: "
							type="password"
							placeholder="Enter your password"
							{...register("password", {
								required: true,
							})}
						/>

						{/* Submit Button: Solid color, sharp corners,
                Ensure your Button component accepts these Flat UI classes
            */}
						<Button type="submit" className="w-full py-4 text-base">
							Sign in
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default Login;

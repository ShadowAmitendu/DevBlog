/**
 * File: src/components/Signup.jsx
 * Description: Signup form component that creates a new Appwrite account and
 * logs the user in on success. Validates required fields and reports errors.
 */

import React, { useState } from "react";
import authService from "../appwrite/auth";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../store/authSlice";
import { Button, Input, Logo } from "./index.js";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

function Signup() {
	const navigate = useNavigate();
	const [error, setError] = useState("");
	const dispatch = useDispatch();
	const { register, handleSubmit } = useForm();

	const create = async (data) => {
		setError("");
		try {
			const userData = await authService.createAccount(data);
			if (userData) {
				const currentUser = await authService.getCurrentUser();
				if (currentUser) dispatch(login(currentUser));
				navigate("/");
			}
		} catch (error) {
			setError(error.message);
		}
	};

	return (
		<div className="flex items-center justify-center w-full py-10">
			{/* 2D "Sticker" Container with Hard Shadow */}
			<div className="mx-auto w-full max-w-lg bg-white border-4 border-[#2c3e50] p-10 shadow-[12px_12px_0px_0px_rgba(44,62,80,1)]">
				<div className="mb-6 flex justify-center">
					<div className="mb-6 flex justify-center">
						<span className="inline-block p-4 bg-[#2c3e50]">
							<Logo />
						</span>
					</div>
				</div>

				<h2 className="text-center text-3xl font-black uppercase tracking-tighter text-[#2c3e50]">
					Create Account
				</h2>

				<p className="mt-2 text-center text-sm font-bold text-[#7f8c8d] uppercase tracking-wide">
					Already have an account?&nbsp;
					<Link
						to="/login"
						className="text-[#2980b9] transition-all duration-150 hover:text-[#3498db] underline decoration-2 underline-offset-4">
						Sign In
					</Link>
				</p>

				{/* Flat UI Error Block */}
				{error && (
					<div className="bg-[#e74c3c] border-2 border-[#c0392b] text-white p-3 mt-8 font-bold text-center uppercase text-xs tracking-widest">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit(create)} className="mt-8">
					<div className="space-y-6">
						<Input
							label="Full Name: "
							placeholder="Enter your full name"
							{...register("name", { required: true })}
						/>

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
							{...register("password", { required: true })}
						/>

						{/* Flat Action Button with Click Depth */}
						<Button
							type="submit"
							bgColor="bg-[#27ae60]"
							className="w-full py-4 text-base">
							Get Started
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default Signup;

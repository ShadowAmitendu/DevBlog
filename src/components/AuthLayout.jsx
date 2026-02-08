/**
 * File: src/components/AuthLayout.jsx
 * Description: Route protection / auth layout component. Redirects based on
 * authentication state and renders a loading skeleton while checking auth.
 */

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Protected({ children, authentication = true }) {
	const navigate = useNavigate();
	const [loader, setLoader] = useState(true);
	const authStatus = useSelector((state) => state.auth.status);

	useEffect(() => {
		//TODO: make it more easy to understand

		// if (authStatus ===true){
		//     navigate("/")
		// } else if (authStatus === false) {
		//     navigate("/login")
		// }

		//let authValue = authStatus === true ? true : false

		if (authentication && authStatus !== authentication) {
			navigate("/login");
		} else if (!authentication && authStatus !== authentication) {
			navigate("/");
		}
		setLoader(false);
	}, [authStatus, navigate, authentication]);

	return loader ? (
		<div className="w-full py-16 flex justify-center">
			<div className="flex flex-col items-center gap-4">
				<div className="w-12 h-12 bg-[#3498db] border-b-4 border-[#2980b9] animate-bounce"></div>
				<p className="text-[#2c3e50] font-black uppercase tracking-widest text-sm">
					Loading...
				</p>
			</div>
		</div>
	) : (
		<>{children}</>
	);
}

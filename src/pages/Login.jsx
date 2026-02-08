import React from "react";
import { Login as LoginComponent } from "../components";
import useDocTitle from "../hooks/useDocTitle";

function Login() {
	useDocTitle("Login");
	return (
		<div className="py-8">
			<LoginComponent />
		</div>
	);
}

export default Login;

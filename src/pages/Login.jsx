/**
 * File: src/pages/Login.jsx
 * Description: Page wrapper for the Login component; sets document title and
 * places the component inside the auth layout.
 */

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

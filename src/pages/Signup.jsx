/**
 * File: src/pages/Signup.jsx
 * Description: Page wrapper for the Signup component, providing layout and
 * document title.
 */

import React from "react";
import { Signup as SignupComponent } from "../components";
import useDocTitle from "../hooks/useDocTitle";

function Signup() {
	useDocTitle("Sign Up");
	return (
		<div className="py-8">
			<SignupComponent />
		</div>
	);
}

export default Signup;

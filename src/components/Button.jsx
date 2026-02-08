/**
 * File: src/components/Button.jsx
 * Description: Reusable 2D-flat style button component. Accepts styling props
 * and forwards events to the underlying button element.
 */

import React from "react";

const Button = ({
	children,
	type = "button",
	bgColor = "bg-[#2980b9]",
	textColor = "text-white",
	className = "",
	...props
}) => {
	return (
		<button
			type={type}
			className={`px-6 py-3 rounded-none border-b-4 border-[#2c3e50] font-black uppercase tracking-wide text-sm ${bgColor} ${textColor} hover:brightness-110 active:border-b-0 active:mt-1 ${className}`}
			{...props}>
			{children}
		</button>
	);
};

export default Button;

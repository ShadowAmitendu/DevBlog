/**
 * File: src/components/Input.jsx
 * Description: Styled input component matching the 2D flat design. Wraps a
 * native input and supports labels, validation, and custom className props.
 */

import React, { useId } from "react";

const Input = React.forwardRef(function Input(
	{ label, type = "text", className = "", ...props },
	ref,
) {
	const id = useId();
	return (
		<div className="w-full">
			{label && (
				<label
					className="inline-block mb-1 pl-1 font-bold uppercase text-xs tracking-widest text-[#2c3e50]"
					htmlFor={id}>
					{label}
				</label>
			)}
			<input
				type={type}
				className={`px-3 py-2 rounded-none bg-white text-[#2c3e50] outline-none focus:bg-[#ecf0f1] border-2 border-[#2c3e50] w-full font-medium ${className}`}
				ref={ref}
				{...props}
				id={id}
			/>
		</div>
	);
});

export default Input;

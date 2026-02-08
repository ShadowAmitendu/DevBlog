/**
 * File: src/components/Select.jsx
 * Description: Custom styled select component following the 2D flat UI. Wraps
 * a native select and provides a custom arrow indicator.
 */

import React, { useId } from "react";

function Select({ options, label, className = "", ...props }, ref) {
	const id = useId();
	return (
		<div className="w-full">
			{label && (
				<label
					htmlFor={id}
					className="inline-block mb-2 pl-1 font-black uppercase text-xs tracking-widest text-[#2c3e50]">
					{label}
				</label>
			)}

			<div className="relative">
				<select
					{...props}
					id={id}
					ref={ref}
					className={`
                        appearance-none
                        px-4 py-3
                        rounded-none
                        bg-white
                        text-[#2c3e50]
                        font-black
                        uppercase
                        outline-none
                        border-2
                        border-[#2c3e50]
                        focus:bg-[#ecf0f1]
                        transition-colors
                        duration-150
                        w-full
                        cursor-pointer
                        ${className}
                    `}>
					{options?.map((option) => (
						<option key={option} value={option} className="font-bold bg-white">
							{option.toUpperCase()}
						</option>
					))}
				</select>
			</div>
		</div>
	);
}

export default React.forwardRef(Select);

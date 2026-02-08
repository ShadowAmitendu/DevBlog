/**
 * File: src/components/RTE.jsx
 * Description: Rich text editor wrapper using react-quill-new. Exposes a
 * controlled editor component compatible with react-hook-form.
 */

import React from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { Controller } from "react-hook-form";

const modules = {
	toolbar: [
		[{ header: [1, 2, 3, 4, 5, 6, false] }],
		["bold", "italic", "underline", "strike"],
		[{ color: [] }, { background: [] }],
		[{ list: "ordered" }, { list: "bullet" }],
		[{ indent: "-1" }, { indent: "+1" }],
		[{ align: [] }],
		["blockquote", "code-block"],
		["link", "image"],
		["clean"],
	],
};

const formats = [
	"header",
	"bold",
	"italic",
	"underline",
	"strike",
	"color",
	"background",
	"list",
	"indent",
	"align",
	"blockquote",
	"code-block",
	"link",
	"image",
];

export default function RTE({ name, control, label, defaultValue = "" }) {
	return (
		<div className="w-full">
			{/* 2D Flat Label */}
			{label && (
				<label className="inline-block mb-3 pl-1 font-black uppercase text-xs tracking-[0.2em] text-[#2c3e50]">
					{label}
				</label>
			)}

			{/* Internal CSS to force Quill into a 2D Aesthetic */}
			<style>{`
        .ql-toolbar.ql-snow {
          border: 4px solid #2c3e50 !important;
          background-color: #ecf0f1 !important;
          border-bottom: none !important;
          padding: 8px !important;
        }
        .ql-container.ql-snow {
          border: 4px solid #2c3e50 !important;
          border-top: 4px solid #2c3e50 !important;
          font-family: inherit !important;
          font-size: 1rem !important;
          background: white !important;
        }
        .ql-editor {
          min-height: 350px !important;
        }
        .ql-snow.ql-toolbar button:hover, .ql-snow .ql-toolbar button:hover {
          color: #2980b9 !important;
          background: #dbe4e6 !important;
          border-radius: 0px !important;
        }
        .ql-snow .ql-stroke {
          stroke: #2c3e50 !important;
          stroke-width: 2px !important;
        }
      `}</style>

			<div className="relative border-b-8 border-r-8 border-[#bdc3c7]">
				<Controller
					name={name || "content"}
					control={control}
					render={({ field: { onChange, value } }) => (
						<ReactQuill
							theme="snow"
							value={value || defaultValue}
							onChange={onChange}
							modules={modules}
							formats={formats}
						/>
					)}
				/>
			</div>
		</div>
	);
}

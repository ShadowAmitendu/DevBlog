/**
 * File: src/main.jsx
 * Description: Application entry point. Sets up React Router and renders the
 * root component into the DOM. Imports global styles and providers.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./components/index.js";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home.jsx";
import { AuthLayout, Login } from "./components/index.js";

import AddPost from "./pages/AddPost";
import Signup from "./pages/Signup";
import EditPost from "./pages/EditPost";

import Post from "./pages/Post";

import AllPosts from "./pages/AllPost";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{
				path: "/",
				element: <Home />,
			},
			{
				path: "/login",
				element: (
					<AuthLayout authentication={false}>
						<Login />
					</AuthLayout>
				),
			},
			{
				path: "/signup",
				element: (
					<AuthLayout authentication={false}>
						<Signup />
					</AuthLayout>
				),
			},
			{
				path: "/all-posts",
				element: (
					<AuthLayout authentication>
						{" "}
						<AllPosts />
					</AuthLayout>
				),
			},
			{
				path: "/add-post",
				element: (
					<AuthLayout authentication>
						{" "}
						<AddPost />
					</AuthLayout>
				),
			},
			{
				path: "/edit-post/:slug",
				element: (
					<AuthLayout authentication>
						{" "}
						<EditPost />
					</AuthLayout>
				),
			},
			{
				path: "/post/:slug",
				element: <Post />,
			},
			{
				path: "*",
				element: <NotFound />,
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<Provider store={store}>
		<RouterProvider router={router} />
	</Provider>,
);

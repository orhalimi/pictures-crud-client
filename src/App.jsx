import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const imagesMock = [
	{
		name: "small cute cat",
		tags: ["cat", "cute", "small"],
		owner: "orhalimi",
	},
	{
		name: "big less cute cat",
		tags: ["cat", "not cute", "big"],
		owner: "orhalimi",
	},
];

function App() {
	const [files, setFiles] = useState([]);
	const [isLogin, setIsLogin] = useState(false);

	// useEffect(() => {
	// 	fbAutoLogin();
	// }, []);

	// function fbAutoLogin() {
	// 	if (window.FB === undefined) return setTimeout(fbAutoLogin, 200);
  //   console.log(window.FB);
	// 	window.FB.getLoginStatus(function (response) {
	// 		fbLoginHandler(response);
	// 	});
	// }

	function fbLoginHandler(response) {
		if (response.connect) return setIsLogin(true);
	}

	async function handleSubmit(event) {
		event.preventDefault();
		console.log(files);

		const formData = new FormData();
		for (let i = 0; i < files.length; i++) {
			formData.append(`images[]`, files[i], files.name);
		}

		formData.append("json", JSON.stringify({ meta: imagesMock }));
		const res = await axios.post("http://127.0.0.1:5000/images", formData, {
			headers: {
				"content-type": "multipart/form-data",
			},
		});
	}

	async function handleChange(event) {
		console.log(event);
		setFiles(event.target.files);
	}

	return (
		<div className="App">
			{isLogin ? (
				<form onSubmit={handleSubmit}>
					<label for="files">Select files:</label>
					<input
						type="file"
						id="files"
						name="files"
						multiple
						onChange={handleChange}
					/>
					<br />
					<br />
					<input type="submit" />
				</form>
			) : (
				<div
					class="fb-login-button"
					data-width=""
					data-size="large"
					data-button-type="login_with"
					data-layout="default"
					data-auto-logout-link="false"
					data-use-continue-as="true"
					data-scope="public_profile,email"
					data-onlogin={fbLoginHandler}
				></div>
			)}
		</div>
	);
}

export default App;

import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import axios from 'axios';
import { useState } from "react";


function Login(){
    const [data, setData] = useState({ email: "", password: "" });
	const [error, setError] = useState("");
    const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};
    const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = "https://localhost:7199/api/auth/login";
			const { data: res } = await axios.post(url, data);
			localStorage.setItem("token", 'Bearer ' + res.data);
			window.location = "/";
			console.log("Login success")
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message);
			}
		}
	};
    return(
        <div className="login_container">
			<div className={styles.login_form_container}>
				<div className={styles.left}>
					<form className={styles.form_container} onSubmit={handleSubmit}>
						<h1>Login to Your Account</h1>
						<input
							type="text"
							placeholder="username"
							name="username"
							onChange={handleChange}
							value={data.username}
							required
							className={styles.input}
						/>
						<input
							type="password"
							placeholder="Password"
							name="password"
							onChange={handleChange}
							value={data.password}
							required
							className={styles.input}
						/>
						{error && <div className={styles.error_msg}>{error}</div>}
						<button type="submit" className={styles.green_btn}>
							Sing In
						</button>
					</form>
				</div>
				<div className={styles.right}>
					<h1>New Here ?</h1>
					<Link to="/signup">
						<button type="button" className={styles.white_btn}>
							Sing Up
						</button>
					</Link>
				</div>
			</div>
		</div>
    )
}

export default Login
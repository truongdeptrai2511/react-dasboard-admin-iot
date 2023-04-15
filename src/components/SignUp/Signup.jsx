import React, { useState } from 'react';
import { Link, useNavigate} from "react-router-dom";
import styles from "./styles.module.css";
import axios from 'axios';

function Signup(){

    const [data, setData] = useState({
		userName: "",
		name: "",
		password: "",
		email: "",
        phoneNumber: "",
        address: ""
	});
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

    const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = "https://localhost:7199/api/auth/register/customer";
			const { data: res } = await axios.post(url, data);
			navigate("/login");
			console.log(res.message);
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
        <div className={styles.signup_container}>
            <div className={styles.signup_form_container}>
                <div className={styles.left}>
                    <h1>Welcome Back</h1>
                    <Link to="/login">
                        <button type="button" className={styles.white_btn}>
                            Sign in
                        </button>
                    </Link>
                </div>
                <div className={styles.right}>
                    <form className={styles.form_container} onSubmit={handleSubmit}>
                        <h3>Create Account</h3>
                        <input
                            type="text"
                            placeholder="UserName"
                            name="userName"
                            onChange={handleChange}
                            value={data.userName}
                            required
                            className={styles.input}
                        />
                        <input
                            type="text"
                            placeholder="Full Name"
                            name="name"
                            onChange={handleChange}
                            value={data.name}
                            required
                            className={styles.input}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            onChange={handleChange}
                            value={data.email}
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
                        <input
                            type="text"
                            placeholder="Phone number"
                            name="phoneNumber"
                            onChange={handleChange}
                            value={data.phoneNumber}
                            required
                            className={styles.input}
                        />
                        <input
                            type="text"
                            placeholder="Avatar"
                            name="avatar"
                            onChange={handleChange}
                            value={data.avatar}
                            required
                            className={styles.input}
                        />
                        <input
                            type="text"
                            placeholder="address"
                            name="address"
                            onChange={handleChange}
                            value={data.address}
                            required
                            className={styles.input}
                        />
                        {error && <div className={styles.error_msg}>{error}</div>}
                        <button type="submit" className={styles.green_btn}>
                            Sign Up
                        </button>
                        <Link to="/employeerequest" style={{textDecoration:"none", color:"#4da6ff"}}>
                            Employee registration
                        </Link>
                    </form>
                </div>
            </div>
        </div>
)
}

export default Signup
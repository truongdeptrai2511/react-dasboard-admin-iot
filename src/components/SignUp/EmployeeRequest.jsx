import styles from "./styles.module.css";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function EmployeeRequest() {
    const [data, setData] = useState({
		userName: "",
        name: "",
        email: "",
        role: "",
        phoneNumber: "",
        avatarLink: "",
        address: "",
        citizenIdentification: ""
	});
    const [error, setError] = useState("");
	const navigate = useNavigate();

    const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

    const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = "https://localhost:7199/api/Employee/request";
			const { data: res } = await axios.post(url, data);
            console.log("request success")
            alert("Request success, wait for approval")
			navigate("/login");
			console.log(res.message);
		} catch (error) {
			if (
                console.log(error.response),
                alert(error.response.data),
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message);
			}
		}
	};
    return (
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
                    <h3>Employee registration</h3>
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
                        type="text"
                        placeholder="employee"
                        name="role"
                        onChange={handleChange}
                        value={data.role = "employee"}
                        required
                        className={styles.input}
                        hidden
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
                        name="avatarLink"
                        onChange={handleChange}
                        value={data.avatarLink}
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
                    <input
                        type="text"
                        placeholder="CitizenIdentification"
                        name="citizenIdentification"
                        onChange={handleChange}
                        value={data.citizenIdentification}
                        required
                        className={styles.input}
                    />
                    {error && <div className={styles.error_msg}>{error}</div>}
                    <button type="submit" className={styles.green_btn}>
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    </div>
    )
}

export default EmployeeRequest
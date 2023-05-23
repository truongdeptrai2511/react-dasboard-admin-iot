import axios from "axios";
import React, {useState} from "react"
import styles from "../../SignUp/styles.module.css"
function RegisterAdmin (){
    const [data, setData] = useState({
		userName: "",
		fullName: "",
		password: ""
	});
	const [error, setError] = useState("");

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

    const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = "https://localhost:7199/api/auth/register/admin";
			const { data: res } = await axios.post(url, data, {headers: {Authorization: localStorage.getItem("token")}});
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
    return (
        <div className={styles.signup_container}>
        <div className={styles.signup_form_container}>
            <div className={styles.right}>
                <form className={styles.form_container} onSubmit={handleSubmit} autoComplete="off">
                    <h3>Create Account Admin</h3>
                    <input
                        type="text"
                        placeholder="Full Name"
                        name="name"
                        onChange={handleChange}
                        value={data.name}
                        required
                        className={styles.input}
                        autoComplete="off"
                        autoFocus
                    />
                    <input
                        autoComplete="off"
                        type="text"
                        placeholder="UserName"
                        name="userName"
                        onChange={handleChange}
                        value={data.userName}
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
                        autoComplete="off"
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

export default RegisterAdmin;
import styles from "./styles.scss";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


function ResetPassword(){
    const [data, setData] = useState({ oldPassword: "", newPassword: "", retypeNewPassword: "" });
	const [error, setError] = useState("");
    const UseNavigate = useNavigate();
    const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = "https://localhost:7199/api/auth/reset-password";
			UseNavigate("/");
			console.log("Change password success")
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				alert(error.response.data.message);
			}
		}
		window.location.reload();
	};

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
        if(input.name === "newPassword"){
            if(data.newPassword.length < 6){
                setError("Password must be at least 6 characters");
            }
            if(data.newPassword !== data.retypeNewPassword){
                setError("Password must be the same old password");
            }
            if(data.oldPassword === "" || data.newPassword === "" || data.retypeNewPassword === ""){
                setError("Please type password");
            }
        }
    }

    return (
        <form className="form-reset-pass" onSubmit={handleSubmit}>
        <input
            type="text"
            placeholder="Old password"
            name="oldPassword"
            onChange={handleChange}
            value={data.oldPassword}
            required
            className="form-reset-pass-inp"
        />
        <input
            type="password"
            placeholder="New password"
            name="newPassword"
            onChange={handleChange}
            value={data.newPassword}
            required
            className="form-reset-pass-inp"
        />
        <input 
            type="password"
            placeholder="Re-enter password"
            name="retypeNewPassword"
            onChange={handleChange}
            value={data.retypeNewPassword}
            required
            className="form-reset-pass-inp"
        />
        {error && <div className={styles.error_msg}>{error}</div>}
        <button type="submit" className="btn-reset-pass">
            Update
        </button>
    </form>
    )
}

export default ResetPassword
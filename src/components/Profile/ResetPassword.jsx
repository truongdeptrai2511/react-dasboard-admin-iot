import styles from "./styles.scss";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import GetJwtTokenClaim from "../../utils/JwtTokenClaim";

function ResetPassword() {
  const payload = GetJwtTokenClaim()
  const [data, setData] = useState({ email: `${payload.email}@gmail.com`, oldPassword: "", newPassword: "", retypeNewPassword: "" });
  const [errors, setErrors] = useState({
    oldPassword: '',
    newPassword: '',
    retypeNewPassword: '',
  });
  const navigate = useNavigate();

  const handleChange = ({ target }) => {
    setData(prevState => ({ ...prevState, [target.name]: target.value }));
  }

  const validate = () => {
    let isValid = true;
    const errorsCopy = { ...errors };

    // validate old password
    if (!data.oldPassword) {
      errorsCopy.oldPassword = 'Please enter your old password';
      isValid = false;
    } else {
      errorsCopy.oldPassword = '';
    }

    // validate new password
    if (!data.newPassword) {
      errorsCopy.newPassword = 'Please enter a new password';
      isValid = false;
    } else if (data.newPassword.length < 8) {
      errorsCopy.newPassword = 'Password must be at least 8 characters';
      isValid = false;
    } else {
      errorsCopy.newPassword = '';
    }

    // validate retype new password
    if (!data.retypeNewPassword) {
      errorsCopy.retypeNewPassword = 'Please re-enter your new password';
      isValid = false;
    } else if (data.newPassword !== data.retypeNewPassword) {
      errorsCopy.retypeNewPassword = 'Passwords do not match';
      isValid = false;
    } else {
      errorsCopy.retypeNewPassword = '';
    }

    setErrors(errorsCopy);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        console.log(data)
        const url = "https://localhost:7199/api/auth/reset-password";
        const requestData = { email: data.email, oldPassword: data.oldPassword, newPassword: data.newPassword };
        await axios.post(url, requestData)
        navigate("/");
        alert("Password changed successfully");
        console.log("Change password success")
        window.location.reload();
      } catch (error) {
        console.log(error.response);
        if (
          error.response &&
          error.response.status >= 400 &&
          error.response.status <= 500
        ) {
          alert(error.response.data.message);
        }
      }
    }
  };

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
      {errors.oldPassword && <div className={styles.error_msg}>{errors.oldPassword}</div>}
      {errors.newPassword && <div className={styles.error_msg}>{errors.newPassword}</div>}
      {errors.retypeNewPassword && <div className={styles.error_msg}>{errors.retypeNewPassword}</div>}
      <button type="submit" className="btn-reset-pass">
        Update
      </button>

    </form>
    )
}

export default ResetPassword
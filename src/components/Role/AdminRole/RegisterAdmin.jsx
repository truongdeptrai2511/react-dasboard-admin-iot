import axios from "axios";
import React, { useState, useRef } from "react";
import styles from "../../SignUp/styles.module.css";

function RegisterAdmin() {
  const [data, setData] = useState({
    fullName: "",
    userName: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);
  const fullNameInputRef = useRef(null);

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "https://localhost:7199/api/auth/register/admin";
      const response = await axios.post(url, data, {
        headers: {
          Authorization: localStorage.getItem("token")
        }
      });
      setRegistered(true);
      alert("Register successfully");
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
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
              name="fullName"
              onChange={handleChange}
              value={registered ? "" : data.fullName}
              required
              className={styles.input}
              autoComplete="off"
              autoFocus
              ref={fullNameInputRef}
            />
            <input
              autoComplete="off"
              type="text"
              placeholder="UserName"
              name="userName"
              onChange={handleChange}
              value={registered ? "" : data.userName}
              required
              className={styles.input}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={registered ? "" : data.password}
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
  );
}

export default RegisterAdmin;

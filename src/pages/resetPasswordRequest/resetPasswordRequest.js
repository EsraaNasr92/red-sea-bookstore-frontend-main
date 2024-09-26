import React, { useState } from "react";
import redsea from "../../images/redsea.png";
import "./resetPasswordRequest.css";
import * as userService from "../../services/user.services";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
const ResetPasswordRequest = () => {
  const [email, setEmail] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const alert = useAlert();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };


  const handleLogin = (e) => {
    // Implement your API call to authenticate the user here.
    // This is a simplified example.
    e.preventDefault();
    userService.requestResetPassword(email).then((res) => {
      if (res.error) {
        setLoginError(true);
        setLoginErrorMessage(
          Object.keys(res.details).length !== 0
            ? res.details
            : "Wrong email or password"
        );
        return;
      } else {
        setEmailSent(true);
        setTimeout(() => {
          setEmailSent(false);
        }, 5000);
      }
    });
  };

  return (
    <div className="login-container">
      <div className="logo-container">
        <Link to="/">
          <img src='https://redsea-books-assets.s3.eu-central-1.amazonaws.com/Asset+1%402x.png' alt="logo" className="signup-logo" />
        </Link>
      </div>
      <form className="login-form">
        <h2 className="login-title">Request Password Reset</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
          className="login-field"
        />
        {emailSent && <p className="success">Email Sent Successfully</p>}
        <button type="submit" className="login-button" onClick={handleLogin}>
          Request Reset Password
        </button>
        {loginError && <p className="error">{loginErrorMessage}</p>}
        <p className="message">
          Not registered? <Link to="/signup">Create an account</Link>
        </p>
      </form>
    </div>
  );
};

export default ResetPasswordRequest;

import React, { useState } from "react";
import redsea from "../../images/redsea.png";
import "./login.css";
import * as userService from "../../services/user.services";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState("");
  const alert = useAlert();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = (e) => {
    // Implement your API call to authenticate the user here.
    // This is a simplified example.
    e.preventDefault();
    userService.Login(email, password).then((res) => {
      if (res.error) {
        setLoginError(true);
        setLoginErrorMessage(
          Object.keys(res.details).length !== 0
            ? res.details
            : "Wrong email or password"
        );
        return;
      } else {
        if (res.data.isEmailConfirmed === false) {
          setLoginError(true);
          setLoginErrorMessage("Please confirm your email address");
          return;
        }
        else{
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("email", res.data.info.email);
        localStorage.setItem("id", res.data.info.id);
        localStorage.setItem("role", res.data.info.role);
        localStorage.setItem("name", res.data.info.name);
        localStorage.setItem("avatar", res.data.info.avatar);
        localStorage.setItem("accessedBooks", res.data.info?.accessedBooks)
        localStorage.setItem("isAuthenticated", true);
        window.location.href = "/";
      }
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
        <h2 className="login-title">Sign in to your account</h2>
        <p className="login-intro">
          Do you already have an online customer account at MediaSea?
          Log in here.
        </p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
          className="login-field"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          className="login-field"
        />
        <button type="submit" className="login-button" onClick={handleLogin}>
          Login
        </button>
        {loginError && <p className="error">{loginErrorMessage}</p>}
        <p className="message">
          Not registered? <Link to="/signup">Create an account</Link>
        </p>
        <p className="message">
          <Link to="/resetPasswordRequest">Forgot your password?</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;

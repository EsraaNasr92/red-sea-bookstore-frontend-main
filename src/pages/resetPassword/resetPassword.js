import React, { useState } from "react";
import "./resetPassword.css";
import redsea from "../../images/redsea.png";
import * as userService from "../../services/user.services";
import { useAlert } from "react-alert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Link } from "react-router-dom";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useParams } from "react-router-dom";
const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const resetToken = useParams().token;
  const alert = useAlert();

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*]).{8,}$/; // Password pattern: Minimum eight characters, at least one letter, and one number
    if (!passwordPattern.test(newPassword)) {
      setPasswordError(
        "The password must be at least 8 characters long and contain upper and lower case letters, numbers and special characters"
      );
    } else {
      setPasswordError("");
    }
  };


  const handleConfirmedPasswordChange = (e) => {
    const newConfirmedPassword = e.target.value;
    setConfirmedPassword(newConfirmedPassword);
    if (newConfirmedPassword !== password) {
      setPasswordMismatch(true);
    } else {
      setPasswordMismatch(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };


  const handleSignup = (e) => {
    e.preventDefault();
    if (passwordError) {
      return;
    }
    if (password !== confirmedPassword) {
      setPasswordMismatch(true);
      return;
    } else {
      userService
        .resetPassword(password, resetToken)
        .then((res) => {
          if (res.error) {
            alert.error(res.details, {
              timeout: 10000, // custom timeout just for this one alert
              style: {
                fontSize: "16px",
                fontFamily: "Arial, sans-serif",
                fontWeight: "bold",
                /* Add other style properties as needed */
              },
              onOpen: () => {
                console.log("hey");
              }, // callback that will be executed after this alert open
              onClose: () => {
                console.log("closed");
              }, // callback that will be executed after this alert is removed
            });
            return;
          } else {
            alert.show("Password Updated Successfully", {
              timeout: 10000, // custom timeout just for this one alert
              type: "success",
              onOpen: () => {
                console.log("hey");
              }, // callback that will be executed after this alert open
              onClose: () => {
                console.log("closed");
              }, // callback that will be executed after this alert is removed
            });
            setTimeout(() => {
              window.location.href = "/login";
            }, 2000);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div className="signup-container">
      <div className="logo-container">
        <Link to="/">
          <img src='https://redsea-books-assets.s3.eu-central-1.amazonaws.com/Asset+1%402x.png' alt="logo" className="signup-logo" />
        </Link>
      </div>
      <form className="signup-form" onSubmit={handleSignup}>
        <h1>Reset Password</h1>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          required={true}
          className="signup-field"
        />
        {!passwordError && (
        <p className="password-message">
          The password must be at least 8 characters long and contain upper and
          lower case letters, numbers and special characters
        </p>)}
        {passwordError && <p className="password-error">{passwordError}</p>}
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Confirm Password"
          value={confirmedPassword}
          onChange={handleConfirmedPasswordChange}
          required={true}
          className="signup-field"
        />
        {passwordMismatch && (
          <p className="password-mismatch-error">Passwords do not match!</p>
        )}
        <button
          type="button"
          className="password-visibilty-button"
          onClick={toggleShowPassword}
        >
          {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
        </button>

        <button className="submit-form-button" type="submit">
          Reset
        </button>
        <p className="message">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default ResetPassword;

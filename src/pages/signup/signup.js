import React, { useState } from "react";
import "./signup.css";
import redsea from "../../images/redsea.png";
import * as userService from "../../services/user.services";
import { useAlert } from "react-alert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Link } from "react-router-dom";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [userRole, setUserRole] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const alert = useAlert();
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

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

  const handleSetRole = (e) => {
    setUserRole(e.target.value);
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

  const handleSetFullName = (e) => {
    setFullName(e.target.value);
  };

  const handleSetPhoneNumber = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleSetSchoolName = (e) => {
    setSchoolName(e.target.value);
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
      const user = {
        email,
        password,
        role: userRole ? userRole : "STUDENT",
        name: fullName,
        schoolName: userRole == "TEACHER" ? schoolName : undefined,
        phone: userRole == "TEACHER" ? phoneNumber : undefined,
      };
      userService
        .signUp(user)
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
            alert.show("User Created Successfully", {
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
      <div className="logo-container-signup">
        <Link to="/">
          <img src='https://redsea-books-assets.s3.eu-central-1.amazonaws.com/Asset+1%402x.png' alt="logo" className="signup-logo" />
        </Link>
      </div>
      <form className="signup-form-container" onSubmit={handleSignup}>
        <h1>Sign Up</h1>
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={handleSetFullName}
          required={true}
          className="signup-field"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
          required={true}
          className="signup-field"
        />
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

        <select
          className="signup-field"
          value={userRole}
          onChange={handleSetRole}
          required={true}
        >
          <option value="STUDENT">Student</option>
          <option value="TEACHER">Teacher</option>
        </select>
        {userRole === "TEACHER" && (
          <>
            <input
              type="number"
              placeholder="Phone Number"
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              value={phoneNumber}
              onChange={handleSetPhoneNumber}
              required="required"
              className="signup-field"
            />
            <input
              type="text"
              value={schoolName}
              onChange={handleSetSchoolName}
              placeholder="School"
              required={true}
              className="signup-field"
            />
          </>
        )}
        <button className="submit-form-button" type="submit">
          Sign Up
        </button>
        <p className="message">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;

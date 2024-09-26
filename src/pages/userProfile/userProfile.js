import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import * as userServices from "../../services/user.services";
import { ACCESS_TOKEN, BASE_URL, CLIENT_REF } from "../../config/app.config";
import "./userProfile.css";
import Header from '../../components/header';
import BookCodesForm from "../../components/bookCodesForm";
import Footer from "../../components/footer";
import { Button } from "@mui/material";
import BottomNav from "../../components/bottom-nav";

import SideBar from "../../components/sideBar";
const UserProfile = () => {

    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPhone, setUserPhone] = useState('');
    const [userSchool, setUserSchool] = useState('');
    const [userAvatar, setUserAvatar] = useState('');
    const [userRole, setUserRole] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [userNewPassword, setUserNewPassword] = useState('');
    const [userConfirmPassword, setUserConfirmPassword] = useState('');
    const [userNewEmail, setUserNewEmail] = useState('');
    const [passwordError, setPasswordError] = useState("");
    const [passwordMismatch, setPasswordMismatch] = useState(false);
    
    useEffect(() => {
    userServices.getUserById(localStorage.getItem('id'), localStorage.getItem('email')).then((res) => {
        setUserName(res.data.name);
        setUserEmail(res.data.email);
        setUserPhone(res.data?.phone);
        setUserSchool(res.data?.school);
        setUserAvatar(res.data.settings.avatar);
        setUserRole(res.data.role);
        console.log(res)
    }
    ).catch((err) => {
        console.log(err)
    })
    }, []);

    const handleUserUpdate = () => {
        userServices.updateUserInfo(localStorage.getItem('id'), {
            name: userName,
            email: userNewEmail !== '' ? userNewEmail : undefined,
            phone: userPhone,
            school: userSchool,
            settings: {
                avatar: userAvatar
            }
        }).then((res) => {
            console.log(res)
            localStorage.setItem('name', res.data.name);
            localStorage.setItem('email', res.data.email);
            localStorage.setItem('avatar', res.data.settings.avatar);
            console.log(res)
        }).catch((err) => {
            console.log(err)
        })
    }

    const handleFileUpload = async (e) => {
        const file = await userServices.uploadFile(localStorage.getItem('id'), e.target.files[0])
        setUserAvatar(file.data)
      }

      const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setUserNewPassword(newPassword);
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
        setUserConfirmPassword(newConfirmedPassword);
        if (newConfirmedPassword !== userNewPassword) {
          setPasswordMismatch(true);
        } else {
          setPasswordMismatch(false);
        }
      };

      const handleEditPassword = () => {
        userServices.editPassword(userEmail, userPassword, userNewPassword).then((res) => {
            console.log(res)
        }).catch((err) => {
            console.log(err)
        })
      }

    return (
        <>
        
        <Header />
        <div className="user-profile-header-container">
        <SideBar />
            <div className="user-profile-container">
           
                <div className="user-profile-box">
                    {/* <div className="user-profile-image">
                        <img src={user.settings.avatar} alt="user-avatar" className="user-avatar" />
                    </div> */}
                    <h4 className="user-profile-header">Edit your profile info</h4>
                    <div className="user-profile-details">
                        <label className="user-profile-label">Name</label>
                        <input type="text" className="user-profile-input" value={userName} onChange={(e) => setUserName(e.target.value)} />
                        <label className="user-profile-label">Email</label>
                        <input type="text" disabled={true} className="user-profile-input-email" value={userNewEmail !== '' ? userNewEmail : userEmail} onChange={(e) => setUserNewEmail(e.target.value)} />
                        {userRole === 'TEACHER' && (
                            <>
                            <label className="user-profile-label">Phone</label>
                                <input type="number" className="user-profile-input" value={userPhone} onChange={(e) => setUserPhone(e.target.value)} />
                            <label className="user-profile-label">School</label>
                                <input type="text" className="user-profile-input" value={userSchool} onChange={(e) => setUserSchool(e.target.value)} />
                            </>
                        )}
                        <label className="user-profile-label">Avatar</label>
                            <img src={userAvatar} alt="user-avatar" className="user-avatar" />
                            <input type='file' className="user-profile-input" onChange={(e) => handleFileUpload(e)}/>

                        <Button variant="contained" className="user-profile-button" onClick={handleUserUpdate}>Save</Button>
                    </div>
                </div>
                <hr className="user-profile-hr" />
                <div className="password-management-box">
                    <div className="password-management-details">
                    <h4 className="user-profile-header">Password management</h4>
                        <label className="user-profile-label">Old password</label>
                            <input type="password" className="user-profile-input" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} />
                        <label className="user-profile-label">New password</label>
                            <input type="password" className="user-profile-input" value={userNewPassword} onChange={(e) => handlePasswordChange(e)} />
                        <label className="user-profile-label">Confirm password</label>
                        {passwordError && (
                            <p className="password-error">{passwordError}</p>
                        )}
                            <input type="password" className="user-profile-input" value={userConfirmPassword} onChange={(e) => handleConfirmedPasswordChange(e)} />
                        {passwordMismatch && (
                            <p className="password-mismatch-error">Passwords do not match!</p>
                        )}
                            <Button variant="contained" disabled={passwordError || passwordMismatch} className="user-profile-button" onClick={handleEditPassword}>Save</Button>
                    </div>
                </div>
            </div>
        </div>
        <Footer />
        <BottomNav />
        </>
    )
}
export default UserProfile;
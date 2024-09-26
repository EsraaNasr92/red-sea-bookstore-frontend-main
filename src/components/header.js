import React, {useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import redsea from "../images/redsea.png";
import "./header.css";
import { Link } from "react-router-dom";
import * as userServices from "../services/user.services";
import { useTranslation } from "react-i18next";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
const pages = ["Products", "Pricing", "Blog"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorElLang, setAnchorElLang] = React.useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { i18n } = useTranslation();
  const {t} = useTranslation();
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenLanguageMenu = (event) => {
    setAnchorElLang(event.currentTarget);
    setMenuOpen(true);
  };

  const handleCloseLanguageMenu = () => {
    setAnchorElLang(null);
    setMenuOpen(false)
  };

  const handleLogout = () => {
    userServices
      .Logout(localStorage.getItem("id"))
      .then((res) => {
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("id");
        localStorage.removeItem("role");
        localStorage.removeItem("name");
        localStorage.removeItem("avatar");
        localStorage.removeItem("accessedBooks");
        localStorage.removeItem("clientIp");
        window.location.href = "/";
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <AppBar
      className="app-header-box"
      position="sticky"
      style={{ zIndex: 999 }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link to="/" className='logo'>
            <img
              src='https://redsea-books-assets.s3.eu-central-1.amazonaws.com/Asset+1%402x.png'
              alt="logo"
              style={{ height: "50px" }}
            />
          </Link>
          <Box className="lang-box">
            <p
              onClick={handleOpenLanguageMenu}
              className="lang-text-mobile"
            >
              English {menuOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </p>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElLang}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElLang)}
              onClose={handleCloseLanguageMenu}
            >
              <MenuItem onClick={() => {handleCloseLanguageMenu(); changeLanguage("ar")}}>
                <Typography textAlign="left" className="lang-item">
                  Arabic
                </Typography>
              </MenuItem>
              <MenuItem onClick={() => {handleCloseLanguageMenu(); changeLanguage("en")}}>
                <Typography textAlign="left" className="lang-item">
                  English
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
          {localStorage.getItem("isAuthenticated") != "true" && (
            <Box
              sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
              className="non-loggedin-box"
            >
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {/* {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))} */}
                <Link className="login-signup-mobile" to="/login">
                  <Button sx={{ my: 2, color: "black", display: "flex" }}>
                    <Typography textAlign="center">{t("login")}</Typography>
                  </Button>
                </Link>
                <Link className="login-signup-mobile" to="/signup">
                  <Button sx={{ my: 2, color: "black", display: "flex" }}>
                    <Typography textAlign="center">{t("sign_up")}</Typography>
                  </Button>
                </Link>
                <Link className="login-signup-mobile" to="/catalouge">
                  <Button sx={{ my: 2, color: "black", display: "flex" }}>
                    <Typography textAlign="center">Book Catalouge</Typography>
                  </Button>
                </Link>
              </Menu>
            </Box>
          )}

          {localStorage.getItem("isAuthenticated") == "true" ? (
            <Box sx={{ flexGrow: 0 }} className="avatar-box">
              <div className="login-signup">
              <p
                onClick={handleOpenLanguageMenu}
                className="lang-text"
              >
                English {menuOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
              </p>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElLang}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElLang)}
                onClose={handleCloseLanguageMenu}
              >
                <MenuItem onClick={() => {handleCloseLanguageMenu(); changeLanguage("ar")}}>
                  <Typography textAlign="left">Arabic</Typography>
                </MenuItem>
                <MenuItem onClick={() => {handleCloseLanguageMenu(); changeLanguage("en")}}>
                  <Typography textAlign="left">English</Typography>
                </MenuItem>
              </Menu>
              </div>
              <Link className="login-signup" to="/catalouge">
                {t("catalouge")}
              </Link>
              <Link className="myLibraryLink" to="/userBooks">
                {t("my_library")}
              </Link>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt="Remy Sharp"
                    src={localStorage.getItem("avatar")}
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem>
                  <Typography textAlign="left">
                    logged in as: <br /> {localStorage.getItem("name")}
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleCloseUserMenu}>
                  <Typography textAlign="left">
                    <Link to="/userProfile" className="my-profile-link">
                      Account Settings
                    </Link>
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleCloseUserMenu}>
                  <Typography textAlign="left">
                    <Link to="/contactUs" className="my-profile-link">
                      Help
                    </Link>
                  </Typography>
                </MenuItem>
                <MenuItem onClick={() => {handleCloseUserMenu(); handleLogout();}}>
                  <Typography textAlign="left">
                    Log out
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <>
              <Box
                sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}
                className="login-box"
              >
                <p
                  onClick={handleOpenLanguageMenu}
                  className="lang-text"
                >
                  English {menuOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                </p>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElLang}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElLang)}
                  onClose={handleCloseLanguageMenu}
                >
                  <MenuItem onClick={() => {handleCloseLanguageMenu(); changeLanguage("ar");}}>
                    <Typography textAlign="left">Arabic</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => {handleCloseLanguageMenu(); changeLanguage("en");}}>
                    <Typography textAlign="left">English</Typography>
                  </MenuItem>
                </Menu>
                <Link className="login-signup" to="/catalouge">
                {t("catalouge")}
                </Link>

                <Link className="login-signup" to="/login">
                  {t("login")}
                </Link>
                <Link className="login-signup" to="/signup">
                  <Button className="signup-button">{t("sign_up")}</Button>
                </Link>
              </Box>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;

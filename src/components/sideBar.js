import BookIcon from '@mui/icons-material/Book';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import HomeIcon from '@mui/icons-material/Home';
import ShopIcon from '@mui/icons-material/Shop';
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import InstallDesktopIcon from '@mui/icons-material/InstallDesktop';
import React from "react";
import { Link, useLocation  } from "react-router-dom";
import "./sideBar.css";
import { useEffect, useState } from "react";

function SideBar() {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState(null);
  const currentLocation = useLocation();
  useEffect(() => {
    const handler = e => {
      e.preventDefault();
      console.log("we are being triggered :D");
      setSupportsPWA(true);
      setPromptInstall(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("transitionend", handler);
  }, []);

  const onClick = evt => {
    console.log("TCL: onClick -> promptInstall", evt);
    evt.preventDefault();
    if (!promptInstall) {
      return;
    }
    promptInstall.prompt();
  };
  return (
    <AppBar className="app-side-box" position="sticky" style={{ zIndex: 999 }}>
      <Container maxWidth="xl" className="side-bar-container">
        <Box className="sideBar-box">
          <Link className={`navigate-side${currentLocation.pathname === '/' ? '-selected' : ''}`}  to="/">
            <img src='https://redsea-books-assets.s3.eu-central-1.amazonaws.com/icons/Home.svg' />
          </Link>
          <Link className={`navigate-side${currentLocation.pathname === '/catalouge' ? '-selected' : ''}`}  to="/catalouge">
            <img src='https://redsea-books-assets.s3.eu-central-1.amazonaws.com/icons/Search.svg' />
          </Link>
          <Link className={`navigate-side${currentLocation.pathname === '/userBooks' ? '-selected' : ''}`} to="/userBooks">
            <img src='https://redsea-books-assets.s3.eu-central-1.amazonaws.com/icons/List.svg' />
          </Link>
          <Link className={`navigate-side${currentLocation.pathname === '/contactUs' ? '-selected' : ''}`} to="/contactUs">
            <img src='https://redsea-books-assets.s3.eu-central-1.amazonaws.com/icons/Question.svg' />
          </Link>
          <Link className={`navigate-side${currentLocation.pathname === '/userProfile' ? '-selected' : ''}`} to="/userProfile">
            <img src='https://redsea-books-assets.s3.eu-central-1.amazonaws.com/icons/Setting.svg' />
          </Link>
          <div className='navigate-side' style={{display: supportsPWA ? 'block' : 'none'}}>
            <InstallDesktopIcon onClick={onClick} />
            </div>
        </Box>
      </Container>
    </AppBar>
  );
}
export default SideBar;

import {Container, Typography } from '@mui/material';
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import ListIcon from '@mui/icons-material/List';
import ShopIcon from '@mui/icons-material/Shop';
import BookIcon from '@mui/icons-material/Book';
import Box from "@mui/material/Box";
import InstallMobileIcon from '@mui/icons-material/InstallMobile';

import './bottom-nav.css'

const BottomNav = () => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const currentLocation = useLocation();
  const [promptInstall, setPromptInstall] = useState(null);
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
      <footer className='bottom-nav'>
      <Container maxWidth="xl">
        <Box>
        <Link className={`navigate-bottom${currentLocation.pathname === '/' ? '-selected' : ''}`}  to="/">
            <img src='https://redsea-books-assets.s3.eu-central-1.amazonaws.com/icons/Home.svg' />
          </Link>
          <Link className={`navigate-bottom${currentLocation.pathname === '/catalouge' ? '-selected' : ''}`}  to="/catalouge">
            <img src='https://redsea-books-assets.s3.eu-central-1.amazonaws.com/icons/Search.svg' />
          </Link>
          <Link className={`navigate-bottom${currentLocation.pathname === '/userBooks' ? '-selected' : ''}`} to="/userBooks">
            <img src='https://redsea-books-assets.s3.eu-central-1.amazonaws.com/icons/List.svg' />
          </Link>
          <Link className={`navigate-bottom${currentLocation.pathname === '/contactUs' ? '-selected' : ''}`} to="/contactUs">
            <img src='https://redsea-books-assets.s3.eu-central-1.amazonaws.com/icons/Question.svg' />
          </Link>
          <Link className={`navigate-bottom${currentLocation.pathname === '/userProfile' ? '-selected' : ''}`} to="/userProfile">
            <img src='https://redsea-books-assets.s3.eu-central-1.amazonaws.com/icons/Setting.svg' />
          </Link>
          <Link className="navigate-bottom" to="/contactUs">
            <InstallMobileIcon style={{display: supportsPWA ? 'inline-block' : 'none'}} onClick={onClick} />
          </Link>
        </Box>
      </Container>
      </footer>
    );
  };
  

export default BottomNav;

import {Container, Typography } from '@mui/material';
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import './footer.css'

const Footer = () => {

    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
          const scrollHeight = document.documentElement.scrollHeight;
          const scrollTop = window.scrollY || document.documentElement.scrollTop;
          const clientHeight = document.documentElement.clientHeight;
          setIsVisible(scrollTop + clientHeight >= scrollHeight);
        };
    
        window.addEventListener('scroll', handleScroll);
    
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
      }, []);
    return (
      <footer className='app-footer visible'>
        <Container maxWidth="lg">
          <Typography variant="body1" className='footer-text'>
            All rights reserved to Mediasea 2024 – Powered by <a className='cubeish-url' target='_blank' href="https://cubeish.co/">Cubeish.co</a>
          </Typography>
        </Container>
      </footer>
    );
  };
  

export default Footer;

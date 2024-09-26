// Home.js

import React from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import "./home.css";
import Header from "../../components/header";
import homePic from "../../images/busuu-header-hello.png";
import Footer from "../../components/footer";
import InstallPWA from "../../components/installPWA";
import SideBar from "../../components/sideBar";
import BottomNav from "../../components/bottom-nav";
const Home = () => {
  return (
    <>
      <Header />

      <div className="background">
        <div className="content-container" style={{ minHeight: "86vh" }}>
          <SideBar />

          <Grid className="home-page" container spacing={4}>
            <Grid item xs={12} sm={12} className="home-columns">
              <div className="home-header">
                <h1 className="main-heading">
                  <span className="welcome">Welcome to</span> MediaSea
                </h1>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} lg={7} className="home-columns">
              <p className="sub-heading">
                Your Gateway to Knowledge and Learning
              </p>
              <p className="description">
                MediaSea offers a revolutionary digital learning experience
                for students and teachers. With an extensive collection of
                educational resources in multiple languages, we aim to empower
                the pursuit of knowledge.
              </p>
              <Grid className="features-section">
                <h2 className="features">
                  <span className="key">Key</span> Features
                </h2>
                <Grid className="features-icons">
                  <Grid item lg={2} xs={3} sm={3} className="features-element">
                    <div className="features-image">
                      <img
                        className="feature-icon"
                        src="https://redsea-books-assets.s3.eu-central-1.amazonaws.com/icons/Languages.svg"
                      />
                    </div>
                    <p className="features-text">+3 Languages Supported</p>
                  </Grid>
                  <Grid item lg={2} xs={3} sm={3} className="features-element">
                    <div className="features-image">
                      <img
                        className="feature-icon"
                        src="https://redsea-books-assets.s3.eu-central-1.amazonaws.com/icons/Books.svg"
                      />
                    </div>
                    <p className="features-text">+20 Books Available</p>
                  </Grid>
                  <Grid item lg={2} xs={3} sm={3} className="features-element">
                    <div className="features-image">
                      <img
                        className="feature-icon"
                        src="https://redsea-books-assets.s3.eu-central-1.amazonaws.com/icons/Interactive.svg"
                      />
                    </div>
                    <p className="features-text">
                      Interactive Learning Materials
                    </p>
                  </Grid>
                  <Grid item lg={2} xs={3} sm={3} className="features-element">
                    <div className="features-image">
                      <img
                        className="feature-icon"
                        src="https://redsea-books-assets.s3.eu-central-1.amazonaws.com/icons/Customized+Profiles.svg"
                      />
                    </div>
                    <p className="features-text">
                      Customized Profiles for Students & Teachers
                    </p>
                  </Grid>
                  <Grid item lg={2} xs={3} sm={3} className="features-element">
                    <div className="features-image">
                      <img
                        className="feature-icon"
                        src="https://redsea-books-assets.s3.eu-central-1.amazonaws.com/icons/Enhanced+Learning+Tools.svg"
                      />
                    </div>
                    <p className="features-text">Enhanced Learning Tools</p>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6} lg={5} className="home-columns">
              <img
                src="https://redsea-books-assets.s3.eu-central-1.amazonaws.com/redsea-02.png"
                alt="home"
                className="home-image"
              />
            </Grid>
            <Grid item className="join-grid">
              {localStorage.getItem("isAuthenticated") ? null : (
                <div>
                  <h2 className="join-header">
                    <span className="join-span">Join Us</span> Today
                  </h2>
                  <p className="join-intro">
                    Whether you're a student eager to explore, or a teacher
                    seeking innovative teaching materials.
                  </p>
                  <Link className="signup-link" to="/signup">
                    <Button
                      style={{
                        background: "#B08E32",
                        color: "white",
                        borderRadius: "110px",
                        border: "white 1px",
                        fontWeight: "300"
                      }}
                      variant="outlined"
                      color="primary"
                    >
                      Sign Up Now
                    </Button>
                  </Link>
                </div>
              )}
            </Grid>
          </Grid>
        </div>
      </div>

      <Footer />
      <BottomNav />
    </>
  );
};

export default Home;

import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import * as userServices from "../../services/user.services";
import * as bookServices from "../../services/book.services";
import { ACCESS_TOKEN, BASE_URL, CLIENT_REF } from "../../config/app.config";
import "./userBooks.css";
import Header from '../../components/header';
import BookCodesForm from "../../components/bookCodesForm";
import Footer from "../../components/footer";
import SideBar from "../../components/sideBar";
import BottomNav from "../../components/bottom-nav";
import CircularProgress from '@mui/material/CircularProgress';

const API_URL = `${BASE_URL}users`;

const UserBooks = () => {
  const [userBooks, setUserBooks] = useState([]);
  const [addMoreBooks, setAddMoreBooks] = useState(false);
  const [newBooks, setNewBooks] = useState([]);
  const [codesInfo, setCodesInfo] = useState([]);
  const searchParams = new URLSearchParams(document.location.search)
  const [loading, setIsLoading] = useState(true)

  useEffect(() => {
    userServices
      .getUserBooks(localStorage.getItem("id"))
      .then((res) => {
        setUserBooks(res.data);
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            action: 'addResourceToCache',
            url: `${API_URL}/get-user-books/${CLIENT_REF}/${localStorage.getItem('id')}`
          });
        }
        setIsLoading(false)
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    bookServices.getExpiryDate(localStorage.getItem('id')).then((res) => {
      setCodesInfo(res?.data);
      console.log(res);
    }).catch((err) => {
      console.log(err);
    });
  }, []);

  useEffect(() => {
    if (searchParams.get('addBooks') === 'true') {
      setAddMoreBooks(true);
    }
  }, [searchParams]);

  const handleSearch = (value) => {
    setNewBooks(userBooks.filter((book) => book.title.includes(value)));
  };

  const booksToMap = newBooks?.length > 0 ? newBooks : userBooks;

  return (
    <>
      <Header />
      <div className="background">
        {loading ? (
          <div className="loading-spinner-container">
            <CircularProgress />
          </div>
        ) : userBooks?.length > 0 && !addMoreBooks ? (
          <div className="user-books-container">
            <SideBar />
            <div className="books-info">
              <Typography variant="h4" className="user-books-title">Your library of books:</Typography>
              <input type="text" className="search-input" placeholder="Search" onChange={(e) => handleSearch(e.target.value)} />
              <Grid container spacing={2} className="book-main-grid">
                {booksToMap.map((book) => (
                  <Grid item xs={6} sm={6} md={4} lg={3} spacing={2} key={book._id} className="book-grid">
                    <Link to={`/bookDetails/${book._id}`} className="book-link">
                      <div
                        className="book-card"
                        style={{
                          backgroundImage: `url(${book.thumbnail})`,
                          backgroundSize: "contain",
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "center",
                          paddingTop: "75%",
                          position: "relative",
                        }}
                      >
                      </div>
                      <div className="book-title-div">
                        <Typography variant="h6" className="book-title">
                          {book.title}
                        </Typography>
                      </div>
                      {codesInfo && codesInfo?.length > 0 && codesInfo.map((code) => {
                        if (code.codeBase === book.codeBase) {
                          return (
                            <div className="book-expiry-date" key={code._id}>
                              <span className="expiry-date">Expires on: {code?.codes[0]?.activeUntil?.split('T')[0]}</span>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </Link>
                  </Grid>
                ))}
              </Grid>
              <div className="add-more-books">
                <button
                  className="add-more-books-button"
                  onClick={() => setAddMoreBooks(true)}
                >
                  Add more books
                </button>
              </div>
            </div>
          </div>
        ) : (
          <BookCodesForm setAddMoreBooks={setAddMoreBooks} />
        )}
        <Footer />
      </div>
      <BottomNav />
    </>
  );
};

export default UserBooks;

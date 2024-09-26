import React, { useEffect, useState } from "react";
import "./catalouge.css";
import Header from "../../components/header";
import Footer from "../../components/footer";
import * as bookServices from "../../services/book.services";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import * as userServices from "../../services/user.services";
import SideBar from "../../components/sideBar";
import Select from 'react-select';
import SearchIcon from '@mui/icons-material/Search';
import BottomNav from "../../components/bottom-nav";
import PDFViewer from "../../components/PDFViewr";
import CircularProgress from '@mui/material/CircularProgress';
const Catalouge = () => {
  const [books, setBooks] = useState([]);
  const [newBooks, setNewBooks] = useState([]);
  const [viewSample, setViewSample] = useState(false);
  const [userBooks, setUserBooks] = useState([]);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [clikedIndex, setClikedIndex] = useState(0);
  const [selectedMediaType, setSelectedMediaType] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedTitle, setSelectedTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [viewSampleBookId, setViewSampleBookId] = useState(null);
  const mediaTypes = [
    { value: 'audio', label: 'Audio' },
    { value: 'video', label: 'Video' },
    { value: 'pdf', label: 'PDF' }
  ];
  const languages = [
    { value: 'English', label: 'English' },
    { value: 'Arabic', label: 'Arabic' },
    { value: 'German', label: 'German' },
    { value: 'Turkish', label: 'Turkish' },
    { value: 'French', label: 'French'}
  ];
  const toggleDescription = (index) => {
    console.log(index);
    setClikedIndex(index);
    setShowFullDescription(!showFullDescription);
  };
  useEffect(() => {
    setIsLoading(true);
    bookServices
      .getAllBooks()
      .then((res) => {
        setBooks(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, []);
  

  useEffect(() => {
    const userId = localStorage.getItem("id");
    if (userId) {
      userServices
        .getUserBooks(userId)
        .then((res) => {
          setUserBooks(res?.data?.map((book) => book._id) ?? []);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log("User ID not found in localStorage");
    }
  }, []);

  const renderDescription = (description, index) => {
    const truncatedDescription = `${description?.slice(0, 350)}`;

    return (
      <>
        {description?.length < 350 ||
        (showFullDescription && clikedIndex === index)
          ? description
          : 
          description == null ? null
          :
          `${truncatedDescription}...`}

        {description?.length > 350 && (
          <span onClick={() => toggleDescription(index)} className="read-more">
            {showFullDescription && clikedIndex === index ? (
              <span className="read-more-catalogue">Read less</span>
            ) : (
              <span className="read-more-catalogue">Read more</span>
            )}
          </span>
        )}
      </>
    );
  };

  const handleSearch = (value, key) => {
    if (key === 'title') {
      setSelectedTitle(value);
    } else if (key === 'publishYear') {
      setSelectedYear(value);
    } else if (key === 'language') {
      setSelectedLanguage(value);
    } else if (key === 'mediaType') {
      setSelectedMediaType(value);
    }
  };
  const handleSubmiteSearch = () => {
    bookServices.filterBooks(selectedTitle, selectedYear, selectedLanguage?.value, selectedMediaType?.value).then((res) => {
      setBooks(res.data);
    }).catch((err) => {
      console.log(err)
    })
  }
  return (
    <>
      <Header />
      <div className="user-catalouge-container">
        <SideBar />
        <Grid className="books-grid" xs={12} sm={12} md={9} lg={12} container>
          {/* Book grid */}
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Typography variant="h4" className="user-books-title">
              Our Book Catalogue:
            </Typography>
            <div className="search-actions">
            <input
              type="text"
              className="search-input-catalouge"
              placeholder="Search by title"
              onChange={(e) => handleSearch(e.target.value, 'title')}
            />
            <input
              type="text"
              className="search-input-catalouge"
              placeholder="Search publish year"
              onChange={(e) => handleSearch(e.target.value, 'publishYear')}
            />
              <Select
                  options={languages}
                  value={selectedLanguage}
                  onChange={setSelectedLanguage}
                  className="media-type-selector"
                  placeholder='Select language...'
                />
                <Select
                  options={mediaTypes}
                  value={selectedMediaType}
                  onChange={setSelectedMediaType}
                  className="media-type-selector"
                  placeholder='Select media type...'
                />
                <SearchIcon className="search-icon" onClick={handleSubmiteSearch} />
            <button className="search-button-catalouge" onClick={handleSubmiteSearch}><SearchIcon className="search-icon-mobile"/></button>

            </div>
            <Grid container>
            {isLoading ?           
            <div className="loading-spinner-container-catolouge">
            <CircularProgress />
          </div> :
              books.length > 0 ?
               books.map((book, index) => (
                <Grid
                  item
                  xs={12}
                  sm={9}
                  md={9}
                  lg={12}
                  key={book._id}
                  className="book-grid"
                >
                  <Grid
                    item
                    xs={12}
                    sm={9}
                    md={9}
                    lg={2}
                    className="book-card"
                    style={{
                      backgroundImage: `url(${book.thumbnail})`,
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "left",
                      paddingTop: "15%", 
                      position: "relative",
                      maxHeight: "200px",
                      marginTop: "15px",
                    }}
                  />
                  <Grid xs={12} sm={9} md={8} lg={8}>
                    <Typography variant="h6" className="book-title">
                      {book?.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      className="book-description-catalouge"
                    >
                      {renderDescription(book?.description, index)}
                    </Typography>
                    <Typography className="book-language">Language: <span className="book-language-span">{book?.language}</span></Typography>
                    <Typography className="book-year">Publish Year: <span className="book-year-span">{book?.publishYear}</span></Typography>
                    <Typography className="book-year">Media Types: <span className="book-year-span">{book?.pages.some(page => page.voiceFiles !== undefined && page.voiceFiles !== null) && 'Audio'}
                     {book?.pages.some(page => page.videoFiles !== undefined && page.videoFiles !== null) && ', Video'} 
                     {book?.pages.some(page => page.pdfFiles !== undefined && page.pdfFiles !== null) && ', PDF'} </span></Typography>
                  </Grid>
                  <Grid
                    xs={12}
                    sm={9}
                    md={2}
                    lg={2}
                    className="book-actions-overlay"
                  >
                    <div className="book-button-catolouge">
                      <Button
                        className="get-book-button"
                      >
                        {userBooks && userBooks.includes(book._id) ? (
                          <Link
                            className="add-book-link-catalouge"
                            to={`/bookdetails/${book._id}`}
                          >
                            Go to Book
                          </Link>
                        ) : (
                          <Link
                            className="add-book-link-catalouge"
                            to={
                              localStorage.getItem("isAuthenticated")
                                ? "/userBooks?addBooks=true"
                                : "/userBooks"
                            }
                          >
                            Get this book
                          </Link>
                        )}
                      </Button>
                      {book.sample && (
                      <button
                      className="action-button-download-catalouge"
                      onClick={() => setViewSampleBookId(book._id)}
                    >
                      View Sample
                    </button>)}
                      <Dialog
              open={viewSampleBookId === book._id}
              onClose={() => setViewSampleBookId(null)}
              aria-labelledby="form-dialog-title"
              className="parentDialog"
            >
              <DialogContent
                className="dialogContainer"
              >
                {book.sample ? (
                  <PDFViewer pdfURL={book.sample} />
                ) : (
                  <h1>No Sample Available</h1>
                )}
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    setViewSampleBookId(null);
                  }}
                  color="primary"
                  className="cancelButton"
                >
                  Close
                </Button>
              </DialogActions>
            </Dialog>
                    </div>
                  </Grid>
                </Grid>
              )) : <div className="no-books-found">No books found</div>}
            </Grid>
          </Grid>
        </Grid>
      </div>
      <Footer />
      <BottomNav />
    </>
  );
};

export default Catalouge;

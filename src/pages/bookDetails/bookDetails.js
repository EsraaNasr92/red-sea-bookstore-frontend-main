import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import CloseIcon from "@mui/icons-material/Close";
import HeadsetIcon from "@mui/icons-material/Headset";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import { useHistory, useParams } from "react-router-dom";
import Select from "react-select";
import BottomNav from "../../components/bottom-nav";
import Footer from "../../components/footer";
import Header from "../../components/header";
import SideBar from "../../components/sideBar";
import { BASE_URL, CLIENT_REF } from "../../config/app.config";
import * as bookServices from "../../services/book.services";
import * as userServices from "../../services/user.services";
import "./bookDetails.css"; // Import your CSS file
import PDFViewer from "../../components/PDFViewr";
const API_URL = `${BASE_URL}books`;
const BookDetails = () => {
  const [book, setBook] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [contentShown, setContentShown] = useState(true);
  const [isResourceInCache, setIsResourceInCache] = useState(false);
  const [userHasTheBook, setUserHasTheBook] = useState(false);
  const [viewSample, setViewSample] = useState(false);
  const bookId = useParams().bookId;
  const history = useHistory();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [selectedMediaTypes, setSelectedMediaTypes] = useState(["All"]);
  const [codesInfo, setCodesInfo] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const mediaTypes = [
    { value: "audio", label: "Audio" },
    { value: "video", label: "Video" },
    { value: "pdf", label: "PDF" },
    { value: "All", label: "All" },
  ];
  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };
  useEffect(() => {
    const unlisten = history.listen((location, action) => {
      if (
        localStorage.getItem("playingAudio") == "true" &&
        !location.pathname.includes("/bookDetails")
      ) {
        // If the user tries to navigate away, pause the audio
        localStorage.setItem("playingAudio", false);
        window.location.reload();
      }
    });

    return () => {
      unlisten(); // Cleanup the listener when the component unmounts
    };
  }, [history]);
  useEffect(() => {
    bookServices
      .getBookById(bookId)
      .then((res) => {
        setBook(res.data);
        userServices
          .getUserBooks(localStorage.getItem("id"))
          .then((userBooks) => {
            const userHasTheBook = userBooks.data.some(
              (userBook) => userBook.codeBase === res.data.codeBase
            );
            if (userHasTheBook) {
              setUserHasTheBook(true);
              setIsLoading(false);
            } else {
              window.location.href = "/userBooks";
            }
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [bookId]);

  useEffect(() => {
    async function isResourceInCache(url) {
      try {
        const cache = await caches.open("appV1");
        const response = await cache.match(url);
        if (response) {
          setIsResourceInCache(true);
        }
      } catch (error) {
        console.error("Error checking cache:", error);
        return false;
      }
    }
    isResourceInCache(`${API_URL}/get-book-by-id/${CLIENT_REF}/${book._id}`);
  }, [book]);

  const toggleSidebar = () => {
    const sidebarContent = document.querySelector(".sidebar");
    const mainContent = document.querySelector(".page-container");
    const bookMetaGrid = document.querySelector(".book-meta-grid");
    if (sidebarContent.classList.contains("collapsed")) {
      sidebarContent.classList.remove("collapsed");
      mainContent.classList.toggle("wider");
      bookMetaGrid.classList.toggle("wider");
    } else {
      sidebarContent.classList.toggle("collapsed");
      mainContent.classList.remove("wider");
      bookMetaGrid.classList.remove("wider");
    }
    const sidebarContentMobile = document.querySelector(".floating-index-bar");
    if (sidebarContentMobile.classList.contains("collapsed")) {
      sidebarContentMobile.classList.remove("collapsed");
    } else {
      sidebarContentMobile.classList.toggle("collapsed");
    }
    setContentShown(!contentShown);
  };

  const toggleAudioControls = (page, pageNumber) => {
    const audioControls = document.querySelector(
      `.audio-play-buttons_${page}_${pageNumber}`
    );
    audioControls.style.display =
      audioControls.style.display === "none" ? "block" : "none";
  };

  const handleMediaTypesChange = (selectedOptions) => {
    if (selectedOptions.some((option) => option.value === "All")) {
      // 'All' is selected, set all media types
      setSelectedMediaTypes(["audio", "video", "pdf"]);
    } else {
      // Update selected media types based on user's selection
      setSelectedMediaTypes([]);
      setSelectedMediaTypes(selectedOptions.map((option) => option.value));
    }
  };

  const addBookPageToCache = () => {
    setIsDownloading(true);
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        action: "addResourceToCache",
        url: `https://mediasea.net/bookDetails/${book._id}`,
      });
    }
    console.log("added book page to cache");
    setIsDownloading(false);
  };
  const addBookToCache = (url) => {
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        action: "addResourceToCache",
        url: url,
      });
    }
    addBookPageToCache();
  };

  function audioPreLoad(file) {
    const audio = new Audio(file);
    audio.preload = "auto";
    audio.load();
  }

  const handleAudioPlay = (voiceFileName) => {
    const audioElements = document.getElementsByTagName("audio");
    for (let i = 0; i < audioElements.length; i++) {
      const audioElement = audioElements[i];
      if (voiceFileName === audioElement.src) {
        audioElement.play();
      } else {
        audioElement.pause();
      }
    }
  };

  useEffect(() => {
    bookServices
      .getExpiryDate(localStorage.getItem("id"), book.codeBase)
      .then((res) => {
        setCodesInfo(res?.data[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [book]);
  return (
    <>
      <Header />
      {isLoading && !userHasTheBook ? (
        <h1>Loading...</h1>
      ) : (
        <div className="book-details">
          <SideBar />
          <div className="main-content">
            <Dialog
              open={viewSample}
              onClose={() => setViewSample(false)}
              aria-labelledby="form-dialog-title"
              className="parentDialog"
            >
              <DialogContent className="dialogContainer">
                {book.sample ? (
                  // <object
                  //   data={book.sample.concat("#toolbar=0")}
                  //   type="application/pdf"
                  //   className="pdfContainer"
                  // ></object>
                  <PDFViewer pdfURL={book.sample} />
                ) : (
                  <h1>No Sample Available</h1>
                )}
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    setViewSample(false);
                  }}
                  color="primary"
                  className="cancelButton"
                >
                  Close
                </Button>
              </DialogActions>
            </Dialog>
            <Grid container spacing={2} className="book-info">
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={2}
                xl={2}
                className="book-photo-grid"
              >
                <img
                  className="book-thumbnail"
                  src={book.thumbnail}
                  alt="Book Thumbnail"
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={10}
                xl={10}
                className="book-meta-grid"
              >
                <h1 className="book-title-header">{book.title}</h1>
                <div className="book-expiry">
                  <span className="expiry-date-book">
                    Expires on: {codesInfo?.codes[0].activeUntil.split("T")[0]}
                  </span>
                </div>
                <div className="book-info">
                  {book.description && (
                  <p className="book-description">
                    <span>
                      {showFullDescription
                        ? book?.description
                        : `${book?.description?.slice(0, 350)}...`}{" "}
                    </span>
                    {showFullDescription ? (
                      <span onClick={toggleDescription} className="show-more">
                        Read Less
                      </span>
                    ) : (
                      <span onClick={toggleDescription} className="show-more">
                        Read More
                      </span>
                    )}
                  </p>
                  )}
                </div>
                <div className="book-meta">
                  <div className="book-meta-info">
                    <Typography className="book-language">
                      Language:{" "}
                      <span className="book-language-span">
                        {book?.language}
                      </span>
                    </Typography>
                    <Typography className="book-year">
                      Publish Year:{" "}
                      <span className="book-year-span">
                        {book?.publishYear}
                      </span>
                    </Typography>
                  </div>
                  <div className="book-actions">
                    <button
                      className="action-button-download"
                      disabled={isResourceInCache || isDownloading}
                      style={{
                        cursor: isResourceInCache ? "not-allowed" : "pointer",
                        opacity: isResourceInCache ? "0.5" : "1",
                      }}
                      onClick={() =>
                        addBookToCache(
                          `${API_URL}/get-book-by-id/${CLIENT_REF}/${book._id}`
                        )
                      }
                    >
                      {isResourceInCache
                        ? "Book is available for offline use"
                        : "Download Book"}
                    </button>
                    <button
                      className="action-button-download"
                      onClick={() => setViewSample(true)}
                    >
                      View Sample
                    </button>
                    {
                      book?.digitalEdition && (
                        <button className="action-button-download">
                          <span className="digital-link">
                            <Link
                              style={{ color: 'inherit', textDecoration: 'none' }}
                              to={`/DigitalBook/${book._id}`}
                            >
                              Digital Edition
                            </Link>
                          </span>
                        </button>
                      )
                    }
                    <button className="sidebar-toggle" onClick={toggleSidebar}>
                      Content <AutoStoriesIcon className="book-icon" />
                    </button>
                    <button
                      className="sidebar-toggle-mobile"
                      onClick={toggleSidebar}
                    >
                      Content <AutoStoriesIcon className="book-icon" />
                    </button>
                  </div>
                </div>
              </Grid>
              <div className="book-actions-filter">
                <label className="media-type-label">Media Types: </label>
                <Select
                  isMulti
                  options={mediaTypes}
                  value={mediaTypes.filter((option) =>
                    selectedMediaTypes.includes(option.value)
                  )}
                  onChange={handleMediaTypesChange}
                  className="media-type-selector"
                  placeholder="Select media type..."
                />
              </div>
            </Grid>
            <div className="page-container">
              {book.pages.map((page, index) => {
                return (
                  <div
                    key={page.number}
                    id={`page_${page.number}`}
                    className="page"
                  >
                    {(selectedMediaTypes.includes("audio") && page.voiceFiles) ||
                    (selectedMediaTypes.includes("video") && page.videoFiles) ||
                    (selectedMediaTypes.includes("pdf") && page.pdfFiles) ? (
                      <h2>Page {page.number}</h2>
                    ) : selectedMediaTypes.includes("All") ? (
                      <h2>Page {page.number}</h2>
                    ) : selectedMediaTypes.length == 0 ? (
                      <h2>Page {page.number}</h2>
                    ) : null}

                    {((selectedMediaTypes.length > 0 &&
                      selectedMediaTypes.includes("audio")) ||
                      (selectedMediaTypes.length > 0 &&
                        selectedMediaTypes.includes("All"))) && (
                      <>
                        {page.voiceFiles && (
                          <>
                          {page.voiceFiles.map((voiceFile, index) => (
                            <>
                            {audioPreLoad(voiceFile.url)}
                            <div className="audio-file-title">
                              <HeadsetIcon />
                              <p
                                onClick={() => {
                                  toggleAudioControls(index, page.number);
                                }}
                                style={{ cursor: "pointer" }}
                              >
                                {voiceFile.name ? voiceFile.name : decodeURIComponent(
                                  voiceFile.url
                                    ?.split("/")
                                    ?.pop()
                                    ?.replace(".mp3", "")
                                    ?.replace(/_/g, " ")
                                    ?.replace(/\+/g, " ")
                                )}
                              </p>
                            </div>
                            <div
                              style={{ display: "none" }}
                              className={`audio-play-buttons_${index}_${page.number}`}
                            >
                              <AudioPlayer
                                src={voiceFile.url}
                                className={`audio_${page.number}`}
                                onPlay={() => {
                                  handleAudioPlay(voiceFile.url);
                                }}
                                progressJumpStep={5000}
                              />
                            </div>
                            </>
              ))}
                          </>
                        )}
                      </>
                    )}
                    {
                      ((selectedMediaTypes.length > 0 &&
                        selectedMediaTypes.includes("video")) ||
                        (selectedMediaTypes.length > 0 &&
                          selectedMediaTypes.includes("All"))) &&
                      page.videoFiles &&
                      page.videoFiles.map((videoFile, index) => (
                        <>
                        <video
                          key={index}
                          controls
                          className="video-file"
                          src={videoFile.url}
                        ></video>
                        <br />
                        </>
                      ))
                    }
                    {((selectedMediaTypes.length > 0 &&
                      selectedMediaTypes.includes("pdf")) ||
                      (selectedMediaTypes.length > 0 &&
                        selectedMediaTypes.includes("All"))) &&
                      page.pdfFile && <PDFViewer pdfURL={page.pdfFile} />}
                    {(selectedMediaTypes.includes("audio") && page.voiceFile) ||
                    (selectedMediaTypes.includes("video") && page.videoFiles) ||
                    (selectedMediaTypes.includes("pdf") && page.pdfFile) ? (
                      <hr />
                    ) : selectedMediaTypes.includes("All") ? (
                      <hr />
                    ) : selectedMediaTypes.length == 0 ? (
                      <hr />
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="sidebar collapsed">
            <div className="sidebar-content">
              <div className="book-info-side">
                <img className="book-thumbnail-side" src={book.thumbnail}></img>
                <h4>{book.title}</h4>
              </div>
              <ul>
                {book.pages.map((page) => (
                  <>
                    <li key={page.number}>
                      <a href={`#page_${page.number}`}>Page {page.number}</a>
                    </li>
                    <hr className="index-hr" />
                  </>
                ))}
              </ul>
            </div>
          </div>

          <div className="floating-index-bar collapsed">
            {/* Index content goes here */}
            <div className="book-info-mobile">
              <img className="book-thumbnail-mobile" src={book.thumbnail}></img>
              <h4 className="book-title-mobile">{book.title}</h4>
              <div className="book-exit-icon">
                <CloseIcon className="close-icon" onClick={toggleSidebar} />
              </div>
            </div>

            <div className="book-index-mobile">
              <ul>
                {book.pages.map((page) => (
                  <>
                    <li key={page.number}>
                      <a href={`#page_${page.number}`}>Page {page.number}</a>
                    </li>
                    <hr className="index-hr" />
                  </>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      <Footer />
      <BottomNav />
    </>
  );
};

export default BookDetails;

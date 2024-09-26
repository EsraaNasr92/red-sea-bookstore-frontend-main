import React, { useEffect, useState } from "react";
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText, Divider, Tab, Tabs, Avatar } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link } from "react-router-dom";
import AudioPlayer from "react-h5-audio-player";
import "./digitalSidebar.css";
import HeadsetIcon from "@mui/icons-material/Headset";

const DigitalSidebar = ({ book, setPageNumber }) => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };


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

  const toggleAudioControls = (page, pageNumber) => {
    const audioControls = document.querySelector(
      `.audio-play-buttons_${page}_${pageNumber}`
    );
    audioControls.style.display =
      audioControls.style.display === "none" ? "block" : "none";
  };

  function audioPreLoad(file) {
    const audio = new Audio(file);
    audio.preload = "auto";
    audio.load();
  }

  return (
    <Box sx={{ backgroundColor: "white", color: "black", p: 2, overflowY: 'scroll', height: '85vh' }}>
      {/* Book Thumbnail and Title */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Link to={`/bookDetails/${book?._id}`}>
          <Avatar
            variant="square"
            src={book?.thumbnail}
            alt="Book Thumbnail"
            sx={{ width: 60, height: 80, mr: 2 }}
          />
        </Link>
        <Typography variant="h6" sx={{ lineHeight: 1.2 }}>
          <Link to={`/bookDetails/${book?._id}`} class="book-media-link">
            {" "}
            {book?.title}{" "}
          </Link>
        </Typography>
      </Box>

      {/* Tabs for Pages and Media */}
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        sx={{ backgroundColor: "white", color: "black", mb: 2 }}
        textColor="inherit"
        indicatorColor="secondary"
      >
        <Tab label="Pages & Media" />
      </Tabs>

      {/* Divider */}
      <Divider sx={{ backgroundColor: "white", mb: 2 }} />
    {console.log(book)}
      {/* Conditional Rendering Based on Selected Tab */}
      {selectedTab === 0 && (
        <List>
  {[...Array(book?.digitalEditionPageNumber)].map((_, index) => {
    const page = book?.pages?.find((p) => p.number === index + 1);

    return (
      <Accordion
        key={index}
        sx={{
          backgroundColor: "white",
          color: "black",
          boxShadow: "none",
          mb: 1,
        }}
      >
        <AccordionSummary
          expandIcon={
            page?.voiceFiles || page?.videoFiles ? (
              <ExpandMoreIcon sx={{ color: "black" }} />
            ) : null
          }
          onClick={() => setPageNumber(index + 1)} // Ensure users can click and navigate to the PDF page
          aria-controls={`panel${index + 1}a-content`}
          id={`panel${index + 1}a-header`}
        >
          <Typography>Page {index + 1}</Typography> {/* Display page number */}
        </AccordionSummary>

        {page ? (
          <>
            {/* Voice files rendering */}
            {page.voiceFiles && (
              <AccordionDetails>
                {page.voiceFiles.map((voiceFile, voiceIndex) => (
                  <ListItem
                    key={voiceIndex}
                    style={{ display: "block" }}
                    onClick={() => {
                      toggleAudioControls(voiceIndex, page.number);
                    }}
                    button
                  >
                    {audioPreLoad(voiceFile.url)}
                    <div className="audio-file-title">
                      <HeadsetIcon />
                      <p style={{ cursor: "pointer" }}>
                        {voiceFile.name
                          ? voiceFile.name
                          : decodeURIComponent(
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
                      className={`audio-play-buttons_${voiceIndex}_${page.number}`}
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
                  </ListItem>
                ))}
              </AccordionDetails>
            )}

            {/* Video files rendering */}
            {page.videoFiles && (
              <AccordionDetails>
                <ListItem style={{ display: "block" }} button>
                  {page.videoFiles.map((videoFile, videoIndex) => (
                    <div key={videoIndex}>
                      <video
                        controls
                        className="video-file-digitalsidebar"
                        src={videoFile.url}
                      ></video>
                      <br />
                    </div>
                  ))}
                </ListItem>
              </AccordionDetails>
            )}
          </>
        ) : (
          <AccordionDetails>
            <ListItem
              button
              onClick={() => setPageNumber(index + 1)} // Allow clicking on the item to navigate to the page in the PDF
              style={{ cursor: "pointer" }}
            >
              <Typography>No content available for Page {index + 1}</Typography>
            </ListItem>
          </AccordionDetails>
        )}
      </Accordion>
    );
  })}
</List>

      )}
    </Box>
  );
};

export default DigitalSidebar;

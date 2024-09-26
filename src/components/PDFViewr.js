import React, { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "./PDFViewer.css"; // Import your CSS file
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

const PDFViewer = ({ pdfURL, propPageNumber, mode }) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [viewMode, setViewMode] = useState("single"); // Dropdown state for viewing mode

  const handleContextMenu = (event) => {
    event.preventDefault(); // Prevent the default context menu
  };

  useEffect(() => {
    if (propPageNumber) {
      setPageNumber(propPageNumber);
    }
  }, [propPageNumber]);

  const onNextPage = () => {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
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

  const onPrevPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const onPageNumberChange = (e) => {
    const value = e.target.value;
    const pageNum = parseInt(value, 10);

    if (value === "" || (pageNum > 0 && pageNum <= numPages)) {
      setPageNumber(pageNum);
    }
  };

  // Handle the view mode change (dropdown)
  const handleViewModeChange = (e) => {
    setViewMode(e.target.value);
  };

  const renderPages = () => {
    switch (viewMode) {
      case "single":
        return (
          <div className="pdf-single-page">
            <Page pageNumber={pageNumber} renderMode="canvas" />
          </div>
        );
      case "double":
        return (
          <div className="pdf-double-page">
            <Page pageNumber={pageNumber} renderMode="canvas" />
            {pageNumber < numPages && (
              <Page pageNumber={pageNumber + 1} renderMode="canvas" />
            )}
          </div>
        );
      case "nextDouble":
        return (
          <div className="pdf-double-page">
            {pageNumber + 1 <= numPages && (
              <Page pageNumber={pageNumber + 1} renderMode="canvas" />
            )}
            {pageNumber + 2 <= numPages && (
              <Page pageNumber={pageNumber + 2} renderMode="canvas" />
            )}
          </div>
        );
      default:
        return (
          <div className="pdf-single-page">
            <Page pageNumber={pageNumber} renderMode="canvas" />
          </div>
        );
    }
  };
  

  return (
    <div onContextMenu={handleContextMenu} className="pdf-container" style={{overflowX: mode == 'digital'?  'scroll' : 'visible'}}>
      <div class="page-info">
        {mode == "digital" && (
          <>
            <label htmlFor="viewMode">View Mode: </label>
            <select
              id="viewMode"
              value={viewMode}
              onChange={handleViewModeChange}
            >
              <option value="single">{`Page ${pageNumber}`}</option>
              <option value="double">{`Page ${pageNumber}-${
                pageNumber + 1 > numPages ? numPages : pageNumber + 1
              }`}</option>
              <option value="nextDouble">{`Page ${pageNumber + 1}-${
                pageNumber + 2 > numPages ? numPages : pageNumber + 2
              }`}</option>
            </select>
          </>
        )}
        <span style={{ marginLeft: "10px" }}>
        <button
          className="prev-button"
          onClick={onPrevPage}
          disabled={pageNumber <= 1}
        >
          &#x2039; {/* Left arrow */}
        </button>
          Page{" "}
          <input
            type="number"
            value={pageNumber}
            onChange={onPageNumberChange}
            min="1"
            max={numPages}
            className="page-number-input"
          />{" "}
          of {numPages}
          <button
          className="next-button"
          onClick={onNextPage}
          disabled={pageNumber >= numPages}
        >
          &#x203A; {/* Right arrow */}
        </button>
        </span>
      </div>
      <Document
        file={pdfURL}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
      >
        <div className="pdf-pages">{renderPages()}</div>
      </Document>
      <div className="pdf-navigation">


      </div>
    </div>
  );
};

export default PDFViewer;

import React from "react";
import DigitalSidebar from "../../components/digitalSidebar";
import { Grid, Box, Paper } from "@mui/material";
import PDFViewer from "../../components/PDFViewr";
import Header from "../../components/header";
import SideBar from "../../components/sideBar";
import * as bookServices from "../../services/book.services";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
const DigitalBook = () => {
    const bookId = useParams().bookId;
    const [book, setBook] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    useEffect(() => {
    setIsLoading(true);
        bookServices.getBookById(bookId).then((response) => {
            setBook(response.data);
            setIsLoading(false);
        }).catch((error) => {
            console.log(error);
            setIsLoading(false);
        });
    }, [bookId]);
  return (
    <>
    <Header />
    
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <SideBar />
        <Grid item xs={12} sm={3}>
          <DigitalSidebar book={book} setPageNumber={setPageNumber} />
        </Grid>
        <Grid item xs={12} sm={8}>
            {isLoading ? <Paper sx={{ p: 2 }}>Loading...</Paper> : <PDFViewer pdfURL={book.digitalEdition} propPageNumber={pageNumber} mode="digital"/>}
            
        </Grid>
      </Grid>
    </Box>
    </>

  );
};

export default DigitalBook;

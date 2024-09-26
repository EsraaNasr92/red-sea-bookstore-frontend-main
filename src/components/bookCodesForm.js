import React, { useState, useEffect } from "react";
import * as userServices from  "../services/user.services";
import "./bookCodesForm.css";
import { useHistory, useLocation } from 'react-router-dom';
import SideBar from "./sideBar";
const BookCodesForm = (props) => {
    const [bookCode, setBookCode] = useState("");
    const [bookAdded, setBookAdded] = useState(false);
    const [bookAddedError, setBookAddedError] = useState(false);
    const [codeIsAleradyUsed, setcodeIsAleradyUsed] = useState(false);
    const searchParams = new URLSearchParams(window.location.search);
    const history = useHistory()
  const handleSetBookCode = (event) => {
    const inputValue = event.target.value;
    if (inputValue.startsWith("RS")) {
      setBookCode(inputValue.slice(2)); // Update bookCode with characters after 'RS'
    }
    // You can add further validation or constraints here if needed
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if(localStorage.getItem("accessedBooks")?.includes(formatBookCode.split("-")[1]) ){
        setcodeIsAleradyUsed(true)
        setTimeout(() => {
            setcodeIsAleradyUsed(false)
        }, 3000)
    }
    else{
    userServices
      .addBook(formatBookCode)
      .then((res) => {
        if(res.error){
            setBookAddedError(true);
            setTimeout(() => {
                setBookAddedError(false);
            }, 3000)
        }
        else{
        setBookAdded(true);
        localStorage.setItem("accessedBooks", formatBookCode.split("-")[1])
        setTimeout(() => {
            window.location.reload();
        }
        , 2000)}
      })
      .catch((err) => {
        console.log(err);
      });
    }
  };
  const formatBookCode = `RS${bookCode}`;

  return (
    <>
    <div className="codes-form-container">
      <SideBar />

        <div className="form-container">
          <form onSubmit={handleSubmit}>
          <h4 className="activate-book-title">Activate your book</h4>
          <ol className="instructions">
              <li>Find your code at the back of the end cover of your book.</li>
              <li>Write the code in the same format “RS-XXXX-XXXX-XXXX”.</li>
              <li>The book expires after 2 years of activation.</li>
          </ol>
            <input
              type="text"
              value={formatBookCode.toUpperCase()}
              onChange={handleSetBookCode}
              placeholder="Book Code"
              className="book-code-input"
            ></input>
            <br/>
            {codeIsAleradyUsed && (
                <span className="error-message">You already have this book</span>
            )}
            {bookAdded && !bookAddedError && (
                <span className="success-message">Book added successfully</span>
                
            )}
            {bookAddedError && !bookAdded && (
                <span className="error-message">Book code is invalid or Book code has been used before</span>
            )}
            <button className="submit-form-button" type="submit">Submit</button>
            <div className="add-more-books">
            <button
              className="return-to-library"
              onClick={() => {props.setAddMoreBooks(false); searchParams.delete('addBooks'); history.replace({search: searchParams.toString()}) }}
            >
              Return to your library
            </button>
          </div>
          </form>

        </div>
        </div>
    </>
  )
};
export default BookCodesForm;
import axios from "axios";
import { ACCESS_TOKEN, BASE_URL, CLIENT_REF } from "../config/app.config";

const API_URL = `${BASE_URL}books`;

export const getBookById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/get-book-by-id/${CLIENT_REF}/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "x-access-token": ACCESS_TOKEN,
        },
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const getAllBooks = async () => {
    try {
        const response = await axios.get(`${API_URL}/get-all-books/${CLIENT_REF}`, {
        headers: {
            "Content-Type": "application/json",
            "x-access-token": ACCESS_TOKEN,
        },
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}


export const getExpiryDate = async (userId, codeBase) => {
    try {
        const response = await axios.get(`${BASE_URL}book-codes/get-expiry-date/${CLIENT_REF}/?userId=${userId}&codeBase=${codeBase}`, {
        headers: {
            "Content-Type": "application/json",
            "x-access-token": ACCESS_TOKEN,
        },
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}


export const filterBooks = async (title, publishYear, language, mediaType) => {
    try {
        const response = await axios.get(`${API_URL}/filter-books/${CLIENT_REF}?title=${title}&publishYear=${publishYear}&language=${language}&mediaType=${mediaType}`, {
        headers: {
            "Content-Type": "application/json",
            "x-access-token": ACCESS_TOKEN,
        },
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
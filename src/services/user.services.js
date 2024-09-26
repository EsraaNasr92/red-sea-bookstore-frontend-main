import axios from "axios";
import { ACCESS_TOKEN, BASE_URL, CLIENT_REF } from "../config/app.config";

const API_URL = `${BASE_URL}users`;

// Get all users
export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/get-all-users/${CLIENT_REF}`, {
      headers: {
        "Content-Type": "application/json",
        "x-access-token": ACCESS_TOKEN,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

// user sign up
export const signUp = async (data) => {
  try {
    const response = await axios.post(
      `${API_URL}/sign-up/${CLIENT_REF}`,
      { user: data },
      {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": ACCESS_TOKEN,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const Login = async (email, password) => {
  try {
    const clientIp = await axios
      .get("https://api.ipify.org?format=json")
      .then(async (res) => {
        return res.data.ip;
      });
    const platform =
      navigator.platform == "Win32"
        ? "Windows"
        : navigator.platform.includes("Linux arm")
        ? "Android"
        : navigator.platform;
    localStorage.setItem("clientIp", clientIp);
    const clientCounty = await axios
      .get(
        `https://api.ipgeolocation.io/ipgeo?apiKey=2f518f843b9b4a8ab75e9fa50d018be5&ip=${clientIp}`
      )
      .then((response) => {
        return response.data.country_name;
      })
      .catch((err) => {
        return null;
      });
    const response = await axios.post(
      `${API_URL}/sign-in/${CLIENT_REF}`,
      {
        userCredentials: {
          email,
          password,
          clientIp,
          deviceName: platform,
          country: clientCounty,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": ACCESS_TOKEN,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const Logout = async (id) => {
  try {
    const clientIp = localStorage.getItem('clientIp');
    const response = await axios.post(
      `${API_URL}/update-user-personal-info/${CLIENT_REF}?userId=${id}`,
      {user: {
        numberOfDevices: 'minus',
        clientIp: clientIp
      }},
      {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": ACCESS_TOKEN,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export const getUserBooks = async (id) => {
  
  try {
    const response = await axios.get(
      `${API_URL}/get-user-books/${CLIENT_REF}/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": ACCESS_TOKEN,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export const addBook = async (bookCode) => {
  try {
    const response = await axios.post(
      `${API_URL}/add-user-book/${CLIENT_REF}/${localStorage.getItem('id')}`,
      {bookCode: bookCode},
      {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": ACCESS_TOKEN,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}


export const getUserById = async (id, email) => {
  try {
    const response = await axios.get(
      `${API_URL}/get-user-by-id/${CLIENT_REF}/${email}?id=${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": ACCESS_TOKEN,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export const updateUserInfo = async (id, data) => {
  try {
    const response = await axios.post(
      `${API_URL}/update-user-personal-info/${CLIENT_REF}?userId=${id}`,
      {user: data},
      {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": ACCESS_TOKEN,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}


export const uploadFile = async (id, file, type) => {
  try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post(`${BASE_URL}upload/profile/${CLIENT_REF}/${id}`, formData, {
      headers: {
          "Content-Type": "multipart/form-data",
          "x-access-token": ACCESS_TOKEN,
      },
      });
      return response.data;
  } catch (error) {
      console.log(error);
  }
}


export const editPassword = async (email, oldPassword, newPassword) => {
  try {
    const response = await axios.post(
      `${API_URL}/reset-password/${CLIENT_REF}?mode=in_app&isAdmin=true`,
      {resetData:{ email, oldPassword, newPassword}},
      {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": ACCESS_TOKEN,
        },
      }
    );
    console.log(response)
    return response.data;
  } catch (error) {
    console.log(error);
  }
}


export const submitContactForm = async (data) => {
  try {
    const response = await axios.post(
      `${BASE_URL}contact/contact/${CLIENT_REF}`,
      {data},
      {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": ACCESS_TOKEN,
        },
      }
    );
    console.log(response)
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export const sendSupportEmail = async (data) => {
  try {
    const response = await axios.post(
      `${API_URL}/sendSupportEmail/${CLIENT_REF}/${localStorage.getItem('email')}`,
      {data},
      {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": ACCESS_TOKEN,
        },
      }
    );
    console.log(response)
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export const requestResetPassword = async (email) => {
  try {
    const response = await axios.post(
      `${API_URL}/request-password-reset/${CLIENT_REF}/${email}`,
      {email},
      {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": ACCESS_TOKEN,
        },
      }
    );
    console.log(response)
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export const resetPassword = async (newPassword, resetToken) => {
  try {
    const response = await axios.post(
      `${API_URL}/reset-password/${CLIENT_REF}?mode=email&isAdmin=false`,
      {resetData:{ newPassword, resetToken}},
      {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": ACCESS_TOKEN,
        },
      }
    );
    console.log(response)
    return response.data;
  } catch (error) {
    console.log(error);
  }
}
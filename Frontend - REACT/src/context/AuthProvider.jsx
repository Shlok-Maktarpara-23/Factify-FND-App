import { useState, createContext, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setLoggedIn] = useState(false);

  const checkLoggedInUser = async () => {
    let token = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!token) {
      setLoggedIn(false);
      setUsername("");
      return;
    }

    try {
      const response = await axios.get("http://127.0.0.1:8000/api/user/info/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLoggedIn(true);
      setUsername(response.data.username);
    } catch (error) {
      if (error.response?.status === 401 && refreshToken) {
        try {
          const refreshRes = await axios.post(
            "http://127.0.0.1:8000/api/user/token/refresh/",
            { refresh: refreshToken }
          );
          token = refreshRes.data.access;
          localStorage.setItem("accessToken", token);

          // Retry fetching user info with new token
          const response = await axios.get(
            "http://127.0.0.1:8000/api/user/info/",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setLoggedIn(true);
          setUsername(response.data.username);
        } catch {
          setLoggedIn(false);
          setUsername("");
        }
      } else {
        setLoggedIn(false);
        setUsername("");
      }
    }
  };

  useEffect(() => {
    checkLoggedInUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setLoggedIn,
        username,
        setUsername,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

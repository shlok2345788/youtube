import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
// signInWithPopup → Google login popup
// signOut → logout user
// onAuthStateChanged → detect login even after refresh

import { useState } from "react";
import { createContext } from "react";
import { provider, auth } from "./firebase";
import axiosInstance from "./axiosinstance"; //Used to talk to your backend API
import { useEffect, useContext } from "react";
import { getGeoLocation } from "./themeUtils";

const UserContext = createContext(); //enable us to use data globally

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userdata) => {
    //LOGIN FUNCTION
    setUser(userdata);
    localStorage.setItem("user", JSON.stringify(userdata));
  };
  const logout = async () => {
    //LOGOUT FUNCTION
    setUser(null);
    localStorage.removeItem("user");
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  const handlegooglesignin = async () => {
    //GOOGLE SIGN-IN FUNCTION
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseuser = result.user;
      
      const geo = await getGeoLocation();
      const location = geo?.region || "Unknown State";

      // Initiate Login (OTP Stage)
      let initiateRes;
      try {
        initiateRes = await axiosInstance.post("/user/initiate-login", { 
          email: firebaseuser.email,
          location: location
        });
      } catch (e) {
        // If non-south login requires mobile number, collect it and retry.
        if (e?.response?.status === 400 && e?.response?.data?.method === "mobile") {
          const phone = window.prompt("Enter your mobile number for OTP (10 digits or +91...):");
          if (!phone) throw new Error("Mobile number is required to login");
          initiateRes = await axiosInstance.post("/user/initiate-login", { 
            email: firebaseuser.email,
            location: location,
            phone,
          });
        } else {
          throw e;
        }
      }

      const method = initiateRes.data.method;
      let promptMsg = `An OTP has been sent to your ${method === "email" ? "Email" : "Mobile"}. Please enter it below:`;
      if (initiateRes.data.otp_mock) {
          promptMsg += ` (MOCK OTP: ${initiateRes.data.otp_mock})`;
      }

      const otp = window.prompt(promptMsg);
      if (!otp) throw new Error("OTP is required to login");

      // Verify OTP
      await axiosInstance.post("/user/verify-otp", {
          email: firebaseuser.email,
          otp: otp
      });

      const payload = {
        email: firebaseuser.email,
        name: firebaseuser.displayName,
        image: firebaseuser.photoURL || "https://github.com/shadcn.png",
      };
      const response = await axiosInstance.post("/user/login", payload);
      login(response.data.result);
    } catch (error) {
      console.error("Login flow failed:", error);
      alert(error.response?.data?.message || error.message || "Login failed");
    }
  };
  //   AUTO LOGIN
  useEffect(() => {
    const unsubcribe = onAuthStateChanged(auth, async (firebaseuser) => {
      //FireBase Listener
      //Fires when:
      // user logs in
      // page refreshes
      // app opens again
      if (firebaseuser) {
        // user is still loged in and firebase session is still valid
        try {
          const payload = {
            email: firebaseuser.email,
            name: firebaseuser.displayName,
            image: firebaseuser.photoURL || "https://github.com/shadcn.png",
          };
          const response = await axiosInstance.post("/user/login", payload);
          login(response.data.result);
        } catch (error) {
          console.error(error);
          logout();
        }
      }
    });
    return () => unsubcribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, login, logout, handlegooglesignin }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

// User clicks Google Login
// ↓
// Firebase authenticates
// ↓
// User info sent to backend
// ↓
// Backend returns user data
// ↓
// Context stores user
// ↓
// User stays logged in after refresh

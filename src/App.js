import React, { useEffect, useState } from "react";
// import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import ChatBox from "./pages/ChatBox";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import Chat from "./pages/Chat";
import Success from "./pages/Success";
import Verification from "./pages/Verification";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [ userAccess, setUserAccess ] = useState(false);
  
  useEffect(()=>{
  const userDetails = localStorage.getItem('userDetails');
  if(userDetails){
    setUserAccess(userDetails);
  }
  console.log("userDetailsINAPP: ", userDetails);
  }, []);
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="/" element={!userAccess? <LoginPage setUserAccess={setUserAccess}/> : <Navigate to="/chat" />}></Route>
        {/* <Route path="/test" element={<Chat />}></Route> */}
        <Route path="/register" element={!userAccess? <SignupPage /> : <Navigate to="/chat" />}></Route>
        <Route path="/chat" element={ !userAccess? <Navigate to="/" /> : <ChatBox /> }></Route>
        <Route path="/success" element={<Success />}></Route>
        <Route path="/verify" element={<Verification />}></Route>
      </Routes>
    </div>
  );
}

export default React.memo(App);

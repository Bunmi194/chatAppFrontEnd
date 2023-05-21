import React from "react";
// import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ChatBox from "./pages/ChatBox";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import Chat from "./pages/Chat";
import Success from "./pages/Success";
import Verification from "./pages/Verification";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  

  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<LoginPage />}></Route>
        <Route path="/test" element={<Chat />}></Route>
        <Route path="/register" element={<SignupPage />}></Route>
        <Route path="/chat" element={<ChatBox />}></Route>
        <Route path="/success" element={<Success />}></Route>
        <Route path="/verify" element={<Verification />}></Route>
      </Routes>
    </div>
  );
}

export default React.memo(App);

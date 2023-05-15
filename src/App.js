import React from "react";
// import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ChatGPTUI from "./pages/ChatUI";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import Chat from "./pages/Chat";

function App() {
  

  return (
    // <Router>
      <Routes>
        <Route path="/" element={<LoginPage />}></Route>
        <Route path="/test" element={<Chat />}></Route>
        <Route path="/register" element={<SignupPage />}></Route>
        <Route path="/chat" element={<ChatGPTUI />}></Route>
      </Routes>
  );
}

export default React.memo(App);

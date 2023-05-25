import React, { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import "./header.css";

const Header = () => {
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  const toggleRef = useRef(null);
  const navigate = useNavigate();
  const [ hideToggle, setHideToggle ] = useState(false);
  const userName = userDetails? `${userDetails.userExists[0].firstName} ${userDetails.userExists[0].lastName}`: "";

  const toggleDropdown = (event) => {
    setHideToggle(prev => !prev);
    console.log("toggleRef.current: ", toggleRef.current)
    console.log("event: ", event.target);
    
  }
  
  const handleLogout = () => {
    const userDetails = localStorage.getItem('userDetails');
    
    if (userDetails) {
      localStorage.removeItem('userDetails');
    }
    window.open('/', "_self");
  };

  return (
    <div className='header__wrapper'>
        <div className='header__name'>
            <div>
              <h1>ChatBox</h1>
            </div>
            <div>
              <img src='/logo.png' alt="app logo" className='chat__header__logo'/>
            </div>
        </div>
        <div className='header__info'>
          <div className='chat__header__username'>
            <span className='chat__header__usernametext'>{userName}</span>
            <button className='chat__header__dropdownbtn' onClick={toggleDropdown}>&#8964;</button>
          </div>
          <div className='chat__header__dropdown'>
            <div className={!hideToggle? "chat__header__dropdown__hide" : "chat__header__dropdown__show"}>
              <button ref={toggleRef} onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Header;
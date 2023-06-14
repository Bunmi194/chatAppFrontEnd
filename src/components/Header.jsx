import React, { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import "./header.css";

const Header = ({ sidebarToggle, setSidebarToggle }) => {
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  console.log("userDetails: ", userDetails);
  const toggleRef = useRef(null);
  const navigate = useNavigate();
  const [ hideToggle, setHideToggle ] = useState(false);
  const userName = userDetails? `${userDetails.userExists[0].firstName} ${userDetails.userExists[0].lastName}`: "";

  const toggleDropdown = (event) => {
    closeSidebar();
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

  const toggleSidebar = () => {
    setSidebarToggle(true);
    setHideToggle(false);
  }

  const closeSidebar = () => {
    setSidebarToggle(false);
  };
  return (
    <div className='header__wrapper'>
        <div className='header__name'>
            <div>
              <h1 className='header__text'>ChatBox</h1>
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
        {
          !sidebarToggle?
          <label class={`${sidebarToggle? "hide" : "show"} hamb`} for="side-menu" onClick={toggleSidebar}><span class="hamb-line"></span></label>
          :
          <span onClick={closeSidebar} className="close__sidebar">X</span>
        }
        
    </div>
  )
}

export default Header;
import React from 'react';
import "./header.css";

const Header = () => {
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  const userName = `${userDetails.userExists[0].firstName} ${userDetails.userExists[0].lastName}`
  return (
    <div className='header__wrapper'>
        <div className='header__name'>
            <h1>ChatBox</h1>
        </div>
        <div className='header__info'>
          <span>{userName}</span>
            <img />
            &#8964;
        </div>
    </div>
  )
}

export default Header;
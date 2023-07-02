import React, { useEffect, useState } from 'react';
import './success.css';

const Success = () => {
    const [ clicked, setClicked ] = useState(false);
    let mail = "sample@gmail.com";
    const toggleLoginAndMail = (event) => {
        if (!clicked) {
            event.preventDefault();
            // Update the state or perform any other desired actions
            setClicked(true);
            window.open(`https://${mail.split('@')[1]}`, "_blank");
          }
    }
    useEffect(()=>{
      localStorage.getItem("userEmail") ?
      // eslint-disable-next-line react-hooks/exhaustive-deps
      mail = JSON.parse(localStorage.getItem("userEmail"))
      :
      mail = "sample@gmail.com";
    }, []);
      
  return (
    <div className="verification-message">
      <div className="verification-message-content">
        <img className="app-logo" src="/logo.png" alt="Chat App Logo" />
        <h2 className="app-name">Chat-App</h2>
        <h1 className='chat__signupmessage'>Sign Up Successful &#127881;</h1>
        <p className="verification-text">
          Thank you for signing up! An email has been sent to your registered email address.
          Please check your inbox and follow the instructions to verify your account.
        </p>
        <a href={clicked ? `/` : `https://${mail.split('@')[1]}`} target="_self" rel="noreferrer" className="chat__mail__redirect" onClick={toggleLoginAndMail}>{clicked? `Login` : `Go to Inbox`}</a>
      </div>
    </div>
  );
};

export default Success;

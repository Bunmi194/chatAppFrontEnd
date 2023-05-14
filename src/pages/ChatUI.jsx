import React from 'react';
import './ChatGPTUI.css'; // Import custom CSS

const ChatGPTUI = () => {
  return (
    <div className="container">
      <div className="header">
        <h1>ChatGPT</h1>
        <p className="subtitle">AI Chatbot</p>
      </div>
      <div className="chat-container">
        <div className="chat-message">
          <p className="small text-muted">ChatGPT - 1 hour ago</p>
          <p>Hello! How can I assist you today?</p>
        </div>
        <div className="chat-message user">
          <p className="small text-muted">You - 5 minutes ago</p>
          <p>Hi, can you help me with a reservation?</p>
        </div>
        <div className="chat-message">
          <p className="small text-muted">ChatGPT - 4 minutes ago</p>
          <p>Sure! Please provide me with the details.</p>
        </div>
        <div className="chat-message user">
          <p className="small text-muted">You - 2 minutes ago</p>
          <p>I need a reservation for a table of 4 at 7 PM tonight.</p>
        </div>
        <div className="chat-message">
          <p className="small text-muted">ChatGPT - 1 minute ago</p>
          <p>Reservation confirmed! Thank you for choosing our restaurant.</p>
        </div>
      </div>
      <form className="message-form">
        <input type="text" placeholder="Type your message here..." />
        <button type="submit"><i className="fa fa-paper-plane"></i></button>
      </form>
    </div>
  );
};

export default ChatGPTUI;

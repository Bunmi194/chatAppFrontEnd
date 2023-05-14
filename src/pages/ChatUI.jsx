import React from 'react';
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import './ChatGPTUI.css'; // Import custom CSS
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');


const ChatGPTUI = () => {

  const [room, setRoom] = useState('');
  const [username, setUsername] = useState('');
  const [userList, setUserList] = useState([]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('userList', (data) => {
      console.log('User list received: ' + data);
      setUserList(data);
    });

    const handleNewMessage = (data) => {
      console.log('Message received: ' + data.content);

      // Add the message to the message list
      setMessages((messages) => [...messages, data]);
    };

    socket.on('message', handleNewMessage);

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    // Cleanup function
    return () => {
      socket.off('message', handleNewMessage);
    };
  }, [messages]);

  const handleJoin = () => {
    if (room && username) {
      socket.emit('join', { room, username });
    }
  };

  const handleMessageSend = () => {
    if (message) {
      const data = {
        room,
        username,
        content: message
      };
      socket.emit('message', data);
      setMessage('');
    }
  };


  return (
    <>
    {/* <div>
      <div>
        <input value={room} onChange={(e) => setRoom(e.target.value)} placeholder="Room" />
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
        <button onClick={handleJoin}>Join Room</button>
      </div>
      <div>
        <ul>
          {userList.map((user) => (
            <li key={user}>{user}</li>
          ))}
        </ul>
      </div>
      <div>
        {messages.map((message) => (
          <div key={message.id}>
            <b>{message.username}:</b> {message.content}
          </div>
        ))}
      </div>
      <div>
        <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message" />
        <button onClick={handleMessageSend}>Send</button>
      </div>
    </div> */}
    <Header />
    <div className='chat__overall__container'>
      <SideBar />
      <div className="container">
      <span className='chatbox__sender'>To: Bunmi Oladipupo</span>
      <div className="chat-container">
        <div className="chat-message">
          <div className='chat-message__wrapper'>
            <p className="small text-muted">Bunmi Oladipupo - 1 hour ago</p>
            <p>Hello! How can I assist you today?</p>
          </div>
        </div>
        <div className="chat-message user">
          <div className='chat-message__wrapper__chat-user'>
            <p className="small text-muted white">You - 5 minutes ago</p>
            <p>Hi, can you help me with a reservation?</p>
          </div>
        </div>
        <div className="chat-message">
          <div className='chat-message__wrapper'>
            <p className="small text-muted">Bunmi Oladipupo - 4 minutes ago</p>
            <p>Sure! Please provide me with the details.</p>
          </div>
        </div>
        <div className="chat-message user">
          <div className='chat-message__wrapper__chat-user'>
            <p className="small text-muted white">You - 2 minutes ago</p>
            <p>I need a reservation for a table of 4 at 7 PM tonight.</p>
          </div>
        </div>
        <div className="chat-message">
          <div className='chat-message__wrapper'>
            <p className="small text-muted">Bunmi Oladipupo - 1 minute ago</p>
            <p>Reservation confirmed! Thank you for choosing our restaurant.</p>
          </div>
        </div>
      </div>
      <form className="message-form">
        <input type="text" placeholder="Type your message here..." />
        <button type="submit"><i className="fa fa-paper-plane"></i></button>
      </form>
    </div>
    </div>
    </>
  );
};

export default ChatGPTUI;

import React from "react";
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

function App() {
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
    <div>
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
    </div>
  );
}

export default React.memo(App);

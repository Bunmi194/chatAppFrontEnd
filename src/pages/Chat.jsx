import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { v4 as uuid } from "uuid";

function Chat() {
  const [message, setMessage] = useState("");
  const [recipientId, setRecipientId] = useState("");

  const socket = useRef();
  const userIdRef = useRef(null);
  let newUserId;

  const newId = useRef(uuid()).current;
  let id;

  useEffect(() => {
    id = newId;
    socket.current = io("http://localhost:4000");
  }, []);

  useEffect(() => {
    // get user ID from local storage or generate a new one
    localStorage.removeItem("userId");
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      userIdRef.current = storedUserId;
    } else {
      newUserId = id;
      userIdRef.current = newUserId;
      localStorage.setItem("userId", newUserId);
    }

    // listen for incoming messages
    socket.current.on(`message:${userIdRef.current}`, (data) => {
      // console.log(`Message received: ${data.content}`);
      // handle the incoming message
    });
    socket.current.on("userList", (data) => {
      //receiving array of objects from server containing userId and socketId
      // console.log(data);
    });
    socket.current.on("welcome", (data) => {
      // console.log(data);
    });
    socket.current.on("privateMessage", (data) => {
      // console.log("private message", data);
    });

    socket.current.emit("join", newUserId);
    return () => {
      socket.current.off(`message:${userIdRef.current}`, (data) => {
        // console.log(`Message received: ${data.content}`);
        // handle the incoming message
      });
    };
  }, []);

  const sendMessage = () => {
    // construct message object
    const messageObject = {
      sender: userIdRef.current,
      recipient: recipientId,
      content: message,
    };

    // send message to server
    socket.current.emit("message", messageObject);
  };

  return (
    <div>
      <h1>Chat App</h1>
      <input
        type="text"
        placeholder="Recipient ID"
        value={recipientId}
        onChange={(e) => setRecipientId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send Message</button>
    </div>
  );
}

export default React.memo(Chat);

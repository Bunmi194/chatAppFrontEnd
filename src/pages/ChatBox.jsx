import React from 'react';
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import './chatbox.css'; // Import custom CSS
import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { v4 as uuid }from "uuid";

const dateFormatOptions = {
  month: 'long',
  day: 'numeric'
};

const timeFormatOptions = {
  hour: 'numeric',
  minute: 'numeric',
  hour12: true
};

const today = (dateString) => {
  return new Date(dateString) === new Date();
};

// const socket = io('http://localhost:4000');

const ChatBox = () => {

  const [ sidebarToggle, setSidebarToggle ] = useState(false);
  const [room, setRoom] = useState('');
  const [ status, setStatus] = useState(false);
  const [ messageStatus, setMessageStatus] = useState(false);
  const [ activeNames, setActiveNames] = useState('');
  const [username, setUsername] = useState(''); 
  const [usersList, setUsersList] = useState([]);
  const [message, setMessage] = useState('');
  const [ activeUser, setActiveUser ] = useState({});
  const [ receiverId, setReceiverId ] = useState("");
  const [messages, setMessages] = useState([]);//holds chat messages
  const [ getAllMessages, setGetAllMessages ] = useState([]);
  const [ connectedUsersSocketDetails, setConnectedUsersSocketDetails ] = useState([]);
  const inputRef = useRef(null);
  const [recipientId, setRecipientId] = useState('');
  const chatContainerRef = useRef(null);
  const socket = useRef();
  const userIdRef = useRef(null);
  let newUserId;
  let userDetails;
  let id;

  userDetails = localStorage.getItem('userDetails');
  console.log("userDetailsNEWLOGIN: ", userDetails);
  console.log("receiverId: ", receiverId);
  
  
  useEffect(()=>{

    const connectDetails = connectedUsersSocketDetails.find(user => user.userId === receiverId);
    setRecipientId(connectDetails?.socketId);
    console.log("connectDetails: ", connectDetails)
    console.log("receiverId: ", receiverId)
    console.log("connectedUsersSocketDetails: ", connectedUsersSocketDetails)
    console.log("loggedInUser: ", userDetails)
    console.log("recipientId: ", recipientId)
    // get user ID from local storage or generate a new one
    console.log("userDetails: ", userDetails);
    newUserId = userDetails?.userExists[0]?._id;
    console.log("newUserId: ", newUserId);
  })
  useEffect(()=>{
    
    socket.current = io('http://localhost:4000');
    console.log("socket: ", socket.current);
  }, []);
  
  useEffect(()=>{
    chatContainerRef.current.scrollIntoView(
    {
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest'
    })
  }, [messages])
  userDetails = JSON.parse(localStorage.getItem('userDetails'));
  useEffect(() => {
    // listen for incoming messages
    socket.current.on(`message:${userIdRef.current}`, (data) => {
      console.log(`Message received: ${data.content}`);
      // handle the incoming message
    });
    socket.current.on("userList", (data) => {
      //receiving array of objects from server containing userId and socketId
      console.log(data);
      setConnectedUsersSocketDetails(data);
    })
    socket.current.on("welcome", (data) => {
      console.log(data);
    })
    socket.current.on("privateMessage", (data) => {
      console.log("private message", data);
      setActiveUser(data);//I need sender Id
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: uuid(),
          senderId: data.senderId,
          receiverId: data.receiverId,
          createdAt: data.createdAt,
          message: data.message,
          content: data.message
        },
      ]);
      setStatus(true);
      console.log("all messages from socket: ", getAllMessages);
      console.log("usersList from socket: ", usersList);
      console.log("messages from socket: ", messages);
    });
    if(newUserId){
      socket.current.emit('join', newUserId);
    }
    return ()=>{
      socket.current.off(`message:${userIdRef.current}`, (data) => {
        console.log(`Message received: ${data.content}`);
        // handle the incoming message
      });
    }
  }, []); 

  // const sendMessage = () => {
  //   // construct message object
  //   const messageObject = {
  //     sender: userIdRef.current,
  //     recipient: recipientId,
  //     content: message,
  //   };

  //   // send message to server
  //   socket.current.emit('message', messageObject);
  // };

  const handleMessageSend = async (e) => {
    e.preventDefault();
    console.log("messages: ", messages);
    console.log("message: ", message);
    if(!message){
      return;
    }
    const newMessage = {
      id: uuid(),
      createdAt: new Date().toISOString(),
      senderId: userDetails.userExists[0]._id,
      receiverId,
      message,
      content: message,
      name: "You"
    };
    // send message to server
    console.log("messages: ", messages)
    console.log("typeof messages: ", typeof messages)
    let newArray = [...messages];
    newArray.push(newMessage);
    setMessages(newArray);
    setMessage("");
    socket.current.emit('message', newMessage);
    const token = userDetails.token;
    fetch("http://localhost:4000/v1/chats", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${token}`,
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        senderId: newMessage.senderId,
        recipientId: newMessage.receiverId,
        content: newMessage.content,
        delivered: false
      })
    });
    // if (message) {
    //   const data = {
    //     room,
    //     username,
    //     content: message
    //   };
    //   socket.emit('message', data);
    //   setMessage('');
    // }
  };


  
  return (
    <>
    <Header setSidebarToggle={setSidebarToggle} sidebarToggle={sidebarToggle} />
    {/* <input type="text" placeholder="Enter recipient id" onChange={(e)=>setRecipientId(e.target.value)}/> */}
    <div className='chat__overall__container'>
      <SideBar receiverId={receiverId} setReceiverId={setReceiverId} activeUser={activeUser} setMessages={setMessages} receivedMessages={messages} usersList={usersList} setUsersList={setUsersList} getAllMessages={getAllMessages} setGetAllMessages={setGetAllMessages} activeNames={activeNames} setActiveNames={setActiveNames} messageStatus={messageStatus} setMessageStatus={setMessageStatus} setSidebarToggle={setSidebarToggle} sidebarToggle={sidebarToggle} />
      <div className="container" >
      <span className='chatbox__sender'>To: {activeNames ? activeNames : ""}</span>
      <div className="chat-container" >
        
        {/* message chat starts */}
        <div ref={chatContainerRef}>
        {
          !messageStatus ?
          <div className="chat__nochat">
            <div>
              <span>Click on a user to chat</span>
            </div>
            <div>
              <img src="/chat.png" alt="no user found"/>
            </div>
          </div>
       :
       messages && messages.map(message => (
            <div key={message.id} className={`${message.senderId !== JSON.parse(localStorage.getItem('userDetails')).userExists[0]._id? "chat-message" : "chat-message user"}`}>
            <div className={`${message.senderId !== JSON.parse(localStorage.getItem('userDetails')).userExists[0]._id? "chat-message__wrapper" : "chat-message__wrapper__chat-user"}`}>
              <p className={`small text-muted ${message.senderId === JSON.parse(localStorage.getItem('userDetails')).userExists[0]._id? "white" : "black"}`}>{`${message.senderId === JSON.parse(localStorage.getItem('userDetails')).userExists[0]._id? "You" : `${activeNames}`} - ${message? today(message.createdAt)? new Date(message.createdAt).toLocaleString('en-us', timeFormatOptions) : new Date(message.createdAt).toLocaleString('en-us', dateFormatOptions) : ""}`}</p>
              <p>{message.message? message.message : message.content}</p>
            </div>
          </div>
          ))}
        </div>
        {/* <div className="chat-message">
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
        </div> */}
      </div>
      {/* message chat ends */}
      <form className="message-form">
        <input ref={inputRef} type="text" placeholder="Type your message here..." onChange={(e)=> setMessage(e.target.value)} value={message} readOnly={!messageStatus}/>
        <button type="submit" onClick={(e)=>handleMessageSend(e)}>
          <img src="/send.png" alt="send message" className='chat__send__icon'/>
        </button>
      </form>
    </div>
    </div>
    </>
  );
};

export default React.memo(ChatBox);

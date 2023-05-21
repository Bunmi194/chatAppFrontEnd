import React, { useState, useEffect, useCallback } from "react";
import "./sidebar.css";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

const dateFormatOptions = {
  month: 'long',
  day: 'numeric'
};

const timeFormatOptions = {
  hour: 'numeric',
  minute: 'numeric',
  hour12: true
};

const SideBar = ({ receiverId, setReceiverId, activeUser, setMessages, receivedMessages, usersList, setUsersList, getAllMessages, setGetAllMessages }) => {
  const [searchEmail, setSearchEmail] = useState("");

  let userDetails;

  const updateReceiverDetails = (myUsers, messages) => {
    //make fetchmessages run on every click to update messages with what's in the database
    console.log("user: ", myUsers);
    console.log("messages Update: ", messages);
    setReceiverId(myUsers);
    const activeMessages = getAllMessages.find(message => message._id === myUsers);
    if(activeMessages){
      const displayMessages = [...activeMessages.messages].reverse();
      setMessages(displayMessages);
    } 
    // const reverseMessages = [...result.messages[0].messages]
    // //takes -messages- and -setMessages-
    // setMessages([
    //   ...receivedMessages,
    //   ...reverseMessages.reverse()
    // ])
    // alert(receiverId);
    // return;
  }

  const today = (dateString) => {
    return new Date(dateString) === new Date();
  };

  const searchUser = async (searchObject) => {
    if (!searchEmail && !activeUser.senderId) {
      toast.error("Email is required", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    const users = await fetch("http://localhost:4000/v1/users/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(searchObject),
    });
    const result = await users.json();
    console.log("result: ", result);
    console.log("usersList: ", usersList);
    if (!result || result.status !== "success") {
      toast.error(`Error: ${result.status}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    // const existingUsers = [...usersList];
    // const newUsers = existingUsers.push(result.user[0]);
    //include the message
    setUsersList([
        ...usersList,
        result.user[0]
    ]);
  };

  useEffect(()=>{
    //senderId

    userDetails = JSON.parse(localStorage.getItem('userDetails'));
    if(activeUser.senderId){
      console.log("ID: ", activeUser.senderId)
      console.log("usersList in EFFECT: ", usersList);
      const userExists = usersList.find(user => user._id === activeUser.senderId);
      if(!userExists){
        searchUser({ id: activeUser.senderId });
      }
    }
    console.log("activeUser: ", activeUser)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeUser]);

  const fetchmessages = async () => {
    const token = userDetails.token;
    const messages = await fetch(`http://localhost:4000/v1/chats`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "authorization": `Bearer ${token}`
      }
    });
    const result = await messages.json();
    console.log("result: ", result);
    if(result.messages){
      setUsersList([
        ...usersList,
        ...result.messages
      ]);
      setGetAllMessages([...result.messages]);
    }
    // console.log("result.messages.messages: ", result.messages[0].messages);
    // console.log("receivedMessages: ", receivedMessages);
    
    // console.log("usersList: ", usersList);
  };
  console.log("GetAllMessages: ", getAllMessages);

  useEffect(()=>{
    //fetch all messages
    fetchmessages();
    
  }, [])
  console.log("usersList: ", usersList);
  return (
    <div className="chat__sidebar">
      <input
        type="text"
        placeholder="Search for a user..."
        id="chat__search"
        onChange={(e) => setSearchEmail(e.target.value)}
      />
      <button className="chat__btn__go" onClick={()=>searchUser({ email: searchEmail })}>
        Go
      </button>
      {/* profile of sent messages */}
      <div className="chat__list__wrapper">
        {
        usersList &&
          usersList.map((myUsers) => (
            <div className="chat__messages__sent__wrapper" onClick={()=>{updateReceiverDetails(myUsers._id, myUsers.messages)}} key={myUsers._id}>
            <>
              <div className="">
                {/* image */}

                <img
                  src="/profile.jpg"
                  alt="profile"
                  className="chat__profile__image"
                />
              </div>
              <div className="chat__message__user__info__wrapper">
                {/* details */}
                <div className="chat__message__user__info">
                  <div>
                    {/* name */}
                    <h3 className="chat__user__name">{myUsers.name? myUsers.name : `${myUsers.user.firstName} ${myUsers.user.lastName}`}</h3>
                  </div>
                  <div>
                    {/* time */}
                    {myUsers.user.createdAt? <img
                      src="/history.png"
                      alt="time"
                      className="chat__message__history"
                    />
                :
                ""}
                    {!myUsers.user.createdAt? "" : today(myUsers.user.createdAt)?new Date(myUsers.user.createdAt).toLocaleString('en-us', timeFormatOptions) : new Date(myUsers.user.createdAt).toLocaleString('en-us', dateFormatOptions)}
                  </div>
                </div>
                {/* message */}
                <span className="chat__message__sidebar">
                {myUsers.messages[0].content? myUsers.messages[0].content : ""}
                </span>
              </div>
            </>
      </div>
          ))
          }
      </div>
    </div>
  );
};

export default React.memo(SideBar);

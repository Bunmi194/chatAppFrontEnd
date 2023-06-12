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

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const SideBar = ({ receiverId, setReceiverId, activeUser, setMessages, receivedMessages, usersList, setUsersList, getAllMessages, setGetAllMessages, activeNames, setActiveNames, messageStatus, setMessageStatus }) => {
  const [searchEmail, setSearchEmail] = useState("");
  const [ searchLoading, setSearchLoading] = useState(false);
  let userDetails;
  
  const updateReceiverDetails = async (myUsers, messages, firstName, lastName) => {
    //make fetchmessages run on every click to update messages with what's in the database
    console.log("user: ", myUsers);
    console.log("messages Update: ", messages);
    if(!messages){
      setReceiverId(myUsers);
    setActiveNames(`${firstName} ${lastName}`);
    setMessageStatus(true);
      return setMessages([]);
    }
    console.log("getAllMessages Update: ", getAllMessages);
    setReceiverId(myUsers);
    setActiveNames(`${firstName} ${lastName}`);
    setMessageStatus(true);
    const activeMessages = getAllMessages.find(message => message._id === myUsers);
    if(activeMessages){
      const displayMessages = [...activeMessages.messages].reverse();
      console.log("displayMessages1: ", displayMessages)
      setMessages(displayMessages);
    } 

    if(userDetails){
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
      
      console.log("result ON CLICK: ", result);
      // if(result.messages){
      //   setGetAllMessages([...result.messages]);
        
      //   const activeMessages = getAllMessages.find(message => message._id === myUsers);
        
      //   console.log("result ON CLICK for activeMessages: ", activeMessages);
      //   if(activeMessages){
      //     const displayMessages = [...activeMessages.messages].reverse();
      //     console.log("displayMessages2: ", displayMessages)
      //     setMessages(displayMessages);
      //   } 
      // }
      if (result.messages) {
        setGetAllMessages(prevMessages => {
          const activeMessages = result.messages.find(message => message._id === myUsers);
          if (activeMessages) {
            const displayMessages = [...activeMessages.messages].reverse();
            setMessages(displayMessages);
          }
          return [...result.messages];
        });
      }
    
    }
    // const reverseMessages = [...result.messages[0].messages]
    // //takes -messages- and -setMessages-
    // setMessages([
    //   ...receivedMessages,
    //   ...reverseMessages.reverse()
    // ])
    // alert(receiverId);
    // return;
    // updateReceiverDetails(myUsers, messages, firstName, lastName)
  }

  const today = (dateString) => {
    return new Date(dateString) === new Date();
  };

  const searchUser = async (searchObject) => {
    setSearchLoading(true);
    if (!searchEmail && !activeUser.senderId) {
      toast.error("Email is required", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setSearchLoading(false);
      return;
    }
    const users = await fetch("http://localhost:4000/v1/users/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "authorization": `Bearer ${JSON.parse(localStorage.getItem("userDetails")).token}`
      },
      body: JSON.stringify(searchObject),
    });
    const result = await users.json();
    console.log("result: ", result);
    console.log("usersList: ", usersList);
    if (!result || result.status !== "success") {
      toast.error(`Error: ${result.message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setSearchLoading(false);
      return;
    }
    // const existingUsers = [...usersList];
    // const newUsers = existingUsers.push(result.user[0]);
    //include the message
    setUsersList([
        ...usersList,
        result.user[0]
    ]);
    setSearchLoading(false);
  };

  useEffect(()=>{

  }, [receivedMessages])
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
    if(userDetails){
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
    }
    // console.log("result.messages.messages: ", result.messages[0].messages);
    // console.log("receivedMessages: ", receivedMessages);
    
    // console.log("usersList: ", usersList);
  };
  console.log("GetAllMessages: ", getAllMessages);

  useEffect(()=>{
    //fetch all messages
    fetchmessages();
    
  }, [userDetails]);

  console.log("usersList: ", usersList);
  console.log("receivedMessages: ", receivedMessages);
  console.log("createdAt1: ", receivedMessages[receivedMessages.length - 1]);
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
          searchLoading?
          <div className="chat__sidebar__spinner">
            <ClipLoader color="#000" loading={true} css={override} size={50} />
          </div>
          :
        !usersList.length ? 
        <div className="chat__nouser">
          <div>
            <span>No User Found</span>
          </div>
          <div>
            <img src="/users-avatar.png" alt="no user found"/></div>
          </div>
        : 
        usersList &&
          usersList.map((myUsers) => (
            <div className="chat__messages__sent__wrapper" onClick={()=>{updateReceiverDetails(myUsers._id, myUsers.messages, myUsers.user? myUsers.user.firstName : myUsers.firstName, myUsers.user? myUsers.user.lastName : myUsers.lastName)}} key={myUsers._id}>
            <>
              <div className="">
                {/* image */}

                <img
                  src="/user.png"
                  alt="profile"
                  className="chat__profile__image"
                />
              </div>
              <div className="chat__message__user__info__wrapper">
                {/* details */}
                <div className="chat__message__user__info">
                  <div>
                    {/* name */}
                    <h3 className="chat__user__name">{myUsers.user? `${myUsers.user.firstName} ${myUsers.user.lastName}` : `${myUsers.firstName} ${myUsers.lastName}`}</h3>
                  </div>
                  <div>
                    {/* time */}
                    {myUsers.user || myUsers.createdAt ? <img
                      src="/history.png"
                      alt="time"
                      className="chat__message__history"
                    />
                :
                ""}
                    {!receivedMessages.length > 0 ? today(myUsers.createdAt || myUsers.user.createdAt)?new Date(myUsers.createdAt || myUsers.user.createdAt).toLocaleString('en-us', timeFormatOptions) : new Date(myUsers.createdAt || myUsers.user.createdAt).toLocaleString('en-us', dateFormatOptions) : today(receivedMessages[receivedMessages.length - 1].createdAt) ? new Date(receivedMessages[receivedMessages.length - 1].createdAt).toLocaleString('en-us', timeFormatOptions) :
                    new Date(receivedMessages[receivedMessages.length - 1].createdAt).toLocaleString('en-us', dateFormatOptions)}
                  </div>
                </div>
                {/* message */}
                <span className="chat__message__sidebar">
                {myUsers.messages? myUsers.messages[0].content : "" }
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

import React from 'react'
import "./sidebar.css";

const SideBar = () => {
  return (
    <div className='chat__sidebar'>
        <input type="text" placeholder="Search for a user..." id="chat__search"/>
        {/* profile of sent messages */}
        <div className='chat__messages__sent__wrapper'>
            <div>
                {/* image */}
                
                <img src='/profile.jpg' alt="profile" className='chat__profile__image'/>
            </div>
            <div className='chat__message__user__info__wrapper'>
                
                {/* details */}
                <div className='chat__message__user__info'>
                    <div>
                        {/* name */}
                        <h3 className="chat__user__name">Bunmi Oladipupo</h3>
                    </div>
                    <div>
                        {/* time */}
                        <img src="/history.png" alt="time" className='chat__message__history'/>
                        03 Sep
                    </div>
                </div>
                {/* message */}
                <span className='chat__message__sidebar'>Reservation confirmed! Thank you for choosing our restaurant.</span>
            </div>
        </div>
    </div>
  )
}

export default SideBar;
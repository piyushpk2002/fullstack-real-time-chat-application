import React, { useEffect, useRef } from 'react'
import {useChatStore} from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './skeletons/MessageSkeleton';




const ChatContainer = () => {

  const {messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unSubscribeToMessages} = useChatStore();
  const {authUser} = useAuthStore();
  const msgRef = useRef();

  useEffect(()=>{
    getMessages(selectedUser._id)

    subscribeToMessages();
    //console.log("messages: ", messages);
    //This unSubscribeToMessages is a clean up function, and react runs before the next useEffect run
    return () => unSubscribeToMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unSubscribeToMessages])

  useEffect(() =>{
    if(msgRef.current && messages){
      msgRef.current.scrollIntoView({behaviour: "smooth"});
    }
  }, [messages])

  if(isMessagesLoading){
    return(
    <div className='flex-1 p-4 space-y-4 overflow-y-auto'>
      <ChatHeader />
      <MessageSkeleton />
      <MessageInput />
    </div>)
  }

  

  return (
    <div className = "flex-1 flex-col overflow-auto">
      <ChatHeader />

    <div className = 'className="flex-1 overflow-y-auto p-4 space-y-4"'>
        {messages.map((msg) =>(
          
            <div key = {msg._id} className = {`chat ${msg.senderId === authUser._id ? "chat-end":"chat-start"}`} ref = {msgRef}>
              <div className = 'chat-image avatar'>
                <div className='w-10 rounded-full border'>
                  <img src = {msg.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"} />
                </div>
              </div>

              <div className = "chat-header mb-2">
                <time className="text-xs opacity-50 ml-1">{msg.createdAt}</time>
              </div>
              
              <div className='chat-bubble flex flex-col rounded-md'>
                {msg.image && (
                <img 
                  src = {msg.image}
                  alt = "Attatchment"
                  className='sm:max-w-[200px] rounded-md mb-8'
                 />
                )}

                {(msg.text != "") && (<p>{msg.text}</p>)}

              </div>

            </div>
          
        ))}
    </div>

      <MessageInput />
    </div>
  )
}

export default ChatContainer
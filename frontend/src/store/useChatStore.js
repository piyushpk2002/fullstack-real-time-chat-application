import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast';
import { useAuthStore } from './useAuthStore';
import { use } from 'react';


export const useChatStore = create((set, get) =>({
    isMessageLoading: false,
    isUsersLoading: false,
    selectedUser: null,
    messages: [],
    users: [],

    getUsers: async () =>{
        set({isUsersLoading: true})
        try {
            const res = await axiosInstance.get('/message/users');
            console.log(res);
            
            set({users: res.data})
        } catch (error) {
            toast.error("Error in fetching users");
        }finally{
            set({isUsersLoading: false})
        }
    },

    getMessages: async (userId)=>{

        set({isMessageLoading: true})
        try {
            const res = await axiosInstance.get(`/message/${userId}`);
            //console.log(res.data);
            
            set({messages: res.data});
        } catch (error) {
            toast.error('Error in fetching messages');
        }finally{
            set({isMessageLoading: false});
        }
    },

    sendMessage: async (messageData)=>{
         
        const {selectedUser, messages} = get()
        //console.log(selectedUser);
        
        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData)
            set({messages: [...messages, res.data]})

        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    //todo: optimize this later 
    setSelectedUser: (selectedUser) => set({selectedUser}),

    subscribeToMessages: ()=>{
        //if any user is selected then only subscribe to messages
        const { selectedUser } = get();
        if(!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket.on('newMessage', (newMessage) =>{
            //console.log("newMessage: ", newMessage);
            //previously sending message to offline user also updates to the online 
            // user chat Container, so we don't want to update messages, 
            // if selected user and the user to whom message is sent is not same.
            if(newMessage.senderId != selectedUser._id) return
            set(
                {
                    messages: [...get().messages, newMessage]
                }
            )
        })
    },

    unSubscribeToMessages: ()=>{
        //as we click on close button we are going to unsubsribe or stop listening to the any newMessage event;
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    }

}))
import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast';
import { io } from 'socket.io-client'

const BASE_URL = import.meta.env.mode === 'devlopment' ? "http://localhost:5001/": "/"

export const useAuthStore = create((set, get)=>({

    authUser: null,

    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,

    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        try {
            
            const res = await axiosInstance.get('/auth/check-auth');
            set ({authUser: res.data})
            get().connectSocket();
        } catch (error) {
            console.log("Error in checkin auth", error);
            set({authUser: null});
        }finally{
            set({isCheckingAuth: false});
            //console.log(authUser);
            
        }
    },

    signUp: async (formData)=>{
        set({isSigningUp: true});
        try { 
             const res = await axiosInstance.post('/auth/signup', formData);
             if(res){
                set({authUser: res.data});
                toast.success("Account created successfully")    
            }
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({isSigningUp: false});
            //console.log(authUser);
            
        } 
    },

    login: async (formData) => {
       // console.log(formData);
        
        set({isLoggingIn: true});
        try {
            const res = await axiosInstance.post('/auth/login', formData);

            if(res){
                toast.success('Logged In Successfully');
                set( {authUser: res.data} );
            }
            get().connectSocket();  
        } catch (error) {
            console.log("error: ",error);
            
            toast.error(error.response.data.message);
        }finally{
            set({isLoggingIn: false}); 
        }
    },

    logout: async () => {
        try {
            const res = await axiosInstance.put('/auth/logout');

            if(res){
                toast.success('Logged out successfully');
                set({ authUser: null })
            }
            get().disconnectSocket();
        } catch (error) {
            toast.error(error.response.data.message);         
        }
    },

    updateProfile: async (profilePic) =>{
        set({ isUpdatingProfile: true })
        try {
            const res = await axiosInstance.post('/auth/updateProfile', profilePic)
            //console.log(res);
            
            set({authUser: res.data});
            if(res){
                toast.success('Profile Update Successfully');
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({ isUpdatingProfile: false })
        }
    },

    connectSocket: () =>{

        const {authUser} = get();
        if(!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id, 
            }
        });
         socket.connect(); // on calling socket.connect() and on successfull connection this emits a 'connected' event itself
        set({socket: socket});

        socket.on('getOnlineUsers', (userIds) =>{
            console.log(userIds);
            
            set({onlineUsers: userIds});
        })

    },

    disconnectSocket: () =>{
        if(get().socket?.connected) get().socket.disconnect();
    }
    
}))
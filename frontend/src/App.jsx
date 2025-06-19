import './App.css'
import Navbar from './components/Navbar'
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import SettingPage from './pages/SettingPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import { useEffect } from 'react'

import { useAuthStore } from './store/useAuthStore'

import { Loader } from 'lucide-react'
import { Toaster } from 'react-hot-toast'
import { useThemeStore } from './store/useThemeStore'

function App() {
  
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  console.log(authUser);
  console.log("ONLINE USERS; ", onlineUsers);
  
  
  const {theme} = useThemeStore();

  useEffect(() =>{
    checkAuth();
  }, [checkAuth])

  console.log(authUser);

  if(isCheckingAuth && !authUser){
   return(
     <div className='flex justify-center items-center h-screen'>
      {/* Loader is coming from npi - lucide-reacrt library */}
        <Loader className = 'size-10 animate-spin' /> 
    </div>
   )
  }

  return (
    <div data-theme = {theme}>
      <Navbar />
      <Routes>
        <Route path = '/' element = {authUser ? <HomePage />: <Navigate to = '/login'/>} />
        <Route path = '/signup' element = {!authUser ? <SignUpPage /> : <Navigate to = '/' />} />
        <Route path = '/login' element = {!authUser ?<LoginPage /> : <Navigate to = '/' />} />    
        <Route path = '/settings' element = {<SettingPage />} />
        <Route path = '/profile' element = {authUser ? <ProfilePage /> : <Navigate to = '/login'/>} />
      </Routes>

       <Toaster />
    </div>
  )
}

export default App

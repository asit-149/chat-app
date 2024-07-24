import React from 'react'
import {BrowserRouter,Routes,Route} from "react-router-dom"
// import Register from './pages/Register'
import Login from './pages/Login'
import Chat from './pages/Chat'
import Register from './pages/Register'
import SetAvatar from './pages/SetAvatar'
// import Register from './pages/Register'
export default function App() {
  return (
    <BrowserRouter>
     <Routes>
      <Route path='/register' element={<Register/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/setAvatar' element={<SetAvatar/>}/>
      <Route path='/' element={<Chat/>}/>
     </Routes>
    </BrowserRouter>
  )
}

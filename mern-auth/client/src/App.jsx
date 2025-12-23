import { BrowserRouter,Routes,Route,Link } from "react-router-dom"
import Home from "./pages/Home";
import Login from "./pages/Login";
import EmailVerify from "./pages/EmailVerify";
import ResetPassword from "./pages/ResetPassword";
import { ToastContainer, toast } from 'react-toastify';


function App(){

  return(
    <div>

      {/* <Link to='/'>Home</Link>
      <Link to='/login'>Login</Link>
      <Link to='/email-verify'>Email-Verify</Link>
      <Link to='/reset-password'>Reset-Password</Link> */}

      <ToastContainer />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/email-verify' element={<EmailVerify />} />
        <Route path='/reset-password' element={<ResetPassword />} />
      </Routes>

    </div>
  )
}

export default App;    

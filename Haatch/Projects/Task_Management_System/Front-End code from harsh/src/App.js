
import './App.css';
import Login from './Pages/login';
import {useState} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./containers/header";
import AddUser from './Pages/adduser';
import AddNew from './Pages/addNewUser';
import Home from './Pages/home';
import Footer from './containers/footer';
import AddNewUser from './Pages/addNewUser';
import Users from './Pages/users';
import EditUser from './Pages/editUser';
import UserLogin from './Pages/userLogin';
import ResetPassword from './Pages/resetpassword';
import ResetForgotPassword from './Pages/resetForgotPassword';
import Job from './Pages/job';
function App() {
  console.log(UserLogin,"user_Login");
  const [showHeader,setShowHeader]=useState(true);
  const [profileData,setProfileData]=useState();
  return (
    <div className='App d-flex flex-column'>
      {showHeader && (<Header profileData={profileData} setProfileData={setProfileData}/>)}
      {/* <Head profileData={profileData}/> */}
    

    <Routes>
      <Route exact path="/" element={<Home/> }/>
      <Route exact path="/create-job" element={<Job setShowHeader={setShowHeader}/>}/>
      <Route exact path="/reset-password/:id" element={<ResetForgotPassword setShowHeader={setShowHeader}/>}/>
      <Route exact path="/user-login" element={<UserLogin setShowHeader={setShowHeader} setProfileData={setProfileData} />}/>
      <Route exact path="/reset" element={<ResetPassword setShowHeader={setShowHeader}/> }/>
      <Route exact path="/Users" element={<Users/>}/>
      <Route exact path="/edit/:id" element={<EditUser/>}/>
      <Route exact path="/add_new_user" element={<AddNewUser setShowHeader={setShowHeader}/>}/>
      <Route exact path="/add" element={<AddUser setShowHeader={setShowHeader}/>}/>
      <Route exact path="/login" element={<Login setShowHeader={setShowHeader} setProfileData={setProfileData}/>} />
      <Route exact path="/Register" element={<></>}/>
    </Routes>
    <Footer/>
    </div>
  );
}

export default App;

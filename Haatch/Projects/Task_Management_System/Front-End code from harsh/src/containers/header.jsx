import Content from "../constants/content.json"
import profilepic from "../assets/icons/profile.svg"
import { NavLink as Link } from 'react-router-dom'
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const Header = ({ profileData, setProfileData }) => {
    const content = Content.Header;
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const fetchUserDetails = () => {
        if (!localStorage.getItem('token')) {
            return;
        }
        const token = localStorage.getItem('token');
        axios({
            method: "GET",
            url: `${process.env.REACT_APP_BASE_URL}/fetch-single-profile`,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            setProfileData(response.data.data);
        })

    }
    console.log(profileData,"profileData");
    const logoutHandler = (e) => {
        console.log("logingout");
        e.preventDefault();
        const token = localStorage.getItem("token");

        setShowDropdown(false);
        axios({
            method: "POST",
            url: `${process.env.REACT_APP_BASE_URL}/logout`,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            localStorage.removeItem("token");
            setProfileData();
            navigate("/login");
        }).catch(error=>{
            console.log('error');
        })

    }
    const replaceImage = (error) => {
        error.target.src = profilepic;
    }
    useEffect(() => {
        fetchUserDetails();
        // const token=localStorage.getItem("token");
        // if(!token)
        // navigate('/login')

    }, [])
    const i = 0;
    return (
        <div className="d-flex  w-100 justify-content-between align-items-center p-3 shadow">
            <div className="d-flex justify-content-between align-items-center col-6 col-md-4">
                <span>{'logo'}</span>
                <Link className="text-decor-none" to="/Users">
                    <span className="color-primary-blue text-700-15">
                        {content.userList}
                    </span>
                </Link>
                <Link className="text-decor-none" to="/add_new_user">
                    <span className=" color-primary-blue text-700-15">{content.menu1}</span>
                </Link>
                <Link className="text-decor-none" to="/create-job">
                    <span className=" color-primary-blue text-700-15">{content.menu2}</span>
                </Link>

            </div>



            <div className="PS-3 cursor-pointer">
                {profileData ?
                    <div className="login-dropdown ">
                        <span onClick={() => setShowDropdown(!showDropdown)}>
                            <img className="profile-collection ms-2 size-40" src={process.env.REACT_APP_BASE_URL + "/" + profileData?.image} alt={profileData?.first_name} onError={replaceImage} />
                            <span className="ms-2 text-600-14 color-black">{profileData && profileData?.firstName + ' ' + profileData?.lastName}</span>
                        </span>
                        {showDropdown && <ul className="p-0 m-0 drop-list w-75 bg-light rounded">

                            <li>
                                <Link className="bg-light text-decor-none color-black" to="/login" onClick={(e) => { logoutHandler(e) }}>{content.dropdown.logout}</Link>
                            </li>
                        </ul>}
                    </div>
                    : <div className='d-none d-md-block'>
                        <Link className="text-600-14 color-black ps-3 pe-3 text-decor-none" to='/login'>{content.Login}</Link>
                    </div>}
            </div>

        </div>)
}

export default Header;
import React, { useState, useEffect } from "react";
import loginIcon from '../assets/icons/login_icon.svg';
import Input from '../components/input';
import Button from '../components/button';
import Content from "../constants/content.json";
import passwordIcon from "../assets/icons/passwordicon.svg"
import userIcon from "../assets/icons/user.svg"
import { useNavigate } from "react-router-dom";
import { NavLink as Link } from "react-router-dom";
import axios from "axios"
const UserLogin = ({ setShowHeader, setProfileData }) => {
    console.log(process.env.REACT_APP_BASE_URL);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [type, setType] = useState("password");
    const [inValid, setInvalid] = useState("");
    const content = Content.userLogin;
    useEffect(() => {
        setShowHeader(false);
        return () => setShowHeader(true);
    }, [])
    const navigate = useNavigate();
    const showPassword = () => {
        setType("text")
    }
    const fetchUserDetails = (token) => {
        if (!token) return;

        console.log(token, "token");
        axios({
            method: "GET",
            url: `${process.env.REACT_APP_BASE_URL}/fetch-single-profile`,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            console.log(response.data, "responseData");
            setProfileData(response.data.data);
        })
    }
    const hidePassword = () => {
        setType("password");
    }
    const submitHandler = (e) => {
        e.preventDefault();
        setInvalid("")
        let usernameValid = "";
        let passwordValid = "";
        let isValid = true;
        if (!username || username.length === 0) {
            usernameValid = content.usernameError;
            let isValid = true;
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(username)) {
            usernameValid = content.InvalidUsername;
            isValid = false;
        }

        if (!password || password.length === 0) {
            passwordValid = content.PasswordError
            isValid = false;
        }

        setPasswordError(passwordValid);
        setUsernameError(usernameValid);
        if (!isValid) {
            return;
        }

        console.log("hello login");
        const axiosPromise = () => {
            axios({
                method: "POST",
                url: `${process.env.REACT_APP_BASE_URL}/first-time-login`,
                data: {
                    email: username,
                    otp: password
                }

            }).then((response) => {
                console.log(response);
                if (response.data.success === true) {
                    localStorage.setItem("token", response.data.data);
                    fetchUserDetails(response.data.data);
                    setShowHeader(true);
                    navigate('/');
                }

            }
            ).catch((error) => {
                console.log(error.response.data.message, "error");
                setInvalid(error.response.data.message);
            })
        }
        axiosPromise();


    }
    const usernameHandler = (e) => {
        setUsername(e.target.value);
    }
    const passwordHandler = (e) => {
        setPassword(e.target.value);
    }
    return (
        <div className="login-page d-flex justify-content-center align-items-center">
            <div className="d-flex flex-column gap-3 align-items-center col-12 col-md-3 mt-5">
                <img className='mb-3 login-img ' src={loginIcon} alt="login_icon" />
                <h2>{content.Title}</h2>
                <form action="/"
                    onSubmit={submitHandler}
                    className='needs-validation d-flex flex-column align-items-center gap-3 m-2'
                >
                    <div className="w-100">
                        <Input
                            value={username}
                            type='email'
                            icon={userIcon}
                            className="border-black"
                            alt="usericon"
                            placeholder={content.label1}
                            onChange={usernameHandler}
                            label={content.label1}
                            validation={usernameError}

                        />
                    </div>

                    <div className="w-100">
                        <Input
                            value={password}
                            type={type}
                            icon={passwordIcon}
                            iconFunction={showPassword}
                            onMouseUp={hidePassword}
                            className="border-black"
                            alt="eye slash"
                            placeholder={content.label2}
                            onChange={passwordHandler}
                            label={content.label2}
                            validation={passwordError}
                        />

                    </div>

                    <p className="w-75 text-400-10 text-center color-black">{content.LoginPagePolicy}</p>
                    <Button
                        text={content.submit}
                        className="w-100 border-0  text-white rounded p-2 bg-primary-blue"
                        onClick={submitHandler}
                    />


                    <p className="text-400-15 error-message">{inValid && inValid}</p>
                </form>
               
            </div>
        </div>
    )
}

export default UserLogin;
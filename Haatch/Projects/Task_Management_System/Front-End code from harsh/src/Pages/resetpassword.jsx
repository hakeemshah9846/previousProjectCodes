import React, { useEffect, useState } from 'react';
import Content from "../constants/content.json";
import { Formik, Field, Form, ErrorMessage, useFormik } from 'formik';
import * as Yup from 'yup'
import Select from 'react-select';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Button from '../components/button';

const ResetPassword = ({ setShowHeader }) => {
    const [emailerror,setEmailError]=useState("");
    const navigate=useNavigate();
    useEffect(() => {
        setShowHeader(false);
        return () => {
            setShowHeader(true);
        }
    },[])
    const content = Content.forgotPassowordPage
    const initialValues = {
        email: ''
    }
    const submitHandler = (values) => {
        axios({
            method: "POST",
            url: `${process.env.REACT_APP_BASE_URL}/forgot-password`,
            data: {
                email: values.email
            }
        }).then(response=>{
            if(response.data.success){
                navigate('/user-login')
            } 
        }).catch(error=>{
            setEmailError(error.response.data.message)
        })
    }
    const vaidateShema = Yup.object().shape({
        email: Yup.string()
            .email(content.invalidEmail).required(content.emailError)
    })


    return (
        <Formik
            initialValues={initialValues} onSubmit={submitHandler}
            validationSchema={vaidateShema}
        >
            {({ handleSubmit, handleBlur }) => (
                <Form onSubmit={handleSubmit} className='h-100 d-flex gap-3 justify-content-center flex-column align-items-center'>
                    <h2>{content.Title}</h2>
                    <div className='w-50 col-12 col-md-5 mt-3 p-0 d-flex flex-column'>
                        <label htmlFor="email">{content.label}</label>
                        <Field
                            className="w-100 h-48 rounded border-black input-field p-3"
                            type="email"
                            name="email"
                            onFocus={(e) => e.currentTarget.classList.add('border-primary')}
                            onBlur={(e) => {
                                e.currentTarget.classList.remove('border-primary');
                                handleBlur(e);
                            }}
                            id="email" />
                        {emailerror &&  <div className='error-message'>{emailerror}</div>}
                        <ErrorMessage className='text-400-15 error-message' name="email" component="div" />
                        
                    </div>
                    <Button onClick={handleSubmit} 
                    className="w-50  gap-2  bg-primary-blue text-white close-btn text-700-14"
                    text={content.btn1} />
                </Form>
            )}

        </Formik>
    )

}
export default ResetPassword;



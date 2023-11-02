import React, { useEffect, useState } from 'react';
import Content from "../constants/content.json";
import { Formik, Field, Form, ErrorMessage, useFormik } from 'formik';
import * as Yup from 'yup'
import Select from 'react-select';
import axios from 'axios';
import { useParams,useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import Button from '../components/button';

const ResetForgotPassword=({setShowHeader})=>{
    // const a=useParams();
    const location =useLocation();
    const searchParams=new URLSearchParams(location.search);
    const token=searchParams.get('token')
    console.log(token);
    const content=Content.ResetForgotPassoword
    const navigate=useNavigate()
    const initialValues={
        password:"",
        confirmPassword:""
    }
    useEffect(() => {
        setShowHeader(false);
        return () => {
            setShowHeader(true);
        }
    },[])



    const vaidateShema=Yup.object().shape({
        password:Yup.string().min(0,content.warning1).max(30,content.warning2).required(content.warning3),
        confirmPassword:Yup.string().oneOf([Yup.ref("password"),null],content.warning4).required(content.warning5)
    })
    const submitHandler=(values)=>{
            console.log(values);
            axios({
                method:"POST",
                url:`${process.env.REACT_APP_BASE_URL}/reset-forgetten-password`,
                data:{
                    token:token,
                    new_password:values.password,
                    confirm_new_password:values.confirmPassword,
                },

            }).then(
                response=>{
                    if(response.data.success){
                        navigate('/user-login')
                    }
                }
            ).catch(error=>{
                
            })
    }
   return ( <Formik
            initialValues={initialValues} onSubmit={submitHandler}
            validationSchema={vaidateShema}
        >
            {({ handleSubmit, handleBlur }) => (
                <Form onSubmit={handleSubmit} className=' h-100 d-flex gap-3 justify-content-center flex-column align-items-center'>
                    <div className="text-700-40 color-primary-blue d-flex justify-content-center w-50 ">{content.Title}</div>
                    <div className=' w-50 col-12 col-md-5 mt-3 p-0 d-flex flex-column'>
                        <label htmlFor="password">{content.label1}</label>
                        <Field
                            className="w-100 h-48 rounded border-black input-field p-3"
                            type="password"
                            name="password"
                            onFocus={(e) => e.currentTarget.classList.add('border-primary')}
                            onBlur={(e) => {
                                e.currentTarget.classList.remove('border-primary');
                                handleBlur(e);
                            }}
                            id="password" />
                        <ErrorMessage className='text-400-15 error-message' name="password" component="div" />
                        
                    </div>
                    <div className=' w-50 col-12 col-md-5 mt-3 p-0 d-flex flex-column'>
                        <label htmlFor="confirmPassword">{content.label2}</label>
                        <Field
                            className="w-100 h-48 rounded border-black input-field p-3"
                            type="password"
                            name="confirmPassword"
                            onFocus={(e) => e.currentTarget.classList.add('border-primary')}
                            onBlur={(e) => {
                                e.currentTarget.classList.remove('border-primary');
                                handleBlur(e);
                            }}
                            id="confirmPassword" />
                        <ErrorMessage className='text-400-15 error-message' name="confirmPassword" component="div" />
                        
                    </div>
                    <Button type="submit" onClick={handleSubmit} 
                    className="w-50 gap-2  bg-primary-blue text-white close-btn text-700-14"
                    text={content.btn} />

                </Form>
            )}

        </Formik>)
}

export default ResetForgotPassword;
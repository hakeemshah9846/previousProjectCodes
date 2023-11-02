import React, { useEffect, useState } from 'react';
import Content from "../constants/content.json"
import { Formik, Field, Form, ErrorMessage, useFormik } from 'formik';
import Select from 'react-select';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import CheckBox from '../components/checkBox';
import CustomField from '../components/customField';
import Button from '../components/button';
import closeIcon from "../assets/icons/close.svg";
import saveIcon from "../assets/icons/save.svg";
import * as Yup from "yup";
import profilePic from "../assets/icons/profile.svg"
const Job = ({ setShowHeader }) => {
    const navigate = useNavigate();
    const [jobTypes, setJobTypes] = useState('');
    const [jobTypeSelected, setJobTypeSelected] = useState("");
    const [entities, setEntities] = useState("");
    const [selectedEntity, setSelectedEntity] = useState("");
    const [jobStatuses, setJobStatuses] = useState("");
    const [jobStatusSelected, setJobStatusSelected] = useState("");
    const [deliveryModes, setDeliveryModes] = useState("");
    const [selectedDeliveryModes, setSelectedDeliveryModes] = useState("");
    const [documentModes, setDocumentModes] = useState("");
    const [selectedDocumentMode, setSelectedMode] = useState("");
    const [clients, setClients] = useState("");
    const [selectedCient, setSelectedClient] = useState("");
    const [documentTypes, setDocumentTypes] = useState("");
    const [selectedDocumentTypes, setSelectedDocumentTypes] = useState("");
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [sections, setSections] = useState([]);
    const [selectedSection, setSelectedSection] = useState("");

    const content = Content.JobPage;
    const token = localStorage.getItem("token");
    const opts = {
        label: "hello", value: "hai"
    }
    useEffect(() => {
        if (!token) navigate('/')
        // setShowHeader(false);
        fetchOptions('entities', setEntities);
        fetchOptions('job-types', setJobTypes);
        fetchOptions('job-status', setJobStatuses);
        fetchOptions('delivery-modes', setDeliveryModes);
        fetchOptions('document-modes', setDocumentModes);
        fetchOptions('clients', setClients);
        fetchOptions('document-modes', setDocumentTypes);
        // fetchJobType();
        // fetchEntity();
        return (
            () => {
                setShowHeader(true);
            }
        )
    }, [])
    const initialValues = {
        jobTitle: "",
        jobType: "", //dp
        jobStatus: "",//dp
        requestedBy: "",//dp
        requestedByEntity: "",//dp
        requestBydepartment: "",//dp
        requestBySection: "",//dp
        jobReqComment: "",
        confidentiality: "",//yn
        requireSample: "",//yn
        requrieEdits: "",//yn
        documentType: "",//dp
        documentName: "",
        documentMode: "",//dp
        reqDeliveryDate: "",
        deliveryMode: "",//dp
        deliverTo: "",//dp
        deliverToEntity: "",//dp
        deliverToDepartment: "",//dp
        deliverToSection: "",//dp
        requireCover: "",//yn
        requreFinishing: ""//yn

    }
    const customStyle = {
        control: (provided, state) => ({
            ...provided, height: '50px', borderColor: "#3C3C3C"
        })
    }
    const validationSchema = Yup.object().shape({
        jobTitle: Yup.string().required(content.error1),
        jobType: Yup.string().required(content.error2),
        jobStatus: Yup.string().required(content.error3),
        requestedBy: Yup.string().required(content.error4),
        requestedByEntity: Yup.string().required(content.error5)

    })
    const submitHandler = () => {

    }


    const fetchOptions = (param, setData) => {
        axios({
            method: "GET",
            url: `${process.env.REACT_APP_BASE_URL}/${param}`,
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).then(response => {
            const options = response.data.data.map(item => {
                return {
                    value: item, label: item
                }
            })
            setData(options)
        }).catch(error => {

        })
    }

    // const jobTypeHandler = (value, setFieldValue) => {
    //     console.log(value.value);
    //     setJobTypeSelected(value);
    //     setFieldValue("jobType", value.value)
    // }


    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={submitHandler}
        >
            {
                ({ handleBlur, setFieldValue, setTouched, touched }) => {

                    const selectHandler = (value, setData, label) => {
                        setData(value);
                        setFieldValue(label, value.value);
                    }
                    return (
                        <Form className='d-flex flex-column align-items-center'>
                            <div className='w-80 light-line mt-4'>
                                <div className="text-700-40 color-primary-blue d-flex d-md-block justify-content-center w-75 ">{content.title}</div>
                            </div>
                            <div className="d-flex w-80 flex-wrap justify-content-between">
                                <div className='col-12 col-md-5 mt-3 p-2 d-flex flex-column'>
                                    <label htmlFor="jobTitle">{content.label1}</label>
                                    <Field
                                        className="w-100 h-5 rounded input-field border-black"
                                        type="text"
                                        name="jobTitle"
                                        onFocus={(e) => e.currentTarget.classList.add('border-primary')}
                                        onBlur={(e) => {
                                            e.currentTarget.classList.remove('border-primary');
                                            handleBlur(e);
                                        }}
                                    />
                                    <ErrorMessage className='text-400-15 error-message' name="jobTitle" component="div" />
                                </div>

                                <div className='col-12 hr-7 col-md-5 mt-3 p-2 d-flex flex-column'>
                                    <label htmlFor="jobReqComment">{content.label8}</label>
                                    <Field
                                        className="w-100 hr-5  rounded input-field border-black"
                                        type="text"
                                        as='textarea' rows="6"
                                        name="jobReqComment"
                                        onFocus={(e) => e.currentTarget.classList.add('border-primary')}
                                        onBlur={(e) => {
                                            e.currentTarget.classList.remove('border-primary');
                                            handleBlur(e);
                                        }}
                                    />
                                    <ErrorMessage className='text-400-15 error-message' name="jobReqComment" component="div" />
                                </div>
                                <CustomField 
                                    id={"jobReqComment"} 
                                    className={"col-12 hr-7 col-md-5 mt-3 p-2 d-flex flex-column"}
                                    onBlur={(e)=>{
                                        e.currentTarget.classList.remove('border-primary')
                                    }}
                                />

                                <div className='col-12 col-md-5 mt-3 p-2 d-flex flex-column'>
                                    <label htmlFor="jobType">{content.label2}</label>
                                    <div className='w-100 h-5 rounded'>
                                        <Field
                                            name="jobType"
                                            id="jobType"
                                        >
                                            {({ field }) => (
                                                <>
                                                    <Select
                                                        options={jobTypes}
                                                        value={jobTypeSelected}
                                                        name="jobType"
                                                        onChange={(value) => {
                                                            selectHandler(value, setJobTypeSelected, 'jobType')
                                                        }}
                                                        styles={customStyle}
                                                        onBlur={() => {
                                                            setTouched({ ...touched, jobType: true })
                                                        }}
                                                        isSearchable
                                                    />
                                                    <ErrorMessage className='text-400-15 error-message' name="jobType" component="div" />
                                                </>
                                            )}
                                        </Field>
                                    </div>

                                </div>
                                <div className='col-12 col-md-5 mt-3 p-2 d-flex flex-column'>
                                    <label htmlFor="jobStatus">{content.label3}</label>
                                    <div className='w-100 h-5 rounded'>
                                        <Field
                                            name="jobStatus"
                                            id="jobStatus"
                                        >
                                            {({ field }) => (
                                                <>
                                                    <Select
                                                        options={jobStatuses}
                                                        value={jobStatusSelected}
                                                        onChange={(value) => {
                                                            selectHandler(value, setJobStatusSelected, 'jobStatus')
                                                        }}
                                                        styles={customStyle}
                                                        onBlur={() => {
                                                            setTouched({ ...touched, jobStatus: true })
                                                        }}
                                                        isSearchable
                                                    />
                                                    <ErrorMessage className='text-400-15 error-message' name="jobStatus" component="div" />
                                                </>
                                            )}
                                        </Field>
                                    </div>

                                </div>
                                <div className='col-12 col-md-5 mt-3 p-2 d-flex flex-column'>
                                    <label htmlFor="requestedBy">{content.label4}</label>
                                    <div className='w-100 h-5 rounded'>
                                        <Field
                                            name="requestedBy"
                                            id="requestedBy"
                                        >
                                            {({ field }) => (
                                                <>
                                                    <Select
                                                        options={clients}
                                                        value={selectedCient}
                                                        onChange={(value) => {
                                                            selectHandler(value, setSelectedClient, 'requestedBy')
                                                        }}
                                                        styles={customStyle}
                                                        onBlur={() => {
                                                            setTouched({ ...touched, requestedBy: true })
                                                        }}
                                                        isSearchable
                                                    />
                                                    <ErrorMessage className='text-400-15 error-message' name="requestedBy" component="div" />
                                                </>
                                            )}
                                        </Field>
                                    </div>

                                </div>
                                <div className='col-12 col-md-5 mt-3 p-2 d-flex flex-column'>
                                    <label htmlFor="requestedByEntity">{content.label5}</label>
                                    <div className='w-100 h-5 rounded'>
                                        <Field
                                            name="requestedByEntity"
                                            id="requestedByEntity"
                                        >
                                            {({ field }) => (
                                                <>
                                                    <Select
                                                        options={entities}
                                                        value={selectedEntity}
                                                        onChange={(value) => {
                                                            selectHandler(value, setSelectedEntity, 'requestedByEntity')
                                                        }}
                                                        styles={customStyle}
                                                        onBlur={() => {
                                                            setTouched({ ...touched, requestedByEntity: true })
                                                        }}
                                                        isSearchable
                                                    />
                                                    <ErrorMessage className='text-400-15 error-message' name="requestedByEntity" component="div" />
                                                </>
                                            )}
                                        </Field>
                                    </div>

                                </div>

                                <div className='col-12 col-md-5 mt-3 p-2 d-flex flex-column'>
                                    <label htmlFor="requestedByDepartment">{content.label6}</label>
                                    <div className='w-100 h-5 rounded'>
                                        <Field
                                            name="requestedByDepartment"
                                            id="requestedByDepartment"
                                        >
                                            {({ field }) => (
                                                <>
                                                    <Select
                                                        options={departments}
                                                        value={selectedDepartment}
                                                        onChange={(value) => {
                                                            selectHandler(value, setSelectedDepartment, 'requestedByDepartment')
                                                        }}
                                                        styles={customStyle}
                                                        onBlur={() => {
                                                            setTouched({ ...touched, requestBydepartment: true })
                                                        }}
                                                        isSearchable
                                                    />
                                                    <ErrorMessage className='text-400-15 error-message' name="requestedByDepartment" component="div" />
                                                </>
                                            )}
                                        </Field>
                                    </div>

                                </div>
                                <div className='col-12 col-md-5 mt-3 p-2 d-flex flex-column'>
                                    <label htmlFor="requestedBySection">{content.label7}</label>
                                    <div className='w-100 h-5 rounded'>
                                        <Field
                                            name="requestedBySection"
                                            id="requestedBySection"
                                        >
                                            {({ field }) => (
                                                <>
                                                    <Select
                                                        options={entities}
                                                        value={selectedEntity}
                                                        onChange={(value) => {
                                                            selectHandler(value, setSelectedSection, 'requestedBySection')
                                                        }}
                                                        styles={customStyle}
                                                        onBlur={() => {
                                                            setTouched({ ...touched, requestBySection: true })
                                                        }}
                                                        isSearchable
                                                    />
                                                    <ErrorMessage className='text-400-15 error-message' name="requestedBySection" component="div" />
                                                </>
                                            )}
                                        </Field>
                                    </div>

                                </div>


                                <div className='col-12 col-md-5 mt-3 p-2 d-flex flex-column'>
                                    <label htmlFor="documentType">{content.label12}</label>
                                    <div className='w-100 h-5 rounded'>
                                        <Field
                                            name="documentType"
                                            id="documentType"
                                        >
                                            {({ field }) => (
                                                <>
                                                    <Select
                                                        options={entities}
                                                        value={selectedEntity}
                                                        onChange={(value) => {
                                                            selectHandler(value, setSelectedDocumentTypes, 'documentType')
                                                        }}
                                                        styles={customStyle}
                                                        onBlur={() => {
                                                            setTouched({ ...touched, documentType: true })
                                                        }}
                                                        isSearchable
                                                    />
                                                    <ErrorMessage className='text-400-15 error-message' name="documentType" component="div" />
                                                </>
                                            )}
                                        </Field>
                                    </div>

                                </div>
                                <div className='col-12 col-md-5 mt-3 p-2 d-flex flex-column'>
                                    <label htmlFor="jobTitle">{content.label1}</label>
                                    <Field
                                        className="w-100 h-5 rounded input-field border-black"
                                        type="text"
                                        name="jobTitle"
                                        onFocus={(e) => e.currentTarget.classList.add('border-primary')}
                                        onBlur={(e) => {
                                            e.currentTarget.classList.remove('border-primary');
                                            handleBlur(e);
                                        }}
                                    />
                                    <ErrorMessage className='text-400-15 error-message' name="jobTitle" component="div" />
                                </div>
                                <div className='col-12 col-md-5 d-flex'>
                                    <CheckBox className="col-12 col-md-3 m-2 p-2 d-flex flex-column mt-3 d-flex gap-2"
                                        id="confidentiality"
                                        label={content.label9}
                                    />
                                    <CheckBox className="col-12 col-md-3 m-2 p-2 d-flex flex-column mt-3 d-flex gap-2"
                                        id="requireSample"
                                        label={content.label10}
                                    />
                                    <CheckBox className="col-12 col-md-3 m-2 p-2 d-flex flex-column mt-3 d-flex gap-2"
                                        id="requireEdits"
                                        label={content.label11}
                                    />
                                </div>



                            </div>

                        </Form>
                    )
                }
            }

        </Formik>

    )
}

export default Job;
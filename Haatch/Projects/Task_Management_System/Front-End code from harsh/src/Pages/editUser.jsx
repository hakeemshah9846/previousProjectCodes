import { Formik, Field, Form, ErrorMessage, useFormik } from "formik";
import * as Yup from 'yup'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from "react";
import Content from "../constants/content.json"
import { useNavigate } from "react-router-dom";
import Button from "../components/button";
import closeIcon from "../assets/icons/close.svg";
import saveIcon from "../assets/icons/save.svg";
import Select from "react-select";
const EditUser = () => {
  const [departments, setDepartments] = useState();
  const [roles, setRoles] = useState("");
  const [sections, setSections] = useState("");
  const [branches, setBranches] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [initialValues,setInitialValues]=useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  console.log(id, "ids");
  const content = Content.EditPage;
  const Errors = Content.EditPage.Errors
  let profileImageRef;
  const customStyle = {
    control: (provided, state) => ({
      ...provided, height: '50px', borderColor: "#3C3C3C"
    })
  }
  useEffect(
    () => {
      fetchUserDetails();
      fetchRoles();
      fetchDepartments();
      fetchSections();
      fetchBranches();
    },
    []
  )

  const handleClose = () => {
    navigate('/Users')
  }
  const validationSchema = Yup.object().shape({
    department: Yup.string().required(Errors.invalidDepartment),
    branch: Yup.string().required(Errors.invalidBranch),
    section: Yup.string().required(Errors.invalidSection),
    roles: Yup.string().required(Error.invalidRole)
  })

  const fetchUserDetails = () => { //for view or edit 
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/')
      return;
    }
    console.log("hello");
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_BASE_URL}/fetch-single-user-details/${id}`,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
    ).then(
      (response) => {
        const obj= response.data.data;
        const updatedObj={...obj,roles: response.data.data.roles[0]}
        setInitialValues(updatedObj);
        setSelectedBranch({label:response.data.data.branch,value:response.data.data.branch})
        setSelectedDepartment({label:response.data.data.department,value:response.data.data.department})
        setSelectedRole({label:response.data.data.roles[0],value:response.data.data.roles[0]})
        setSelectedSection({label:response.data.data.section,value:response.data.data.section})
      }
    ).catch(
      (error)=>{
        navigate('/')
      }
    )
      // setData(
      //   {
      //     first_name:"Jackson",
      //     last_name:"Michael",
      //     phone:"1234567891",
      //     email:"s@s.ss",
      //     role:"role",
      //     department:'dep1',
      //     section:"sec1",
      //     branch:'branch1'
      //   }
      // )
      // setInitialValues({
      //   firstName:"Jackson",
      //   lastName: "Michael",
      //   email: "s@s.ss",
      //   phone: "1234567891",
      //   profileImage: "",
      //   department: "dep1",
      //   section: "sec1",
      //   branch: "br1",
      //   role: "role1"
      // })
      // setSelectedDepartment({
      //   label:"dep1",value:"dep1"
      // })
      // setSelectedBranch({
      //   label:"branch1",value:"branch1"
      // })
      // setSelectedRole({
      //   label:"role1",value:"role1"
      // })
      // setSelectedSection({
      //   label:"sec1",value:'sec1'
      // })
      
  }
  
 
 

  console.log(initialValues,"initialValues");
 
  
  const fetchBranches = () => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate("/login");
      return
    }

    axios({
      method: "GET",
      url: `${process.env.REACT_APP_BASE_URL}/branches`,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((response) => {
      const branches = response.data.data.map(item => {
        return {
          value: item.branch,
          label: item.branch
        }
      })
      setBranches(branches);
    })
  }



  const fetchRoles = () => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate("/login");
      return
    }

    axios({
      method: "GET",
      url: `${process.env.REACT_APP_BASE_URL}/fetch-all-roles`,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((response) => {
      const roles = response.data.data.map((item) => {
        return {
          value: item,
          label: item
        };
      })
      setRoles(roles);
    })
  }
  const fetchDepartments = () => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate("/login");
      return
    }

    axios({
      method: "GET",
      url: `${process.env.REACT_APP_BASE_URL}/departments`,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((response) => {
      const departments = response.data.data.map(item => {
        return {
          value: item.department,
          label: item.department
        }
      })
      setDepartments(departments);
    }).catch(err=>{
      console.log(err,"error");
    })
  }

  const fetchSections = () => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate("/login");
      return
    }

    axios({
      method: "GET",
      url: `${process.env.REACT_APP_BASE_URL}/sections`,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((response) => {
      const sections = response.data.data.map(item => {
        return {
          value: item.section,
          label: item.section
        };
      })
      setSections(sections)

    })
  }

  
  const submitHandler = (values) => {
    const token = localStorage.getItem("token");
    axios({
      method: "PUT",
      url: `${process.env.REACT_APP_BASE_URL}/update-single-user-details/${id}`,
      data:{
        department:values.department,
        role:values.roles,
        section:values.section,
        branch:values.branch
      },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((response) => {
        navigate('/');
    }).catch((error)=>{

    })
  }
  const departmentHandler = (value, setFieldValue) => {
    setSelectedDepartment(value)
    setFieldValue("department", value.value);
  }
  const roleHandler = (value, setFieldValue) => {
    setSelectedRole(value);
    setFieldValue("role", value.value)
  }
  const sectionHandler=(value,setFieldValue)=>{
    setSelectedSection(value);
    setFieldValue("section",value.value)
  }
  const branchHandler=(value,setFieldValue)=>{
    setSelectedBranch(value);
    setFieldValue("branch",value.value)
  }



  const options=[
    {label:"m",value:"m"}
  ]
  return (
    <Formik
      initialValues={initialValues} 
      onSubmit={submitHandler}
      enableReinitialize={true}
      validationSchema={validationSchema}
    >

      {({values,dirty, isSubmitting, handleSubmit, touched, setFieldValue, setTouched }) => (
        <Form onSubmit={handleSubmit}
          className='d-flex flex-column align-items-center'
        >
          <div className="w-80 light-line mt-4">
            <div className="d-flex flex-md-row flex-column  justify-content-between  align-items-center ">
              <div className="text-700-40 color-primary-blue d-flex d-md-block justify-content-center w-75 ">{content.Title}</div>
              <div className="d-flex gap-4 p-1 pb-md-2">
                <Button
                  onClick={handleClose}
                  text={content.TopButton1}
                  icon={closeIcon}
                  className="gap-2 btn-bg-light color-primary-blue btn-save  text-700-14"
                />
                {<Button
                  type="submit"
                  text={content.TopButton2}
                  onClick={ handleSubmit}
                  icon={saveIcon}
                  disabled={isSubmitting}
                  className="gap-2 bg-primary-blue text-white close-btn text-700-14"
                />}

              </div>
            </div>
          </div>
          <div className='d-flex flex-wrap justify-content-between mt-4 w-80 px-2 '>
            <div className='col-12 col-md-5 mt-3 p-2 d-flex flex-column'>
              <label htmlFor="firstName">{content.label1}</label>
              <Field
                className="w-100 h-5 rounded input-field border-black"
                type="text"
                name="firstName"
                id="firstName"
                disabled={true}
              />
            </div>
            <div className='col-12 col-md-5 mt-3 p-2 d-flex flex-column'>
              <label htmlFor="lastName">{content.label2}</label>
              <Field
                className="w-100 h-5 rounded input-field border-black"
                type="text"
                name="lastName"
                disabled={true}
                id="lastName"
              />
            </div>
            <div className='col-12 col-md-5 mt-3 p-2 d-flex flex-column'>
              <label htmlFor="email">{content.label3}</label>
              <Field
                className="w-100 h-5 rounded input-field border-black"
                type="text"
                name="email"
                disabled={true}
                id="email"
              />
            </div>
            <div className='col-12 col-md-5 mt-3 p-2 d-flex flex-column'>
              <label htmlFor="phone">{content.label4}</label>
              <Field
                className="w-100 h-5 rounded input-field border-black"
                type="text"
                name="phone"
                disabled={true}
                id="phone"
              />
            </div>
            <div className='col-12 col-md-5 mt-3 p-2 d-flex flex-column'>
              <label htmlFor="department">{content.label5}</label>
              <div className='w-100 h-5 rounded'>
                <Field
                  name="department"
                  id="department"
                >
                  {({ field }) => (
                    <>
                      <Select
                        options={departments}
                        name="department"
                        instanceId="department"
                        value={selectedDepartment}
                        styles={customStyle}
                        onChange={value => {
                          departmentHandler(value, setFieldValue);
                        }}
                        onBlur={() => {
                          console.log(touched,"touched");
                          setTouched({...touched, department: true })
                        }}
                        isSearchable
                      />
                      <ErrorMessage className='text-400-15 error-message' name="department" component="div" />
                    </>
                  )}

                </Field>
              </div>

            </div>
            <div className='col-12 col-md-5 mt-3 p-2 d-flex flex-column'>
              <label htmlFor="roles">{content.label6}</label>
              <div className='w-100 h-5 rounded'>
                <Field
                  name="roles"
                  id="roles"
                >
                  {({ field }) => (
                    <>
                      <Select
                        options={roles}
                        name="roles"
                        instanceId="roles"
                        value={selectedRole}
                        styles={customStyle}
                        onChange={value => {
                          roleHandler(value, setFieldValue);
                        }}
                        onBlur={() => {
                          setTouched({...touched, roles: true })
                        }}
                        isSearchable
                      />
                      <ErrorMessage className='text-400-15 error-message' name="roles" component="div" />
                    </>
                  )}

                </Field>
              </div>

            </div>
           
            <div className='col-12 col-md-5 mt-3 p-2 d-flex flex-column'>
              <label htmlFor="branch">{content.label7}</label>
              <div className='w-100 h-5 rounded'>
                <Field
                  name="branch"
                  id="branch"
                >
                  {({ field }) => (
                    <>
                      <Select
                        options={branches}
                        name="branch"
                        instanceId="branch"
                        value={selectedBranch}
                        styles={customStyle}
                        onChange={value => {
                          branchHandler(value, setFieldValue);
                        }}
                        onBlur={() => {
                          setTouched({...touched,branch:true});
                        }}
                        isSearchable
                      />
                      <ErrorMessage className='text-400-15 error-message' name="branch" component="div" />
                    </>
                  )}

                </Field>
              </div>

            </div>
            <div className='col-12 col-md-5 mt-3 p-2 d-flex flex-column'>
              <label htmlFor="section">{content.label8}</label>
              <div className='w-100 h-5 rounded'>
                <Field
                  name="section"
                  id="section"
                >
                  {({ field }) => (
                    <>
                      <Select
                        options={sections}
                        name="section"
                        instanceId="section"
                        value={selectedSection}
                        styles={customStyle}
                        onChange={value => {
                          sectionHandler(value, setFieldValue);
                        }}
                        onBlur={() => {
                          // setTouched({ section: true })
                          // console.log(touched,"touched");
                          setTouched({...touched,section:true});
                        }}
                        isSearchable
                      />
                      <ErrorMessage className='text-400-15 error-message' name="section" component="div" />
                    </>
                  )}

                </Field>
              </div>

            </div>
            

          </div>
        </Form>
      )}

    </Formik>
  )
}

export default EditUser
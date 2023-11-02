import React, { useEffect, useState } from 'react';
import Content from "../constants/content.json"
import { Formik, Field, Form, ErrorMessage, useFormik } from 'formik';
import Select from 'react-select';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Button from '../components/button';
import closeIcon from "../assets/icons/close.svg";
import saveIcon from "../assets/icons/save.svg";
import * as Yup from "yup";
import profilePic from "../assets/icons/profile.svg"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'



const AddNewUser = ({ setShowHeader }) => {
  const [departments, setDepartments] = useState([]);
  const [departmentSelected, setDepartmentSelected] = useState('');
  const [roles, setRoles] = useState([]);
  const [roleSelected, setRoleSelected] = useState("");
  const [sections, setSections] = useState([]);
  const [sectionSelected, setSectionSelected] = useState("");
  const [branches, setBranches] = useState([]);
  const [branchSelected, setBranchSelected] = useState("");
  const [addUserError, setAddUserError] = useState("");
  const content = Content.AddUser;
  const navigate = useNavigate();
  const phonePattern = /[^0-9]/g;
  let profileImageRef;
  const customStyle = {
    control: (provided, state) => ({
      ...provided, height: '50px', borderColor: "#3C3C3C"
    })
  }
 
  const replaceImage = (error) => {
    error.target.src = profilePic;
  }
  const handleProfileImage = async (e, setFieldValue) => {
    let item;
    if (e.target.files[0].type.split("/")[0] === "image") {
      item = e.target.files[0];
      const base64 = await encodeFileBase64(item);
      setFieldValue("profileImage", base64);
    }
  }
  const encodeFileBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        resolve(reader.result);
      };

      reader.onerror = (error) => {
        reject(error);
      };
    });
  };


  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profileImage: '',
    selectedDepartment: departmentSelected.value,
    selectedSection: sectionSelected.value,
    selectedBranch: branchSelected.value,
    selectedRole: roleSelected.value

  };
  const vaidateShema = Yup.object().shape({
    firstName: Yup.string()
      .min(0, Content.AddUser.firstnameError)
      .required(Content.AddUser.firstnameError),
    lastName: Yup.string()
      .required(content.lastNameError),
    email: Yup.string()
      .email(content.invalidEmail).required(content.emailError),
    phone: Yup.string().matches(/^[0-9]{10}$/, content.invalidPhone).required(content.phoneError),
    selectedDepartment: Yup.string().required(content.invalidDepartment),
    selectedBranch: Yup.string().required(content.invalidBranch),
    selectedRole: Yup.string().required(content.invalidRole),
    selectedSection: Yup.string().required(content.invalidSection)


    // selectedDepartment:Yup.string()

    // .of(Yup.object().shape({
    //   label:Yup.string().required(),
    //   value:Yup.string().required()
    // }))
  })



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
  useEffect(() => {
    setShowHeader(false);
    fetchDepartments();
    fetchRoles();
    fetchSections();
    fetchBranches();
    // setDepartments([{
    //   label:"dep1",value:"dep1"
    // },{
    //   label:"dep2",value:"dep2"
    // },{
    //   label:"dep3",value:"dep3"
    // }]);
    // setRoles([
    //   {label:"role1",value:"role1"},
    //   {label:"role2",value:"role2"}
    // ])
    // setBranches([{
    //   label:'b1',value:'b1'
    // },{
    //   label:'b2',value:'b2'
    // },{
    //   label:'b3',value:'b3'
    // }])
    // setSections([{
    //   label:'c1',value:'c1'
    // },{
    //   label:'c2',value:'c2'
    // },{
    //   label:'c3',value:"c3"
    // }])


    return () => {
      setShowHeader(true);
    }
  }, [])
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
    })
  }
  const handleClose = () => {
    navigate('/')
  }

  const departmentHandler = (value, setFieldValue) => {
    setDepartmentSelected(value);
    setFieldValue("selectedDepartment", value.value);
  }
  const roleHandler = (value, setFieldValue) => {
    setRoleSelected(value.value);
    setFieldValue("selectedRole", value.value)
  }

  const sectionHandler = (value, setFieldValue) => {
    setSectionSelected(value.value);
    setFieldValue("selectedSection", value.value)
  }

  const branchHandler = (value, setFieldValue) => {
    setBranchSelected(value.value);
    setFieldValue("selectedBranch", value.value);
  }
console.log(addUserError);
  return (
    <Formik
      // enableReinitialize
      initialValues={initialValues} onSubmit={(values) => {
        const token = localStorage.getItem('token');
        axios({
          method: "POST",
          url: `${process.env.REACT_APP_BASE_URL}/createuser`,
          headers: {
            "Authorization": `Bearer ${token}`
          },
          data: {

            first_name: values.firstName,
            last_name: values.lastName,
            email: values.email,
            image: values.profileImage,
            phone: values.phone,
            department: values.selectedDepartment,
            branch: values.selectedBranch,
            role: values.selectedRole,
            section: values.selectedSection,


          }
        },

        ).then(response=>{
          if(response.data.success){
            navigate('/')
          }
        }).catch(
          (error)=>{
            setAddUserError(error.response.data.message)
          }
        )

      }} validationSchema={vaidateShema}>
      {({ isSubmitting,touched, handleBlur, handleSubmit, values, setFieldValue, setTouched }) => (
        <Form onSubmit={handleSubmit} className='d-flex flex-column align-items-center'>
          <div className="w-80 light-line mt-4">
            <div className="d-flex flex-md-row flex-column  justify-content-between  align-items-center ">
              <div className="text-700-40 color-primary-blue d-flex d-md-block justify-content-center w-75 ">{content.AddUser}</div>
              <div className="d-flex gap-4 p-1 pb-md-2">
                <Button
                  onClick={handleClose}
                  text={content.Discard}
                  icon={closeIcon}
                  className="gap-2 btn-bg-light color-primary-blue btn-save  text-700-14"
                />
                <Button
                  type="submit"
                  text={content.Save}
                  onClick={handleSubmit}
                  icon={saveIcon}
                  disabled={isSubmitting}
                  className="gap-2 bg-primary-blue text-white close-btn text-700-14"
                />

              </div>
            </div>
          </div>
          <div className='w-80 mt-3 d-flex justify-content-center'>
            <img
              src={values.profileImage}
              className={'image-update'}
              alt={values.firstName}
              onError={replaceImage}
            />
            <FontAwesomeIcon className="cursor-pointer" icon={faPen} onClick={() => profileImageRef.click()} />
            <input
              type="file"
              hidden={true}
              ref={(refParam) => (profileImageRef = refParam)}
              accept=".png, .jpg, .jpeg"
              onChange={(e) => {
                handleProfileImage(e, setFieldValue);
              }}
            />
          </div>
        
          <div className='d-flex flex-wrap justify-content-between mt-4 w-80 px-2 '>
            <div className='col-12 col-md-5 mt-3 p-2 d-flex flex-column'>
              <label htmlFor="firstName">{content.FirstName}</label>
              <Field
                className="w-100 h-5 rounded input-field border-black"
                type="text"
                name="firstName"
                id="firstName"
                onFocus={(e) => e.currentTarget.classList.add('border-primary')}
                onBlur={(e) => {
                  e.currentTarget.classList.remove('border-primary');
                  handleBlur(e);
                }}
              />
              <ErrorMessage className='text-400-15 error-message' name="firstName" component="div" />
            </div>

            <div className='col-12 col-md-5 mt-3 p-2  d-flex flex-column'>
              <label htmlFor="lastName">{content.LastName}</label>
              <Field
                onFocus={(e) => e.currentTarget.classList.add('border-primary')}
                onBlur={(e) => {
                  e.currentTarget.classList.remove('border-primary');
                  handleBlur(e);
                }}
                className="w-100 h-5 rounded border-black input-field"
                type="text"
                name="lastName"
                id="lastName" />
              <ErrorMessage className='text-400-15 error-message' name="lastName" component="div" />
            </div>

            <div className='col-12 col-md-5 mt-3 p-2 d-flex flex-column'>
              <label htmlFor="email">{content.Email}</label>
              <Field
                className="w-100 h-5 rounded border-black input-field"
                type="email"
                name="email"
                onFocus={(e) => e.currentTarget.classList.add('border-primary')}
                onBlur={(e) => {
                  e.currentTarget.classList.remove('border-primary');
                  handleBlur(e);
                }}
                id="email" />
              <ErrorMessage className='text-400-15 error-message' name="email" component="div" />
              <div className='error-message'>{addUserError}</div>
            </div>

            <div className='col-12 col-md-5 mt-3 p-2 d-flex flex-column'>
              <label htmlFor="phone">{content.Phone}</label>
              <Field
                className="w-100 h-5 rounded border-black input-field"
                onFocus={(e) => e.currentTarget.classList.add('border-primary')}
                onBlur={(e) => {
                  e.currentTarget.classList.remove('border-primary');
                  handleBlur(e);
                }}
                type="tel" name="phone" id="phone" />
              <ErrorMessage className='text-400-15 error-message' name="phone" component="div" />
            </div>
            <div className='col-12 col-md-5 mt-3 p-2 d-flex flex-column'>
              <label htmlFor="selectedDepartment">{content.department}</label>
              <div className='w-100 h-5 rounded'>
                <Field
                  name="selectedDepartment"
                  id="selectedDepartment"
                >
                  {({ field }) => (
                    <>
                      <Select
                        options={departments}
                        name="selectedDepartment"
                        instanceId="selectedDepartment"
                        value={departmentSelected}
                        styles={customStyle}
                        onChange={value => {
                          departmentHandler(value, setFieldValue);
                        }}
                        onBlur={() => {
                          setTouched({...touched, selectedDepartment: true })
                        }}
                        isSearchable
                      />
                      <ErrorMessage className='text-400-15 error-message' name="selectedDepartment" component="div" />
                    </>
                  )}

                </Field>
              </div>

            </div>
            <div className='col-12 col-md-5 mt-3 p-2 d-flex flex-column'>
              <label htmlFor="selectedRole">{content.role}</label>
              <div className='w-100 h-5 rounded'>
                <Field
                  name="selectedRole"
                  instanceId="selectedRole"
                >
                  {({ field }) => (
                    <>
                      <Select
                        options={roles}
                        value={roleSelected}
                        onChange={(value) => {
                          roleHandler(value, setFieldValue);
                          setRoleSelected(value);
                          field.onChange(value);
                        }}
                        styles={customStyle}
                        onBlur={() => {
                          setTouched({...touched, selectedRole: true })
                        }}
                        isSearchable
                      />
                      <ErrorMessage className='text-400-15 error-message' name="selectedRole" component="div" />
                    </>
                  )}
                </Field>
              </div>

            </div>
            <div className='col-12 col-md-5 mt-3 p-2 d-flex flex-column'>
              <label htmlFor="selectedBranch">{content.Branch}</label>
              <div className='w-100 h-5 rounded'>  <Field
                name="selectedBranch">
                {({ field }) => (
                  <Select
                    options={branches}
                    name="selectedBranch"
                    instanceId="selectedBranch"
                    value={branchSelected}
                    onChange={value => {
                      branchHandler(value, setFieldValue)
                      setBranchSelected(value);
                      field.onChange(value);
                    }}
                    styles={customStyle}
                    onBlur={() => {
                      setTouched({...touched, selectedBranch: true })
                    }}
                    isSearchable
                  />
                )}
              </Field>
              </div>
              <ErrorMessage className='text-400-15 error-message' name="selectedBranch" component="div" />
            </div>

            <div className='col-12 col-md-5 mt-3 p-2 d-flex flex-column'>
              <label htmlFor="selectedSection">{content.section}</label>
              <div className='w-1000 h-5 rounded'>  <Field
                name="selectedSection">
                {({ field }) => (
                  <Select
                    options={sections}
                    value={sectionSelected}
                    onChange={
                      value => {
                        sectionHandler(value, setFieldValue)
                        setSectionSelected(value);
                        field.onChange(value);
                      }
                    }
                    styles={customStyle}
                    onBlur={() => {
                      
                      setTouched({...touched,selectedSection:true})
                    }}
                    isSearchable
                  />
                )}
              </Field>
              </div>
              <ErrorMessage className='text-400-15 error-message' name="selectedSection" component="div" />
            </div>
          </div>

        </Form>
      )}
    </Formik>
  );
}

export default AddNewUser;
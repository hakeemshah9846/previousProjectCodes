import { useEffect, useState } from "react";
import Input from "../components/input";
import Content from "../constants/content.json"
import Button from "../components/button";
import { useNavigate } from "react-router-dom";
import closeIcon from "../assets/icons/close.svg"
import saveIcon from "../assets/icons/save.svg"
import SearchableDropdown from "../components/dropdown"
import profilePic from "../assets/icons/profile.svg"
import searchIcon from "../assets/icons/search.svg"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import axios from "axios";

const AddUser = ({ setShowHeader }) => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [selectedDepartment,setselectedDepartment]=useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [roles, setRoles] = useState("");
    const [selectedRoles,setSelectedRoles]=useState("");
    const [department, setDepartment] = useState("");
    const [section, setSection] = useState("");
    const [branchs, setBranchs] = useState("");
    const [selectedBranchs,setSelectedBranchs]=useState("");
    const [profileImage,setProfileImage]=useState("");
    const [firstNameError,setFirstNameError]=useState("");
    const [lastNameError,setLastNameError]=useState("");
    const [emailError,setEmailError]=useState("");
    const [phoneError,setPhoneError]=useState("");
    const [departmentError,setDepartmentError]=useState("");
    const [roleError,setRoleError]=useState("");
    const [branchError,setBranchError]=useState("");
    const [selectedSection,setSelectedSection]=useState("");
    const [sectionError,setSectionError]=useState("");
    const content = Content.AddUser;
    let profileImageRef;
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

    useEffect(() => {
        setShowHeader(false);
        fetchDepartment();
        fetchRoles();
        fetchSections();
        fetchBranches();
        return () => {
            setShowHeader(true);
        }
    }, [])

    const fetchDepartment = () => {
        const token = localStorage.getItem('token')
        if (!token) {
            navigate("/");
            return
        }

        axios({
            method: "GET",
            url: `${process.env.REACT_APP_BASE_URL}/departments`,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((response) => {
            const departments=response.data.data.map(item=>{
                return item.department;
            })
            setDepartment(departments);
        })
    }
    const fetchSections= () => {
        const token = localStorage.getItem('token')
        if (!token) {
            navigate("/");
            return
        }

        axios({
            method: "GET",
            url: `${process.env.REACT_APP_BASE_URL}/sections`,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((response) => {
            const departments=response.data.data.map(item=>{
                return item.department;
            })
            
        })
    }
    const fetchBranches = () => {
        const token = localStorage.getItem('token')
        if (!token) {
            navigate("/");
            return
        }

        axios({
            method: "GET",
            url: `${process.env.REACT_APP_BASE_URL}/branches`,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((response) => {
            const branches=response.data.data.map(item=>{
                return item.branch;
            })
            setBranchs(branches);
        })
    }

    const fetchRoles = () => {
        const token = localStorage.getItem('token')
        if (!token) {
            navigate("/");
            return
        }

        axios({
            method: "GET",
            url: `${process.env.REACT_APP_BASE_URL}/fetch-all-roles`,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((response) => {
            setRoles(response.data.data);
        })
    } 
    
    const submitHandler = (e) => {
        const token=localStorage.getItem("token");
        if(!token)return;

        e.preventDefault();
        let firstNameValid="";
        let lastNameValid=""; 
        let emailValid="";
        let phoneValid="";
        let departmentValid="";
        let roleValid="";
        let branchValid="";
        let sectionValid="";
        let isValid=true;
        if(!firstName || firstName.length===0){
            firstNameValid=content.firstnameError;
            isValid=false;
        }
        if(!lastName || lastName.length===0){
            lastNameValid=content.lastNameError;
            isValid=false;
        }
        if(!email || email.length===0){
            emailValid=content.emailError;
            isValid=false;
        }else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)){
            emailValid=content.invalidEmail;
            isValid=false;
        }
        if(!selectedDepartment || selectedDepartment.length===0){
            departmentValid=content.invalidDepartment;
            isValid=false;
        }
        if(!selectedRoles || selectedRoles.length===0){
            roleValid=content.invalidRole;
            isValid=false;
        }
        if(!selectedBranchs || selectedBranchs.length===0){
            branchValid=content.invalidBranch;
            isValid=false;
        }
        if(!phone || phone.length!==10){
            phoneValid=content.invalidPhone;
            isValid=false;
        }
        if(!selectedSection|| selectedSection.length===0){
            sectionValid=content.invalidSection;
            isValid=false;
        }

        setFirstNameError(firstNameValid);
        setLastNameError(lastNameValid);
        setPhoneError(phoneValid);
        setEmailError(emailValid);
        setDepartmentError(departmentValid);
        setRoleError(roleValid);
        setBranchError(branchValid)
        setPhoneError(phoneValid)
        if(!isValid) return ;
        console.log("hll");
        const axiosPromise=()=>{
            axios({
                method:"POST",
                url:`${process.env.REACT_APP_BASE_URL}/createUser`,
                headers:{
                    "Authorization":`Bearer ${token}`
                },
                data:{
                    first_name:firstName,
                    last_name:lastName,
                    email:email,
                    image:profileImage,
                    phone:phone,
                    department:selectedDepartment,
                    role:selectedRoles,
                    branch:selectedBranchs
                }
            })
        }
        axiosPromise();
    }
    const firstNameHandler = (e) => {
        setFirstName(e.target.value);
    }
    
    const emailHandler = (e) => {
        setEmail(e.target.value);
    }
    const phoneHandler = (e) => {
        let regex = /[^0-9]/g;
        let result = e.target.value.replace(regex, "");
        setPhone(result);
    }
    const lastNameHandler = (e) => {
        setLastName(e.target.value);
    }
    const closeHandler = () => {
        navigate('/')
    }
    
    const handleProfileImage = async (e) => {
        let item;
        if (e.target.files[0].type.split("/")[0] === "image") {
          item = e.target.files[0]
          const base64 = await encodeFileBase64(item);
          setProfileImage(base64);
        }
      };

      const replaceImage=(error)=>{
        error.target.src = profilePic;
      }
   
    const inputFields = [
        {
            label: content.FirstName,
            type: "text",
            onChange: firstNameHandler,
            value: firstName,
            inputType: "inutField",
            error:firstNameError,
            validationError:content.firstnameError

        },
        {
            label: content.LastName,
            type: 'text',
            onChange: lastNameHandler,
            value: lastName,
            inputType: "inutField",
            error:lastNameError,
            validationError:content.lastNameError
        },
        {
            label: content.Email,
            type: 'text',
            onChange: emailHandler,
            value: email,
            inputType: "inutField",
            error:emailError,
            validationError:content.emailError
        },
        {
            label: content.Phone,
            type: "phone",
            onChange: phoneHandler,
            value: phone,
            inputType: "inutField",
            maxlength: "10",
            error:phoneError,
            validationError:content.invalidPhone
        }, {
            label: content.department,
            target:selectedDepartment,
            values:department,
            setTarget:setselectedDepartment,
            error:departmentError,
            validationError:content.invalidDepartment,
        },{
            label:content.role,
            target:selectedRoles,
            values:roles,
            setTarget:setSelectedRoles,
            error:roleError,
            validationError:content.invalidRole
        },{
            label:content.Branch,
            target:selectedBranchs,
            values:branchs,
            setTarget:setSelectedBranchs,
            error:branchError,
            validationError:content.invalidBranch
        },{
            label:content.section,
            target:selectedSection,
            values:section,
            setTarget:setSelectedSection,
            error:sectionError,
            validationError:content.invalidSection
        }

    ]

    return (
        <div className="d-flex flex-column align-items-center">
            <div className="w-80 light-line mt-4">
                <div className="d-flex justify-content-between  align-items-center ">
                    <div className="text-700-40 color-primary-blue w-75">{content.AddUser}</div>
                    <div className="d-flex gap-4">
                        <Button
                            onClick={closeHandler}
                            text={content.Discard}
                            icon={closeIcon}
                            className="gap-2 btn-bg-light color-primary-blue btn-save  text-700-14"
                        />
                        <Button
                            onClick={submitHandler}
                            text={content.Save}
                            icon={saveIcon}
                            className="gap-2 bg-primary-blue text-white close-btn text-700-14"
                        />

                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-center mt-3">
            <img
                    src={profileImage }
                    className={'image-update'}
                    alt={firstName}
                    onError={replaceImage}
                />
                <FontAwesomeIcon className="cursor-pointer" icon={faPen} onClick={() => profileImageRef.click()} />
                <input
                    type="file"
                    hidden={true}
                    ref={(refParam) => (profileImageRef = refParam)}
                    accept=".png, .jpg, .jpeg"
                    onChange={handleProfileImage}
                />
            </div>
            
            <form onSubmit={submitHandler} className="d-flex flex-wrap justify-content-between mt-4 w-80 ">
               
                {inputFields.map((item) =>
                (<div className="col-12 col-md-5 mt-3">
                    {item.inputType === "inutField" ? (<Input
                        onChange={item.onChange}
                        label={item.label}
                        value={item.value}
                        maxlength={item.maxlength}
                        type={item.type}
                        validation={item.error}
                        err={item.validationError}
                    />) : (
                        <SearchableDropdown
                            label={item.label}
                            values={item.values}
                            target={item.target}
                            setTarget={item.setTarget}
                            validation={item.error}
                            err={item.validationError}
                        />
                    )}
                   
                </div>)
                )}
            </form>
        </div>
    )
}
export default AddUser;
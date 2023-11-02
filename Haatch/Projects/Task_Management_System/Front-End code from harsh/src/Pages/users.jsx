import { useState, useEffect } from "react";
import axios from "axios";
import UserCard from "../containers/userCard";
import Content from '../constants/content.json'
import { useNavigate } from "react-router";
import Button from "../components/button";
import addIcon from '../assets/icons/addicon.svg'
import Search from "../components/search";
import Button2 from "../components/button-2";
import filterIcon from "../assets/icons/filter.svg";
import ModalComponent from "../containers/modal";
const Users = () => {
   const [usersList, setUsersList] = useState("");
   const [searchValue, setSearchValue] = useState("");
   const [selectedUserId, setSelectedUserId] = useState("");
   const [selectedRole, setSelectedRole] = useState("");
   const [roles, setRoles] = useState("");
   console.log(addIcon);
   const navigate = useNavigate();
   const content = Content.UsersPage;


   useEffect(() => {
      deleteAUser()

   }, [selectedUserId])

   const fetchUsers = () => {
      const token = localStorage.getItem('token');
      if (!token) {
         return;
      }
      axios(
         {
            method: "GET",
            url: `${process.env.REACT_APP_BASE_URL}/fetch-all-profiles`,
            headers: {
               "Authorization": `Bearer ${token}`
            }
         }
      ).then((response) => {
         if (response.data.success) {
            setUsersList(response.data.data);
            console.log(response.data.data);

         }
      })
   }
   const deleteAUser = () => {
      const token = localStorage.getItem("token");
      console.log(token, "token");
      axios(
         {
            method: "DELETE",
            url: `${process.env.REACT_APP_BASE_URL}/delete-profile/${selectedUserId}`,
            headers: {
               'Authorization': `Bearer ${token}`
            }

         }
      ).then(() => {
         fetchUsers();
      }).catch(err => {
         console.log(err, "err");
      })
   }
   const handleClick = () => {
      navigate('/add_new_user');
   }

   useEffect(() => {

      fetchUsers();
      // setUsersList([{
      //    first_name: "kal",
      //    last_name: "El",
      //    roles: ["admin", "user", "superadmin"],
      //    Branch: "branch1",
      //    Department: "dep1",
      //    phone:8921048789,
      //    email:"hello@printingPress.com"
      // }])
   }, [])
   const deleteRole = () => {
      const token = localStorage.getItem("token")
      axios(
         {
            method: "PUT",
            url: `${process.env.REACT_APP_BASE_URL}/`,
            data: {
               role: selectedRole,
               target_id: selectedUserId
            },
            headers: {
               "Authorization": `Bearer ${token}`
            }
         }
      ).then(() => fetchUsers())

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
         setRoles(response.data.data);
      })
      //  setSelectedRole([
      //    'admin','user','superadmin'
      // ])
   }

   console.log(roles, "roles");
   return (
      <div className="d-flex flex-column align-items-center ">
         <div className="d-flex justify-content-between align-items-center w-80 mt-4">
            <div className="text-700-40 color-primary-blue">
               {content.Heading}
            </div>
            <Button
               type="button"
               onClick={handleClick}
               text={content.TopButton}
               icon={addIcon}
               disabled={false}
               className=" gap-2 bg-primary-blue text-white close-btn text-700-14 w-172"
            />
         </div>
         <div className="w-80 light-line mt-2">
            <div className="w-100 d-flex gap-2 justify-content-end py-3">
               <Search data={searchValue} setData={setSearchValue} />
               {/* <Button2 src={filterIcon} text={content.FilterButton}
                  className="border-black d-flex gap-1 align-items-center"
               /> */}
            </div>

         </div>
         <div className="w-80">
            {usersList &&
               usersList.map(item => {
                  return (
                     <div className="light-line">
                        <UserCard
                           selectedRoles={selectedRole}
                           data={item}
                           deleteAUser={deleteAUser}
                           setSelectedUserId={setSelectedUserId} />
                     </div> // 
                  )
               })
            }
         </div>

      </div>
   )
}

export default Users
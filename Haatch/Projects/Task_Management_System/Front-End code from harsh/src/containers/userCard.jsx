import Delete from "../components/delete";
import SmallBtn from "../components/btns";
import addIcon from "../assets/icons/addicon.svg"
import NavLink from "../components/navLink";
import editIcon from '../assets/icons/edit.svg'
import { useNavigate } from "react-router-dom";
import Content from "../constants/content.json";
import viewIcon from "../assets/icons/view.svg"
const UserCard=({data,setSelectedUserId,selectedRole,deleteAUser})=>{
    console.log(selectedRole,"selectedRole");
    console.log(data.roles,"data");
    const navigate=useNavigate();
    console.log(addIcon);
    return(
        <div className="h-120 d-flex justify-content-between align-items-center">
                <div className="d-flex gap-2 align-items-center">
                <span className="text-400-13 mr">{data?.first_name+" "+data?.last_name}</span>
                <span>{data?.phone}</span>
               <span>{data.email}</span>
                </div>
                <div className="d-flex gap-2">
                    {data?.roles.map(item=>{
                        return <SmallBtn text={item}/>
                    })}
                </div>
                <div className="d-flex gap-3">
                    <Delete onClick={()=>{
                        console.log("deleting......");
                        setSelectedUserId(data.id)
                    }}/>
                    <NavLink text={Content.UsersPage.NavigationLink1}
                    icon={editIcon}
                    alt={Content.UsersPage.NavAlt1}
                    onClick={()=>{
                        navigate(`/edit/${data?.id}`)
                    }}
                    />
                    {/* <NavLink  text={Content.UsersPage.NavigationLink2} //edit button
                    icon={viewIcon}
                    onClick={()=>{
                        navigate(`/${data?.id}`);
                    }}
                    alt={Content.UsersPage.NavAlt2}
                    /> */}
                </div>
        </div>
    )
}

export default UserCard;
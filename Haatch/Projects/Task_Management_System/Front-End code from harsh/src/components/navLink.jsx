import viewIcon from "../assets/icons/view.svg"
const NavLink=({onClick ,text,icon})=>{
    return (
        <div onClick={onClick} className="d-flex gap-1 cursor-pointer ">
            <img src={icon} alt="view" />
            <div>
                <span className=" color-primary-blue">{text}</span>
            </div>
    
        </div>)
}

export default NavLink;
;
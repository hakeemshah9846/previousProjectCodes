import deleteIcon from "../assets/icons/delete.svg";
const Delete = ({onClick}) => {
    return (
    <div onClick={onClick} className="d-flex cursor-pointer">
        <img src={deleteIcon} alt="delete" />
        <div>
            <span className="text-red">Delete</span>
        </div>

    </div>)

}

export default Delete; 
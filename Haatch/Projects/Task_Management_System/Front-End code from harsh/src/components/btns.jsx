import closeIcon from "../assets/icons/close.svg"

const SmallBtn=({text,length,onClick})=>{
    console.log(text);
   return ( <div className="d-flex cursor-pointer pap-3 p-1 justify-content-between rounded border-primary text-700-10">
           <span>{text}</span>
           {length>1&& <img onClick={onClick} src={closeIcon} alt="" />}

    </div> )
}

export default SmallBtn;
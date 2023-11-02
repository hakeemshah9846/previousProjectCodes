import Input from "./input";
import searchIcon from "../assets/icons/search.svg"
import {useEffect, useState} from "react"
const SearchableDropdown=(
   {label,values,target,setTarget,validation,err}
)=>{
    const [isClicked,setIsclicked]=useState(false);
    const [searchItem,setSearchItem]=useState("");
    const [searchArray,setSearchArray]=useState([...values]);
    const handleChange=(e)=>{
        setSearchItem(e.target.value);
        var array=values.filter(
            (item)=>{
                return item.toLowerCase().includes(e.target.value.toLowerCase());
            }
        );
        console.log("handleH");
        setSearchArray(array);
    }
    useEffect(()=>{
        setSearchArray(()=>{
            return [...values]
        })
    },[])
    return (
        <div className="pos-rel">
            <Input  
            label={label}
            type="text"
            icon={searchIcon}
            value={searchItem}
            className="h-80"
            onChange={handleChange}
            validation={validation}
            err={err}
            onFocus={
                (e)=>{
                    setIsclicked(true);
                }
            }
            
            
        />
        <ul className="bg-light bg-light list-unstyled pos-abs cursor-pointer w-100">
            {isClicked && searchArray.map((e)=>{
                return(
                    <li className={`hover d-flex p-3 w-100 border-bottom cursor-pointer`} onClick={()=>{
                    
                        const value=e;
                        setTarget(value)
                        setSearchItem(value)
                        setIsclicked(false);
                    }}>
                        {e}
                    </li>
                )
            })}
        </ul>
        </div>
        
    )
}

export default SearchableDropdown;
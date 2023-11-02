import React, { useState } from "react";
const Input = (
    {
        value,
        maxlength,
        icon,
        label,
        alt,
        placeholder,
        onChange,
        type,
        iconFunction,
        onMouseUp,
        onFocus,
        className,
        validation,
        err

    }) => {
    const [focused, setFocused] = useState(false);
    const [showError,setShowError]=useState(false);
    const handleOnBlur=(e)=>{
        if(!e.target.value || e.target.value.length===0){
            setShowError(true);
            return
        }
        setShowError(false);
    }
    const handleOnChange=(e)=>{
        if(e.target.value.length>0){
            setShowError(false);
        }

        onChange(e)
    }
   
    return (
        <div className={"form-group w-100 "}>
            <label htmlFor="" className={`mb-2 text-400-15 ${focused ? "color-primary-blue" : "color-black"}`}>
                {label}
            </label>
            <div className={`d-flex justify-content-between align-items-center ${focused ? "border-primary" : "border-black"} ${className}`}>
                <input
                    type={type} value={value}
                    className={" border-0 input-field w-100"}
                    placeholder={placeholder}
                    onChange={(e)=>{
                        handleOnChange(e);
                    }}
                    maxlength={maxlength}
                    onFocus={
                        (e) => {
                            setFocused(true);
                            onFocus()
                        }
                    }
                    onBlur={
                        e => {
                            setFocused(false)
                            handleOnBlur(e);
                        }
                    }
                />
                {icon && <img onMouseDown={iconFunction} onMouseUp={onMouseUp} className="m-2 w-20 h-20" src={icon} alt={alt} />}
            </div>
            {(validation) ?
                <div className="text-400-15 error-message">
                    {validation}
                </div>:(showError) ?
                    <div className="text-400-15 error-message">
                    {err}
                </div>:<></>
                }
        </div>)
}

export default Input;
import { Field,ErrorMessage } from "formik";
const CheckBox = ({ className, id,label }) => {
    return (
        <div className={className}>
            <label htmlFor={id}>{label}</label>
            <div  className="d-flex p-2 gap-2">
            <label className="d-flex gap-1">Yes
                <Field
                    type="radio"
                    name={id}
                    value='Yes'
                />
            </label>
            <label className="d-flex gap-1"> No
                <Field
                    type="radio"
                    name={id}
                    value='No'
                />
            </label>
            </div>


            <ErrorMessage className='text-400-15 error-message' name={id} component="div" />
        </div>
    )
}

export default CheckBox;
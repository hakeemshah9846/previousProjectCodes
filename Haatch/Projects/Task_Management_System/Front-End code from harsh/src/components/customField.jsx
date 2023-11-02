import { Field,ErrorMessage } from "formik";

const CustomField = ({id,className,onBlur,label}) => {
    <div className={className}>
        <label htmlFor={id}>{label}</label>
        <Field
            className="w-100 h-5 rounded input-field border-black"
            type="text"
            name={id}
            onFocus={(e) => e.currentTarget.classList.add('border-primary')}
            onBlur={onBlur}
        />
        <ErrorMessage className='text-400-15 error-message' name={id} component="div" />
    </div>
}

export default CustomField;
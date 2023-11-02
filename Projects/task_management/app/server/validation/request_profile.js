const validator= require('validator');
const isEmpty = require('./is_empty');

module.exports= function validateRequestProfileInput(data){


        let errors={};
        console.log("Validation file reached........");

        // const isEmpty = (value) =>
        // value === undefined ||
        // value === null ||
        // (typeof value === "object" && Object.keys(value).length === 0) ||
        // (typeof value === "string" && value.trim().length === 0);
  
    
        data.name= !isEmpty(data.name) ? data.name : '';
        // data.last_name= !isEmpty(data.last_name) ? data.last_name : '';
    
        data.email= !isEmpty(data.email) ? data.email : '';
        // data.password= !isEmpty(data.password) ? data.password : '';
    
        data.phone= !isEmpty(data.contact_no) ? data.contact_no : '';
        data.role= !isEmpty(data.role) ? data.role : '';
        data.department= !isEmpty(data.department) ? data.department : '';
        data.section= !isEmpty(data.section) ? data.section : '';
        data.campus= !isEmpty(data.campus) ? data.campus : '';
    
    
    
        
         if (validator.isEmpty(data.name)) {
           errors.name = " Name field is required";
         }

        if(!validator.isLength(data.name,{min: 2, max: 30})){
            errors.name= "Name must be between 2 and 30";
        }

        // if(validator.isEmpty(data.last_name)) {
        //     errors.last_name= "Last Name field is required";
        // }
    
        // if(!validator.isLength(data.last_name,{min: 1, max: 30})){
        //     errors.last_name= "Last Name must be between 1 and 30";
        // }

    
        if(validator.isEmpty(data.email)) {
            errors.email_empty= "Email field is required";
        }
    
        if(!validator.isEmail(data.email)) {
            errors.email_invalid= "Email is invalid";
        }

        if(validator.isEmpty(data.contact_no)) {
            errors.phone= "Phone number is required";
        }
    
        // if(validator.isEmpty(data.password)) {
        //     errors.password= "Password is required";
        // }
    
        // if(!validator.isLength(data.password, {min: 6, max: 30})){
        //     errors.password= "Password must be atleast 6 charactors";
        // }
    
        // if(validator.isEmpty(data.role)) {
        //     errors.role= "Role field is required";
        // }
    
        if(validator.isEmpty(data.department)) {
            errors.department= "Department field is required";
        }
    
        if(validator.isEmpty(data.section)) {
            errors.section= "Section field is required";
        }
      
        if(validator.isEmpty(data.campus)) {
            errors.campus= "Campus field is required";
        }
    
    

        console.log("Reached end of validation file....");
        console.log("Validation Errors : ", errors);
        console.log("isValid : ", isEmpty(errors));
    
        // let isValid = isEmpty(errors);


      
    
        return {
            errors,
            isValid: isEmpty(errors),
        }


}
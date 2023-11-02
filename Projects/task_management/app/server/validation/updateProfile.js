const validator= require('validator');
const isEmpty = require('./is_empty');

module.exports= function validateCreateUserInput(data){


        let errors={};
        console.log("Validation file reached........");

        // const isEmpty = (value) =>
        // value === undefined ||
        // value === null ||
        // (typeof value === "object" && Object.keys(value).length === 0) ||
        // (typeof value === "string" && value.trim().length === 0);
  
    
        data.first_name= !isEmpty(data.first_name) ? data.first_name : '';
        data.last_name= !isEmpty(data.last_name) ? data.last_name : '';
        data.role= !isEmpty(data.role) ? data.role : '';
        // data.user_id= !isEmpty(data.role) ? data.user_id : '';

    
        // data.password= !isEmpty(data.password) ? data.password : '';
    
        data.phone= !isEmpty(data.phone) ? data.phone : '';    
    
    
        
         if (validator.isEmpty(data.first_name)) {
           errors.last_name = "First Name field is required";
         }

        if(!validator.isLength(data.first_name,{min: 2, max: 30})){
            errors.first_name= "First Name must be between 2 and 30";
        }

        if(validator.isEmpty(data.last_name)) {
            errors.last_name= "Last field is required";
        }
    
        if(!validator.isLength(data.last_name,{min: 2, max: 30})){
            errors.first_name= "Last Name must be between 2 and 30";
        }

        if(validator.isEmpty(data.phone)) {
            errors.phone= "Phone number is required";
        }
    
        if(validator.isEmpty(data.role)) {
            errors.phone= "Role number is required";
        }

            
        // if(validator.isEmpty(data.user_id)) {
        //     errors.phone= "user_id number is required";
        // }

    
        
    
    

        console.log("Reached end of validation file....");
        console.log("Validation Errors : ", errors);
        console.log("isValid : ", isEmpty(errors));
    
        // let isValid = isEmpty(errors);


      
    
        return {
            errors,
            isValid: isEmpty(errors),
        }


}
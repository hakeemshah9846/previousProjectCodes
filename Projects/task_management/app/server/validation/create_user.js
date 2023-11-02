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
    
        data.email= !isEmpty(data.email) ? data.email : '';
        // data.password= !isEmpty(data.password) ? data.password : '';
    
        data.phone= !isEmpty(data.phone) ? data.phone : '';
        data.role= !isEmpty(data.role) ? data.role : '';
        // data.department= !isEmpty(data.department) ? data.department : '';
        // data.section= !isEmpty(data.section) ? data.section : '';
//         data.branch= !isEmpty(data.branch) ? data.branch : '';
    
    
    
        
         if (validator.isEmpty(data.first_name)) {
           errors.first_name = "First Name field is required";
         }

        if(!validator.isLength(data.first_name,{min: 2, max: 30})){
            errors.first_name= "First Name must be between 2 and 30";
        }

        if(validator.isEmpty(data.last_name)) {
            errors.last_name= "Last Name field is required";
        }
    
        if(!validator.isLength(data.last_name,{min: 1, max: 30})){
            errors.last_name= "Last Name must be between 1 and 30";
        }

        
        if(validator.isEmpty(data.email)) {
            errors.email_empty= "Email field is required";
        }
        
        if(!validator.isEmail(data.email)) {
            errors.email_invalid= "Email is invalid";
        }
        
        if(validator.isEmpty(data.phone)) {
            errors.phone= "Phone number is required";
        }
        
        // if(validator.isEmpty(data.password)) {
            //     errors.password= "Password is required";
            // }
            
            // if(!validator.isLength(data.password, {min: 6, max: 30})){
                //     errors.password= "Password must be atleast 6 charactors";
                // }
                console.log("Reached here ...");
                
                // if(validator.isEmpty(data.role)) {
                //     errors.role= "Role field is required";
                // }
    
        // if(validator.isEmpty(data.department)) {
        //     errors.department= "Department field is required";
        // }
    
        // if(validator.isEmpty(data.section)) {
        //     errors.section= "Section field is required";
        // }
      
        // if(validator.isEmpty(data.branch)) {
        //     errors.branch= "Branch field is required";
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
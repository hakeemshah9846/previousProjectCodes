const validator= require('validator');
const isEmpty = require('./is_empty');

module.exports= function validateBindingEditInput(data){


    console.log("Validation file reached........");
    
        let errors={};
        
    
        data.binding_id= !isEmpty(data.binding_id) ? data.binding_id : '';

        data.job_id= !isEmpty(data.job_id) ? data.job_id : '';

        data.binding_operator= !isEmpty(data.binding_operator) ? data.binding_operator : '';
        data.binding_type= !isEmpty(data.binding_type) ? data.binding_type : '';
    
        data.binding_status= !isEmpty(data.binding_status) ? data.binding_status : '';
        // data.password= !isEmpty(data.password) ? data.password : '';
    
        data.binding_page_count= !isEmpty(data.binding_page_count) ? data.binding_page_count : '';
        console.log("Binding page count : ", data.binding_page_count);
        data.binding_quantity= !isEmpty(data.binding_quantity) ? data.binding_quantity : '';
        data.require_perforation= !isEmpty(data.require_perforation) ? data.require_perforation : '';
        data.binding_material= !isEmpty(data.binding_material) ? data.binding_material : '';
        data.unit_cost= !isEmpty(data.unit_cost) ? data.unit_cost : '';

        console.log("unit cost : ", data.unit_cost);
    

    
    

        if (validator.isEmpty(data.binding_id)) {
            errors.binding_id = "binding_id field is required";
          }

          if (validator.isEmpty(data.job_id)) {
            errors.job_id = "job_id field is required";
          }

          
          
          if (validator.isEmpty(data.binding_operator)) {
              errors.binding_operator = "binding_operator field is required";
            }
            
            
            
            if(validator.isEmpty(data.binding_type)) {
                errors.binding_type= "binding_type field is required";
            }
            
            
            
            if(validator.isEmpty(data.binding_status)) {
                errors.binding_status= "binding_status field is required";
            }
            
            
            if(validator.isEmpty(data.binding_page_count)) {
                errors.binding_page_count= "binding_page_count field is required";
            }
    
        if(validator.isEmpty(data.binding_quantity)) {
            errors.binding_quantity= "binding_quantity is required";
        }
    

        if(validator.isEmpty(data.require_perforation)) {
            errors.require_perforation= "require_perforation field is required";
        }
    
        if(validator.isEmpty(data.binding_material)) {
            errors.binding_material= "binding_material field is required";
        }



        if(validator.isEmpty(data.unit_cost)) {
            errors.unit_cost= "unit_cost field is required";
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
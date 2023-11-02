const validator= require('validator');
const isEmpty = require('./is_empty');

module.exports= function validatePrintCoverInput(data){


    console.log("Validation file reached........");
    
        let errors={};
        
    
        data.job_id= !isEmpty(data.job_id) ? data.job_id : '';


        data.print_cover_operator= !isEmpty(data.print_cover_operator) ? data.print_cover_operator : '';
        data.print_cover_color= !isEmpty(data.print_cover_color) ? data.print_cover_color : '';
    
        data.print_cover_status= !isEmpty(data.print_cover_status) ? data.print_cover_status : '';
        // data.password= !isEmpty(data.password) ? data.password : '';
    
        data.print_cover_printer= !isEmpty(data.print_cover_printer) ? data.print_cover_printer : '';
        data.print_cover_paper_type= !isEmpty(data.print_cover_paper_type) ? data.print_cover_paper_type : '';
        data.print_cover_side= !isEmpty(data.print_cover_side) ? data.print_cover_side : '';
        data.require_lamination= !isEmpty(data.require_lamination) ? data.require_lamination : '';
        data.print_cover_quantity= !isEmpty(data.print_cover_quantity) ? data.print_cover_quantity : '';
        data.print_cover_material= !isEmpty(data.print_cover_material) ? data.print_cover_material : '';    

    
    



          if (validator.isEmpty(data.job_id)) {
            errors.job_id = "job_id field is required";
          }

          
          
          if (validator.isEmpty(data.print_cover_operator)) {
              errors.print_cover_operator = "print_cover_operator field is required";
            }
            
            
            
            if(validator.isEmpty(data.print_cover_color)) {
                errors.print_cover_color= "print_cover_color field is required";
            }
            
            
            
            if(validator.isEmpty(data.print_cover_status)) {
                errors.print_cover_status= "print_cover_status field is required";
            }
            
            
            if(validator.isEmpty(data.print_cover_printer)) {
                errors.print_cover_printer= "print_cover_printer field is required";
            }
    
        if(validator.isEmpty(data.print_cover_paper_type)) {
            errors.print_cover_paper_type= "print_cover_paper_type is required";
        }
    

        if(validator.isEmpty(data.print_cover_side)) {
            errors.print_cover_side= "print_cover_side field is required";
        }
    
        if(validator.isEmpty(data.require_lamination)) {
            errors.require_lamination= "require_lamination field is required";
        }



        if(validator.isEmpty(data.print_cover_quantity)) {
            errors.print_cover_quantity= "print_cover_quantity field is required";
        }

        if(validator.isEmpty(data.print_cover_material)) {
            errors.print_cover_material= "print_cover_material field is required";
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
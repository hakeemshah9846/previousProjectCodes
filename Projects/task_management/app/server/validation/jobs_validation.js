const validator= require('validator');
const isEmpty = require('./is_empty');
const jobsModel = require('../db/models/job_profile');

module.exports= async function validateJobsInput(data){


    console.log("Validation file reached........");
    
        let errors={};
  
    
        data.job_type= !isEmpty(data.job_type) ? data.job_type : '';
        data.job_status= !isEmpty(data.job_status) ? data.job_status : '';
    
        data.job_title= !isEmpty(data.job_title) ? data.job_title : '';
        // data.password= !isEmpty(data.password) ? data.password : '';
    
        data.requested_by= !isEmpty(data.requested_by) ? data.requested_by : '';
        data.requested_by_entity= !isEmpty(data.requested_by_entity) ? data.requested_by_entity : '';
        data.requested_by_department= !isEmpty(data.requested_by_department) ? data.requested_by_department : '';
        data.requested_by_section= !isEmpty(data.requested_by_section) ? data.requested_by_section : '';
        data.job_req_comment= !isEmpty(data.job_req_comment) ? data.job_req_comment : '';
    

        data.confidentiality= !isEmpty(data.confidentiality) ? data.confidentiality : '';
        data.require_sample= !isEmpty(data.require_sample) ? data.require_sample : '';
        data.require_edits= !isEmpty(data.require_edits) ? data.require_edits : '';
        data.document_type= !isEmpty(data.document_type) ? data.document_type : '';
        data.document_name= !isEmpty(data.document_name) ? data.document_name : '';
        data.document_mode= !isEmpty(data.document_mode) ? data.document_mode : '';
        data.req_delivery_date= !isEmpty(data.req_delivery_date) ? data.req_delivery_date : '';
        data.delivery_mode= !isEmpty(data.delivery_mode) ? data.delivery_mode : '';
        data.deliver_to= !isEmpty(data.deliver_to) ? data.deliver_to : '';
        data.deliver_to_entity= !isEmpty(data.deliver_to_entity) ? data.deliver_to_entity : '';
        data.deliver_to_department= !isEmpty(data.deliver_to_department) ? data.deliver_to_department : '';
        data.deliver_to_section= !isEmpty(data.deliver_to_section) ? data.deliver_to_section : '';
        data.require_cover= !isEmpty(data.require_cover) ? data.require_cover : '';
        data.require_finishing= !isEmpty(data.require_finishing) ? data.require_finishing : '';

    
    
        
         if (validator.isEmpty(data.job_type)) {
           errors.job_type = "job_type field is required";
         }



        if(validator.isEmpty(data.job_status)) {
            errors.job_status= "job_status field is required";
        }
    

    
        if(validator.isEmpty(data.job_title)) {
            errors.job_title_empty= "job_title field is required";
        }

        const title_count = await jobsModel.count({
            where: {
              job_title: data.job_title
            }
          });
        
          if (title_count > 0) {
            errors.title_not_unique = "Job title must be unique";
          }


        if(validator.isEmpty(data.requested_by)) {
            errors.requested_by= "requested_by field is required";
        }
    
        if(validator.isEmpty(data.requested_by_entity)) {
            errors.requested_by_entity= "requested_by_entity is required";
        }
    

        if(validator.isEmpty(data.requested_by_department)) {
            errors.requested_by_department= "requested_by_department field is required";
        }
    
        if(validator.isEmpty(data.requested_by_section)) {
            errors.requested_by_section= "requested_by_section field is required";
        }
    
        if(validator.isEmpty(data.job_req_comment)) {
            errors.job_req_comment= "job_req_comment field is required";
        }
      
        if(validator.isEmpty(data.confidentiality)) {
            errors.confidentiality= "confidentiality field is required";
        }
    
        if(validator.isEmpty(data.require_sample)) {
            errors.require_sample= "require_sample field is required";
        }

        if(validator.isEmpty(data.require_edits)) {
            errors.require_edits= "require_edits field is required";
        }
        // if(validator.isEmpty(data.document_type)) {
        //     errors.document_type= "document_type field is required";
        // }
        if(validator.isEmpty(data.document_name)) {
            errors.document_name= "document_name field is required";
        }
        // if(validator.isEmpty(data.document_mode)) {
        //     errors.document_mode= "document_mode field is required";
        // }
        if(validator.isEmpty(data.req_delivery_date)) {
            errors.req_delivery_date= "req_delivery_date field is required";
        }
        if(validator.isEmpty(data.delivery_mode)) {
            errors.delivery_mode= "delivery_mode field is required";
        }
        if(validator.isEmpty(data.deliver_to)) {
            errors.deliver_to= "deliver_to field is required";
        }
        if(validator.isEmpty(data.deliver_to_entity)) {
            errors.deliver_to_entity= "deliver_to_entity field is required";
        }
        if(validator.isEmpty(data.deliver_to_department)) {
            errors.deliver_to_department= "deliver_to_department field is required";
        }
        if(validator.isEmpty(data.deliver_to_section)) {
            errors.deliver_to_section= "deliver_to_section field is required";
        }
        if(validator.isEmpty(data.require_cover)) {
            errors.require_cover= "require_cover field is required";
        }
        if(validator.isEmpty(data.require_finishing)) {
            errors.require_finishing= "require_finishing field is required";
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
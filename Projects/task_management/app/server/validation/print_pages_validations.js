const validator= require('validator');
const isEmpty = require('./is_empty');
const printersModel = require('../db/models/printers');
const papersModel = require('../db/models/papers');

module.exports= async function validatePrintPagesInput(data){


    console.log("Validation file reached........");
    
        let errors={};
        
    
        data.job_id= !isEmpty(data.job_id) ? data.job_id : '';


        data.job_print_operator= !isEmpty(data.job_print_operator) ? data.job_print_operator : '';
        data.job_print_color= !isEmpty(data.job_print_color) ? data.job_print_color : '';
    
        data.print_sides= !isEmpty(data.print_sides) ? data.print_sides : '';
        // data.password= !isEmpty(data.password) ? data.password : '';
    
        data.job_print_pages= !isEmpty(data.job_print_pages) ? data.job_print_pages : '';
        data.print_pages_printer= !isEmpty(data.print_pages_printer) ? data.print_pages_printer : '';
        data.job_print_quantity= !isEmpty(data.job_print_quantity) ? data.job_print_quantity : '';
        data.paper_type= !isEmpty(data.paper_type) ? data.paper_type : '';
        data.job_req_paper_quantity= !isEmpty(data.job_req_paper_quantity) ? data.job_req_paper_quantity : '';
        data.job_print_comment= !isEmpty(data.job_print_comment) ? data.job_print_comment : '';    
        data.job_print_cost= !isEmpty(data.job_print_cost) ? data.job_print_cost : '';    
        data.job_print_total= !isEmpty(data.job_print_total) ? data.job_print_total : '';    
        data.job_req_lamination= !isEmpty(data.job_req_lamination) ? data.job_req_lamination : '';    
        data.job_req_stappled= !isEmpty(data.job_req_stappled) ? data.job_req_stappled : '';    
        data.job_paper_cost= !isEmpty(data.job_paper_cost) ? data.job_paper_cost : '';    

        const printer_unit_price = Number((await printersModel.findOne({where : {id : data.print_pages_printer},attributes : ['cost']})).getDataValue('cost'));
        console.log("Printer unit cost : ", printer_unit_price);
        const paper_unit_price = Number((await papersModel.findOne({where : {id: data.paper_type},attributes : ['paper_unitcost']})).getDataValue('paper_unitcost'));
        console.log("paper_unit_price unit cost : ", paper_unit_price);



        if(Number(data.job_print_total) !== Number(data.job_print_pages) * Number(data.job_print_quantity)) {
            errors.job_print_total = "Incorrect value";
        }

        if(Number(data.job_req_paper_quantity) !== Number(data.job_print_total)/Number(data.print_sides)) {

            // console.log("Job req paper quantity : ", Number(data.job_print_total)/Number(data.print_sides));
            if(Number(data.job_req_paper_quantity) !== (Number(data.job_print_total)/Number(data.print_sides))+ 0.5){ 

                errors.job_req_paper_quantity = "Incorrect value";
                
            }

        }

        let job_print_cost = Number(data.job_print_total) * Number(printer_unit_price);
        let rounded_job_print_cost = Number(job_print_cost.toFixed(4));
        console.log("rounded_job_print_cost : ",rounded_job_print_cost);

        if(Number(data.job_print_cost) !== rounded_job_print_cost) {

            errors.job_print_cost = "Incorrect value";

        }

        // console.log("data.job_paper_cost : ",data.job_paper_cost);
        // console.log("data.job_req_paper_quantity : ",data.job_req_paper_quantity);
        // console.log("Number(paper_unit_price) : ",Number(paper_unit_price));
        // console.log("Number(data.job_req_paper_quantity) * Number(paper_unit_price)",Number(data.job_req_paper_quantity) * Number(paper_unit_price));

        let job_paper_cost = Number(data.job_req_paper_quantity) * Number(paper_unit_price);
        let rounded_job_paper_cost = Number(job_paper_cost.toFixed(4));
        console.log("rounded_Job_paper_cost : ",rounded_job_paper_cost);

        if(Number(data.job_paper_cost) !== rounded_job_paper_cost ) {

            errors.job_paper_cost = "Incorrect value";

        }
    
          if (validator.isEmpty(data.job_id)) {
            errors.job_id = "job_id field is required";
          }

          
          
          if (validator.isEmpty(data.job_print_operator)) {
              errors.job_print_operator = "job_print_operator field is required";
            }
            
            
            
            if(validator.isEmpty(data.job_print_color)) {
                errors.job_print_color= "job_print_color field is required";
            }
            
            
            
            if(validator.isEmpty(data.print_sides)) {
                errors.print_sides= "print_sides field is required";
            }
            
            
            if(validator.isEmpty(data.job_print_pages)) {
                errors.job_print_pages= "job_print_pages field is required";
            }
    
        if(validator.isEmpty(data.print_pages_printer)) {
            errors.print_pages_printer= "print_pages_printer is required";
        }
    

        if(validator.isEmpty(data.job_print_quantity)) {
            errors.job_print_quantity= "job_print_quantity field is required";
        }
    
        if(validator.isEmpty(data.paper_type)) {
            errors.paper_type= "paper_type field is required";
        }



        if(validator.isEmpty(data.job_req_paper_quantity)) {
            errors.job_req_paper_quantity= "job_req_paper_quantity field is required";
        }

        if(validator.isEmpty(data.job_print_comment)) {
            errors.job_print_comment= "job_print_comment field is required";
        }

        if(validator.isEmpty(data.job_print_cost)) {
            errors.job_print_cost= "job_print_cost field is required";
        }

        if(validator.isEmpty(data.job_print_total)) {
            errors.job_print_total= "job_print_total field is required";
        }

        if(validator.isEmpty(data.job_req_lamination)) {
            errors.job_req_lamination= "job_req_lamination field is required";
        }

        if(validator.isEmpty(data.job_req_stappled)) {
            errors.job_req_stappled= "job_req_stappled field is required";
        }

        if(validator.isEmpty(data.job_paper_cost)) {
            errors.job_paper_cost= "job_paper_cost field is required";
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
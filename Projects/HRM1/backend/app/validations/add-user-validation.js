const validator = require("validator");
const isEmpty = require("./is_empty");
const users = require("../db/models/users");

module.exports = async function validateAddUserInput(data) {
  let errors = {};
  //console.log("Validation file reached........");

  data.employment_information_flag = !isEmpty(data.employment_information_flag)
    ? data.employment_information_flag
    : "";
  data.personel_information_flag = !isEmpty(data.personel_information_flag)
    ? data.personel_information_flag
    : "";
  data.address_flag = !isEmpty(data.address_flag) ? data.address_flag : "";
  data.salary_details_flag = !isEmpty(data.salary_details_flag)
    ? data.salary_details_flag
    : "";
  data.bank_details_flag = !isEmpty(data.bank_details_flag)
    ? data.bank_details_flag
    : "";
  data.skills_flag = !isEmpty(data.skills_flag) ? data.skills_flag : "";

  data.first_name = !isEmpty(data.first_name) ? data.first_name : "";
  data.last_name = !isEmpty(data.last_name) ? data.last_name : "";
  // data.short_name= !isEmpty(data.short_name) ? data.short_name : '';
  data.gender = !isEmpty(data.gender) ? data.gender : "";
  data.phone = !isEmpty(data.phone) ? data.phone : "";
  data.personel_email = !isEmpty(data.personel_email)
    ? data.personel_email
    : "";
  data.emergency_contact = !isEmpty(data.emergency_contact)
    ? data.emergency_contact
    : "";
  // data.pan = !isEmpty(data.pan) ? data.pan : "";
  data.blood_group = !isEmpty(data.blood_group) ? data.blood_group : "";
  data.dob = !isEmpty(data.dob) ? data.dob : "";

  data.current_address = !isEmpty(data.current_address)
    ? data.current_address
    : "";
  data.current_country = !isEmpty(data.current_country)
    ? data.current_country
    : "";
  data.current_state = !isEmpty(data.current_state) ? data.current_state : "";
  data.current_pincode = !isEmpty(data.current_pincode)
    ? data.current_pincode
    : "";

  data.permanent_address = !isEmpty(data.permanent_address)
    ? data.permanent_address
    : "";
  data.permanent_country = !isEmpty(data.permanent_country)
    ? data.permanent_country
    : "";
  data.permanent_state = !isEmpty(data.permanent_state)
    ? data.permanent_state
    : "";
  data.permanent_pincode = !isEmpty(data.permanent_pincode)
    ? data.permanent_pincode
    : "";

  data.employee_id = !isEmpty(data.employee_id) ? data.employee_id : "";
  data.job_title = !isEmpty(data.job_title) ? data.job_title : "";
  data.department_id = !isEmpty(data.department_id) ? data.department_id : "";
  data.employee_type_id = !isEmpty(data.employee_type_id)
    ? data.employee_type_id
    : "";
  data.profile_status = !isEmpty(data.profile_status)
    ? data.profile_status
    : "";
  data.official_email = !isEmpty(data.official_email)
    ? data.official_email
    : "";
  data.date_of_join = !isEmpty(data.date_of_join) ? data.date_of_join : "";
 
  data.organization_user_flag = !isEmpty(data.organization_user_flag) ? data.organization_user_flag : "";

  // if(data.profile_privacy) {

  //     if(data.profile_privacy.private) {

  //         data.profile_privacy.private= !isEmpty(data.profile_privacy.private) ? data.profile_privacy.private : '';
  //     }else {
  //         data.profile_privacy = "Profile privacy private field is required";
  //     }

  //     if(data.profile_privacy.public) {

  //         data.profile_privacy.public= !isEmpty(data.profile_privacy.public) ? data.profile_privacy.public : '';
  //     }else {
  //         data.profile_privacy = "Profile privacy public field is required"
  //     }

  // }else {
  //     errors.profile_privacy = "Profile privacy is required";
  // }

  // data.bank_name= !isEmpty(data.bank_name) ? data.bank_name : ''
  // data.account_no= !isEmpty(data.account_no) ? data.account_no : '';
  // data.ifsc= !isEmpty(data.ifsc) ? data.ifsc : '';
  // data.branch_name= !isEmpty(data.branch_name) ? data.branch_name : '';
  // data.account_holder= !isEmpty(data.account_holder) ? data.account_holder : '';

  // data.account_details= !isEmpty(data.account_details) ? data.account_details : '';

  data.salary = !isEmpty(data.salary) ? data.salary : "";

  // data.skills= !isEmpty(data.skills) ? data.skills : '';
  data.user_type_id= !isEmpty(data.user_type_id) ? data.user_type_id : '';

  if (data.employment_information_flag === "true") {
    
    if (validator.isEmpty(data.first_name)) {
      errors.first_name = "First Name field is required";
    }

    if (!validator.isLength(data.first_name, { min: 2, max: 30 })) {
      errors.first_name = "First Name must be between 2 and 30";
    }

    if (validator.isEmpty(data.last_name)) {
      errors.last_name = "Last Name field is required";
    }

    if (!validator.isLength(data.last_name, { min: 1, max: 30 })) {
      errors.last_name = "Last Name must be between 1 and 30";
    }

    //For organization user validation
    if(data.organization_user_flag !== "true") {

      if(data.employee_id) {

        if (validator.isEmpty(data.employee_id)) {
          errors.employee_id = "Employee id is required";
        }

        let employee_id_count = await users.countDocuments({
          "official_details.employee_id": { $regex: data.employee_id, $options: "i" },
        });
  
        //console.log("Employee id count : ", employee_id_count);
    
        if (
          Number(employee_id_count) > 0
        ) {
          errors.employee_id = "Employee id must be unique";
        }

      }

      if (validator.isEmpty(data.job_title)) {
        errors.job_title = "Job title is required";
      }

      if(data.department_id) {

        if (validator.isEmpty(data.department_id)) {
          errors.department_id = "Department is required";
        }

      }

      if(data.employee_type_id) {

        if (validator.isEmpty(data.employee_type_id)) {
          errors.employee_type_id = "Employee type id is required";
        }

      }


    
    if (validator.isEmpty(data.date_of_join)) {
      errors.date_of_join = "Date of join is required";
    }

    if (validator.isEmpty(data.profile_status)) {
      errors.profile_status = "Profile status is required";
    }
    }

    if (!validator.isEmail(data.official_email)) {
      errors.official_email_invalid = "Official email is invalid";
    }

    if (validator.isEmpty(data.official_email)) {
      errors.official_email = "Official email is required";
    }
    
    let official_email_count = await users.countDocuments({
      "official_details.official_email": { $regex: data.official_email, $options: "i" },
    });
    let official_email_count_1 = await users.countDocuments({
      "personel_details.personel_email": { $regex: data.official_email, $options: "i" },
    });
    //console.log("Official email count : ", official_email_count);

    if (
      Number(official_email_count) > 0 ||
      Number(official_email_count_1) > 0
    ) {
      errors.official_email = "Official email must be unique";
    }
  } else {
    errors.employment_details_required = "Employment details are required";
  }







  // if(validator.isEmpty(data.short_name)) {
  //     errors.short_name= "short_name is required";
  // }

  //Personel informations

  if (data.personel_information_flag === "true") {

    if(data.phone) {
      
          if (validator.isEmpty(data.phone)) {
            errors.phone = "Phone number is required";
          }
    }

    if (validator.isEmpty(data.personel_email)) {
      errors.personel_email_empty = "personel_email field is required";
    }

    if (!validator.isEmail(data.personel_email)) {
      errors.personel_email_invalid = "personel_email is invalid";
    }
    
    let personel_email_count = await users.countDocuments({
      "personel_details.personel_email": { $regex: data.personel_email, $options: "i" },
    });
    let personel_email_count_1 = await users.countDocuments({
      "official_details.official_email": { $regex: data.personel_email, $options: "i" },
    });

    //console.log("Personel email count : ", personel_email_count);

    if (
      Number(personel_email_count) > 0 ||
      Number(personel_email_count_1) > 0
    ) {
      errors.personel_email = "Personel email must be unique";
    }

    if(data.emergency_contact) {

      if (validator.isEmpty(data.emergency_contact)) {
        errors.emergency_contact = "emergency_contact is required";
      }

    }

    if(data.blood_group) {

      if (validator.isEmpty(data.blood_group)) {
        errors.blood_group = "blood_group is required";
      }

    }

    if (validator.isEmpty(data.dob)) {
      errors.dob = "dob is required";
    }

    if (validator.isEmpty(data.gender)) {
      errors.gender = "gender is required";
    }

    // if (validator.isEmpty(data.pan)) {
    //   errors.pan = "pan number is required";
    // }
  } else {
    errors.personel_information = "Personel informations are required";
  }



  //Address informations

  if (data.address_flag === "true") {
    if (validator.isEmpty(data.permanent_address)) {
      errors.permanent_address = "permanent_address is required";
    }

    if (validator.isEmpty(data.permanent_country)) {
      errors.permanent_country = "permanent_country is required";
    }

    if(data.permanent_state) {

      if (validator.isEmpty(data.permanent_state)) {
        errors.permanent_state = "permanent_state is required";
      }

    }

    if(data.permanent_pincode) {

      if (validator.isEmpty(data.permanent_pincode)) {
        errors.permanent_pincode = "permanent_pincode is required";
      }

    }


    if (validator.isEmpty(data.current_address)) {
      errors.current_address = "current_address is required";
    }

    if (validator.isEmpty(data.current_country)) {
      errors.current_country = "current_country is required";
    }

    if(data.current_state) {

      if (validator.isEmpty(data.current_state)) {
        errors.current_state = "current_state is required";
      }

    }

    if (data.current_pincode) {
      if (validator.isEmpty(data.current_pincode)) {
        errors.current_pincode = "current_pincode is required";
      }
    }
  }




  //Bank informations

  if (data.bank_details_flag === "true" && data.organization_user_flag !== "true") {

    if (data.account_details) {
      if (data.account_details.length == 0) {
        errors.account_details = "Bank accounts are required";
      }

      data.account_details.map((e) => {
        if (!e.bank_name) {
          errors.bank_name = "Bank name is required";
        }

        if (!e.account_no) {
          errors.account_no = "Account number is required";
        }

        if (!e.ifsc) {
          errors.ifsc = "IFSC is required";
        }

        if (!e.branch_name) {
          errors.branch_name = "Branch name is required";
        }

        if (!e.account_holder) {
          errors.account_holder = "Account holder is required";
        }
      });
    } else {
      errors.account_details = "Account details is required";
    }
  }

  


  //Salary details

  if (data.salary_details_flag === "true" && data.organization_user_flag !== "true") {
    if (validator.isEmpty(data.salary)) {
      errors.salary = "salary is required";
    }
  }



//Skills validation

  if (data.skills_flag === "true" && data.organization_user_flag !== "true") {
    if (data.skills) {
      if (data.skills.length == 0) {
        errors.skills = "Skills is required";
      }
    } else {
      errors.skills = "Skills field is required";
    }
  }
  if(data.organization_user_flag == "true") {

    //console.log("Organization user validation...");

  }else {

  //   if(validator.isEmpty(data.user_type_id)) {
  //     errors.user_type_id= "user_type_id is required";
  // }
    //console.log("User type set as employee from backend...");
  }

  // if(data.profile_privacy) {

  //     if(data.profile_privacy.private) {

  //         if(validator.isEmpty(data.profile_privacy.private)) {
  //             errors.profile_privacy.private= "profile_privacy.private is required";
  //         }

  //     }else {
  //         errors.profile_privacy = "Profile privacy private field is required";
  //     }

  //     if(data.profile_privacy.public) {

  //         if(validator.isEmpty(data.profile_privacy.public)) {
  //             errors.profile_privacy.public= "profile_privacy.public is required";

  //         }
  //     }else {
  //         errors.profile_privacy = "Profile privacy public field is required";
  //     }
  // }else {
  //     errors.profile_privacy = "Profile privacy is required";
  // }

  // if(validator.isEmpty(data.bank_name)) {
  //     errors.bank_name= "bank_name is required";
  // }

  // if(validator.isEmpty(data.account_no)) {
  //     errors.account_no= "account_no is required";
  // }

  // if(validator.isEmpty(data.ifsc)) {
  //     errors.ifsc= "ifsc is required";
  // }

  // if(validator.isEmpty(data.branch_name)) {
  //     errors.branch_name= "branch_name is required";
  // }

  // if(validator.isEmpty(data.account_holder)) {
  //     errors.account_holder= "account_holder is required";
  // }

  // if(validator.isEmpty(data.account_details)) {
  //       errors.account_details= "account_details is required"
  // }

  // if(validator.isEmpty(data.skills)) {
  //     errors.skills= "skills is required";
  // }

 

  //console.log("Reached end of validation file....");
  //console.log("Validation Errors : ", errors);
  //console.log("isValid : ", isEmpty(errors));

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

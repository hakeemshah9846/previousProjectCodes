const validator = require("validator");
const isEmpty = require("./is_empty");
const users = require("../db/models/users");
const mongoose = require('mongoose');

module.exports = async function validateEditUserInput(req) {
  console.log("User edit Validation file reached........");
  let errors = {};
  // console.log("Request body from user edit : ", req.body);
  let user_id_1 = req.params.user_id;
  let user_id_2 = req.body.user_id;
  let user_id;
  console.log("user id from edit user : ", user_id);
  console.log(" user_id_1 : ", user_id_1);
  console.log(" user_id_2 : ", user_id_2);

  if(user_id_1) {
    user_id = new mongoose.Types.ObjectId(user_id_1);
  }else if(user_id_2) {
    user_id = new mongoose.Types.ObjectId(user_id_2);
  }else {
    console.log("No user id found...");
  }
  console.log("user id from edit user : ", user_id);
  let data = req.body;

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
  data.first_name = !isEmpty(data.first_name) ? data.first_name : "";
  data.skills_flag = !isEmpty(data.skills_flag) ? data.skills_flag : "";

  // data.id= !isEmpty(data.id) ? data.id : '';

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
    // if(data.official_email) {
      data.official_email = !isEmpty(data.official_email)
        ? data.official_email
        : "";
    // }
  data.date_of_join = !isEmpty(data.date_of_join) ? data.date_of_join : "";
  data.organization_user_flag = !isEmpty(data.organization_user_flag)
    ? data.organization_user_flag
    : "";

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

  data.salary = !isEmpty(data.salary) ? data.salary : "";

  data.user_type_id = !isEmpty(data.user_type_id) ? data.user_type_id : "";

  // data.skills= !isEmpty(data.skills) ? data.skills : '';
  // data.user_type_id= !isEmpty(data.user_type_id) ? data.user_type_id : '';

  // if (validator.isEmpty(data.id)) {
  //     errors.id = "User id is required";
  //   }

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

    //For organization user

    if (data.organization_user_flag !== "true") {
      if (data.employee_id) {
        if (validator.isEmpty(data.employee_id)) {
          errors.employee_id = "Employee id is required";
        }

        let employee_id_count = await users.countDocuments({
          "official_details.employee_id": {
            $regex: data.employee_id,
            $options: "i",
          },
          _id: { $ne: user_id },
        });
        //console.log("employee_id count : ", employee_id_count);

        if (Number(employee_id_count) > 0) {
          errors.employee_id = "Employee id must be unique";
        }
      }

      if (validator.isEmpty(data.job_title)) {
        errors.job_title = "Job title is required";
      }

      if (validator.isEmpty(data.department_id)) {
        errors.department_id = "Department is required";
      }

      if (validator.isEmpty(data.employee_type_id)) {
        errors.employee_type_id = "Employee type is required";
      }

      if (validator.isEmpty(data.date_of_join)) {
        errors.date_of_join = "Date of join is required";
      }

      if (validator.isEmpty(data.profile_status)) {
        errors.profile_status = "Profile status is required";
      }
    }

    if (data.official_email) {
      //console.log("data.official_email : ", data.official_email);
      if (validator.isEmpty(data.official_email)) {
        errors.official_email = "Official email is required";
      }

      if (!validator.isEmail(data.official_email)) {
        errors.official_email_invalid = "Official email is invalid";
      }

      let official_email_count = await users.countDocuments({
        "official_details.official_email": {
          $regex: data.official_email,
          $options: "i",
        },
        _id: { $ne: user_id },

      });
      let official_email_count1 = await users.countDocuments({
        "personel_details.personel_email": {
          $regex: data.official_email,
          $options: "i",
        },
        _id: { $ne: user_id },
      });

      //console.log("Official email count : ", official_email_count);

      if (Number(official_email_count) > 0 || official_email_count1 > 0) {
        errors.official_email = "Official email must be unique";
      }
    }

    // let official_email_count = await users.countDocuments({
    //   "official_details.official_email": {
    //     $regex: data.official_email,
    //     $options: "i",
    //   },
    // });

    // //console.log("Official email count : ", official_email_count);

    // if (Number(official_email_count) > 0) {
    //   errors.official_email = "Official email must be unique";
    // }
  } else {
    errors.employment_informations = "Employment informations are required";
  }

  // if(validator.isEmpty(data.short_name)) {
  //     errors.short_name= "short_name is required";
  // }

  //Personel informations

  if (data.personel_information_flag === "true") {
    if (validator.isEmpty(data.phone)) {
      errors.phone = "Phone number is required";
    }

    if (data.personel_email) {
      if (validator.isEmpty(data.personel_email)) {
        errors.personel_email_empty = "Personel email field is required";
      }

      if (!validator.isEmail(data.personel_email)) {
        errors.personel_email_invalid = "Personel email is invalid";
      }

      let personel_email_count = await users.countDocuments({
        "personel_details.personel_email": {
          $regex: data.personel_email,
          $options: "i",
        },
        _id: { $ne: user_id },
      });


      let personel_email_count1 = await users.countDocuments({
        "official_details.official_email": {
          $regex: data.personel_email,
          $options: "i",
        },
        _id: { $ne: user_id },

      });
      //console.log("Personel email count : ", personel_email_count);

      if (Number(personel_email_count) > 0 || personel_email_count1 > 0) {
        errors.personel_email = "Personel email must be unique";
      }
    }

    if (validator.isEmpty(data.emergency_contact)) {
      errors.emergency_contact = "Emergency contact is required";
    }

    if (validator.isEmpty(data.blood_group)) {
      errors.blood_group = "Blood group is required";
    }

    if (validator.isEmpty(data.dob)) {
      errors.dob = "DOB is required";
    }

    if (validator.isEmpty(data.gender)) {
      errors.gender = "Gender is required";
    }

    // if (validator.isEmpty(data.pan)) {
    //   errors.pan = "pan number is required";
    // }
  } else {
    errors.personel_details = "Personel details are required";
  }

  if (data.address_flag === "true") {
    if (validator.isEmpty(data.permanent_address)) {
      errors.permanent_address = "Permanent address is required";
    }

    if (validator.isEmpty(data.permanent_country)) {
      errors.permanent_country = "Permanent country is required";
    }

    if (validator.isEmpty(data.permanent_state)) {
      errors.permanent_state = "Permanent state is required";
    }

    if (validator.isEmpty(data.permanent_pincode)) {
      errors.permanent_pincode = "Permanent pincode is required";
    }

    if (validator.isEmpty(data.current_address)) {
      errors.current_address = "Current address is required";
    }

    if (validator.isEmpty(data.current_country)) {
      errors.current_country = "Current country is required";
    }

    if (validator.isEmpty(data.current_state)) {
      errors.current_state = "Current state is required";
    }

    if (validator.isEmpty(data.current_pincode)) {
      errors.current_pincode = "Current pincode is required";
    }
  }

  //Bank details
  if (
    data.bank_details_flag === "true" &&
    data.organization_user_flag !== "true"
  ) {
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

  if (
    data.salary_details_flag === "true" &&
    data.organization_user_flag !== "true"
  ) {
    if (validator.isEmpty(data.salary)) {
      errors.salary = "Salary is required";
    }
  }

  //Skills details

  if (data.skills_flag === "true" && data.organization_user_flag !== "true") {
    if (data.skills) {
      if (data.skills.length == 0) {
        // errors.skills = "Skills is required";
        console.log("Validations : Skills empty in user edit");
      }
    } else {
      errors.skills = "Skills field is required";
    }
  }

  if (data.organization_user_flag == "true") {
    //console.log("Organization user validation...");
  } else {
    //   if(validator.isEmpty(data.user_type_id)) {
    //     errors.user_type_id= "user_type_id is required";
    // }

    //console.log("User type set as employee from backend...");
  }

  // if(validator.isEmpty(data.user_type_id)) {
  //     errors.user_type_id= "user_type_id is required";
  // }

  console.log("Reached end of edit user validation file....");
  //console.log("Validation Errors : ", errors);
  //console.log("isValid : ", isEmpty(errors));

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

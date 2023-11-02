const validator = require("validator");
const isEmpty = require("./is_empty");
const organizations = require("../db/models/organizations");



module.exports = async function validateAddOrganizationInput(data) {
    let errors = {};
    //console.log("Validation file reached........");


    data.name = !isEmpty(data.name) ? data.name : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.contact_no = !isEmpty(data.contact_no) ? data.contact_no : "";
  data.street = !isEmpty(data.street) ? data.street : "";
  data.city= !isEmpty(data.city) ? data.city : '';
  data.state = !isEmpty(data.state) ? data.state : "";
  data.country = !isEmpty(data.country) ? data.country : "";
  data.zipCode = !isEmpty(data.zipCode) ? data.zipCode : "";
  data.website = !isEmpty(data.website) ? data.website : "";
  data.founded_year= !isEmpty(data.founded_year) ? data.founded_year : '';
  data.industry = !isEmpty(data.industry) ? data.industry : "";


  if (validator.isEmpty(data.name)) {
    errors.name_empty = "Name field is required";
  }

  if (!validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name must be between 2 and 30";
  }

  
  if (validator.isEmpty(data.email)) {
    errors.email_empty = "Email field is required";
  }

  if (!validator.isLength(data.email, { min: 2, max: 30 })) {
    errors.email = "Email must be between 2 and 30";
  }

  
  if (!validator.isEmail(data.email)) {
    errors.email_invalid = "Email is invalid";
  }

  let email_count = await organizations.countDocuments({
    "email": data.email,
  });

  //console.log("Email count : ", email_count);

  if (
    Number(email_count) > 0
  ) {
    errors.email = "Email must be unique";
  }

  if (validator.isEmpty(data.contact_no)) {
    errors.contact_no_empty = "Contact number field is required";
  }

  if (!validator.isLength(data.contact_no, { min: 2, max: 30 })) {
    errors.contact_no = "Contact number must be between 2 and 30";
  }


  if (validator.isEmpty(data.street)) {
    errors.street_empty = "Street field is required";
  }

  if (!validator.isLength(data.street, { min: 1, max: 30 })) {
    errors.street = "Street must be between 1 and 30";
  }

  if (validator.isEmpty(data.city)) {
    errors.city_empty = "City field is required";
  }

  if (!validator.isLength(data.city, { min: 1, max: 30 })) {
    errors.city = "City must be between 1 and 30";
  }

  if (validator.isEmpty(data.state)) {
    errors.state_empty = "State field is required";
  }

  if (!validator.isLength(data.state, { min: 1, max: 30 })) {
    errors.state = "State must be between 1 and 30";
  }

  if (validator.isEmpty(data.country)) {
    errors.country_empty = "Country field is required";
  }

  if (!validator.isLength(data.country, { min: 1, max: 30 })) {
    errors.country = "Country must be between 1 and 30";
  }

  if (validator.isEmpty(data.zipCode)) {
    errors.zipCode_empty = "zipCode field is required";
  }

  if (!validator.isLength(data.zipCode, { min: 1, max: 30 })) {
    errors.zipCode = "zipCode must be between 1 and 30";
  }

  // if (validator.isEmpty(data.website)) {
  //   errors.website_empty = "Website field is required";
  // }

  if (!validator.isLength(data.website, { min: 1, max: 30 })) {
    errors.website = "Website must be between 1 and 30";
  }

  if (validator.isEmpty(data.founded_year)) {
    errors.founded_year_empty = "Founded year field is required";
  }

  if (!validator.isLength(data.founded_year, { min: 1, max: 30 })) {
    errors.founded_year = "Founded year must be between 1 and 30";
  }

  if (validator.isEmpty(data.industry)) {
    errors.industry_empty = "Industry field is required";
  }

  if (!validator.isLength(data.industry, { min: 1, max: 30 })) {
    errors.industry = "Industry must be between 1 and 30";
  }

    //console.log("Reached end of validation file....");
  //console.log("Validation Errors : ", errors);
  //console.log("isValid : ", isEmpty(errors));

  return {
    organization_errors : errors,
    Organization_isValid: isEmpty(errors),
  };

}

const validator = require("validator");
const isEmpty = require("./is_empty");

module.exports = function validatefirstTimeLoginInput(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  
if (!validator.isEmail(data.email)) {
    errors.email_invalid = "Email is invalid";
  }

  if (validator.isEmpty(data.email)) {
    errors.email_required = "Email field is required";
  }
return {
    errors,
    isValid: isEmpty(errors),
  };
};


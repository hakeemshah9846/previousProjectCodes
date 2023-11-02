
const validator = require("validator");
const isEmpty = require("./is_empty");

module.exports = function validatefirstTimeLoginInput(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.otp = !isEmpty(data.otp) ? data.otp : "";

  if (!validator.isEmail(data.email)) {
    errors.email_invalid = "Email is invalid";
  }

  if (validator.isEmpty(data.email)) {
    errors.email_empty = "Email field is required";
  }

  if (validator.isEmpty(data.otp)) {
    errors.password = "Password is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};


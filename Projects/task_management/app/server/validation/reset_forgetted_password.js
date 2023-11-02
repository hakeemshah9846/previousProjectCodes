const validator = require("validator");
const isEmpty = require("./is_empty");

module.exports = function validateLoginInput(data) {
  let errors = {};

  data.new_password = !isEmpty(data.new_password) ? data.new_password : "";
  data.confirm_new_password = !isEmpty(data.confirm_new_password) ? data.confirm_new_password : "";


  if (validator.isEmpty(data.new_password)) {
    errors.password_empty = "Password is required";
  }

  if (!validator.isLength(data.new_password, { min: 6, max: 30 })) {
    errors.password_invalid = "Password must be atleast 6 charactors";
  }

  if (validator.isEmpty(data.confirm_new_password)) {
    errors.confirm_password_empty = "Confirm Password is required";
  }

  if (!validator.isLength(data.confirm_new_password, { min: 6, max: 30 })) {
    errors.confirm_password_invalid = "Confirm Password must be atleast 6 charactors";
  }

  if(data.new_password !== data.confirm_new_password) {

    errors.non_matching_passwords = "Passwords must match"

  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};


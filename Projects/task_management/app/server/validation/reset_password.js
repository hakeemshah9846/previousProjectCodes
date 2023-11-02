const validator = require("validator");
const isEmpty = require("./is_empty");

module.exports = function validateLoginInput(data) {
  let errors = {};

  data.new_password = !isEmpty(data.new_password) ? data.new_password : "";

  if (validator.isEmpty(data.new_password)) {
    errors.password_empty = "Password is required";
  }

  if (!validator.isLength(data.new_password, { min: 6, max: 30 })) {
    errors.password_invalid = "Password must be atleast 6 charactors";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};


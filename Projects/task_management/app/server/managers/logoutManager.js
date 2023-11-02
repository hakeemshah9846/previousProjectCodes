const revoked_tokens = require("../db/models/revokedTokens");
const dayjs = require("dayjs");
const { where } = require("sequelize");
const error_function = require("../utils/response-handler").error_function;
const success_function = require("../utils/response-handler").success_function;

exports.revoke = function (token) {
  return new Promise(async (resolve, reject) => {


    if (
      token == null ||
      token == "null" ||
      token == "" ||
      token == "undefined"
    ) {
      reject({ status: 400, message: "Invalid Access Token" });
    }
    //adding revoked token to database
    else if (token) {
      // console.log("Token : ", token);
      revoked_tokens
        .findOrCreate({
          where: { token: token },
          defaults: {
            token: token,
            revoked_at: dayjs().format(),
          },
        })
        .then((result) => {
          // console.log("Result : ", result);
          resolve({ status: 200, data: result, message: "Logout Successful" });
        })
        .catch((error) => {
          console.log("Catch Error : ", error);
          console.log("Catch executed.....");
          reject(error_function("Logout Failed"));
        });
    } else {
      let response = "Invalid Token";
      reject(error_function(response));
    }
  });
};

exports.checkRevoked = function (token) {
  return new Promise(async (resolve, reject) => {
      
      // console.log("Token from check revoked : ", token);

      try {


      let revoked = await revoked_tokens.findOne({ where: { token: token } });
      if (revoked) resolve(true);
      resolve(false);
    } catch (error) {
      reject(error);
    }
  });
};

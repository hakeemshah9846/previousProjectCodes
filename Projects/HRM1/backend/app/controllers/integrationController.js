const success_function = require("../utils/response-handler").success_function;
const error_function = require("../utils/response-handler").error_function;
const users = require("../db/models/users");
const userManager = require("../managers/userManager");
const revokeManager = require('../managers/revokeManager');
const control_data = require('../utils/control-data.json');
const user_types = require("../db/models/user_types");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


exports.generateToken = async function (req, res) {

    const authHeader = req.headers["authorization"];
    const token = authHeader ? authHeader.split(" ")[1] : null;
    let decoded = jwt.decode(token);


    //Getting organization_id and user_type of the login user
    let user = await users
      .findOne({ $and: [{ _id: decoded.user_id }, { deleted: { $ne: true } }] })
      .populate("user_type");

      if (!user) {
        let response = error_function({
          status: 404,
          message: "User not found",
        });
        res.status(response.statusCode).send(response);
        return;
      }

    let user_type = user.user_type.user_type;
    let organization_id = user.organization;

    //console.log("Login user : ", user);
    //console.log("User Type : ", user_type);
    //console.log("Organization id : ", organization_id);

    if (user_type !== "admin") {
        //console.log("User not admin");
    } else {
      //console.log("User is admin");

      let response = error_function({
        status: 403,
        message: "Admin not allowed",
      });
      res.status(response.statusCode).send(response);
      return;
    }

    if (!organization_id) {
      let response = error_function({
        status: 404,
        message: "Organization not found",
      });
      res.status(response.statusCode).send(response);
      return;
    }

    //Generating a token for accessing user creation route
    let access_token = jwt.sign(
        { user_id: user._id },
        process.env.PRIVATE_KEY1
      );

      let response = success_function({
        status: 200,
        data: access_token,
        message: "Success",
      });

      res.status(response.statusCode).send(response);
      return;

}



exports.createUser = async function (req, res) {
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader.split(" ")[1];

      //Revoking token
      //console.log("Token from integration controller", token);
      let isRevoked = await revokeManager.checkRevoked(token);
      //console.log("isRevoked : ", isRevoked);
      if (isRevoked) {
        //console.log("Token already in revoked list");
        res.status(406).send(
          error_function({
            status: 406,
            message: "Token already in revoked list",
          })
        );
        return;
      }

      // let revoke_flag;
      var return_flag;

      await userManager
        .checkValid(req)
        .then(async (result) => {
          if (result.isValid) {
            await userManager
              .createUser(req)
              .then(async (result) => {
                revoke_flag = true;
                let response = success_function(result);
                res.status(result.status).send(response);
                // return_flag = true;
                return;
              })
              .catch((error) => {
                let response = error_function(error);
                res.status(error.status).send(response);
                return_flag = true;
                return;
              });
          } else {
            let response = error_function({
              status: 400,
              message: "Validation failed",
            });
            response.errors = result.errors;
            res.status(response.statusCode).send(response);
            return_flag = true;
            return;
          }
        })
        .catch((error) => {
          let response = error_function(error);
          response.errors = error.errors;
          res.status(error.status).send(response);
          return_flag = true;
          return;
        });
    } catch (error) {

        if(return_flag) {
            return;
        }
        if (process.env.NODE_ENV == "production") {
            let response = error_function({
              status: 400,
              message: error
                ? error.message
                  ? error.message
                  : error
                : "Something went wrong",
            });
      
            res.status(response.statusCode).send(response);
            return;
          } else {
            let response = error_function({ status: 400, message: error });
            res.status(response.statusCode).send(response);
            return;
          }
    }
}


exports.revokeToken = async function (req, res) {

  const authHeader = req.headers["authorization"];
  const token = authHeader ? authHeader.split(" ")[1] : null;
  let decoded = jwt.decode(token);

  let user = await users
  .findOne({$and : [{ _id: decoded.user_id },{deleted : {$ne : true}}]})
  .populate("user_type");

  let user_type = user.user_type.user_type;
  let organization_id = user.organization;

    //console.log("Login user : ", user);
    //console.log("User Type : ", user_type);
    //console.log("Organization id : ", organization_id);

    if (!organization_id) {
      let response = error_function({
        status: 404,
        message: "Organization not found",
      });
      res.status(response.statusCode).send(response);
      return;
    }

    let target_token = req.params.token; // Should be an array

    if(!target_token) {
      let response = error_function({
        status: 404,
        message: "Token is required",
      });
      res.status(response.statusCode).send(response);
      return;
    }

    //Revoking token
    let isRevoked = await revokeManager.checkRevoked(target_token);
    //console.log("isRevoked : ", isRevoked);
    if (isRevoked) {
      //console.log("Target token already in revoked list");
      res.status(406).send(
        error_function({
          status: 406,
          message: "Target token already in revoked list",
        })
      );
      return;
    }

    jwt.verify(
      target_token,
      process.env.PRIVATE_KEY1,
      async function (err, decoded) {
        if (err) {
          let response = error_function({
            status: 401,
            message: err.message,
          });
          res.status(401).send(response);
        } else {
          //Check the organization id of the target token
          let decoded1 = jwt.decode(target_token);
          let target_user = await users
            .findOne({
              $and: [{ _id: decoded1.user_id }, { deleted: { $ne: true } }],
            })
            .populate("user_type");
          let target_user_type = target_user.user_type.user_type;
          let target_organization_id = target_user.organization;

          //console.log("Target user : ", target_user);
          //console.log("target_user_type : ", target_user_type);
          //console.log("target_organization_id : ", target_organization_id);
          let required_user_type = "organization";

          if (toString(target_organization_id) === toString(organization_id)) {
            if (
              (toString(target_user_type) === toString(user_type) && toString(target_user_type) === toString(required_user_type))
            ) {
              if (!isRevoked) {
                revokeManager
                  .revoke(target_token)
                  .then((result) => {
                    // let response = success_function(result);
                    // res.status(result.status).send(response);
                    //console.log("Revoked result : ", result);
                    let response = success_function({
                      status: 200,
                      message: "success",
                    });
                    res.status(response.statusCode).send(response);
                    return;
                  })
                  .catch((error) => {
                    let response = error_function(error);
                    res.status(error.status).send(response);
                    return;
                  });
              } else {
                //console.log("Target token already in revoked list");
                res.status(406).send(
                  error_function({
                    status: 406,
                    message: "Target token already in revoked list",
                  })
                );
              }
            } else {
              let response = error_function({
                status: 403,
                message: "Not allowed",
              });
              res.status(response.statusCode).send(response);
              return;
            }
            //Revoke token
          } else {
            let response = error_function({
              status: 400,
              message: "Wrong organization",
            });
            res.status(response.statusCode).send(response);
            return;
          }
        }
      });

}
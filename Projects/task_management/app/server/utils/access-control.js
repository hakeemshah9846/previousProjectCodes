const jwt = require("jsonwebtoken");
const authController = require("../controllers/authController");
const error_function = require("./response-handler").error_function;
const control_data = require("./control-data.json");
const userModel = require("../db/models/users");
const checkRevoked = require("../managers/logoutManager").checkRevoked;
const userRoleConnector = require("../db/models/user_roles_connection");
const user_roles_connection = require("../db/models/user_roles_connection");
const { QueryTypes } = require("sequelize");
const userRoles = require("../db/models/user_roles");
const user_roles = require("../db/models/user_roles");
const e = require("express");

exports.accessControl = async function (access_types, req, res, next) {
  try {
    //middleware to check JWT
    if (access_types == "*") {
      next();
    } else {
      const authHeader = req.headers["authorization"];
      const token = authHeader ? authHeader.split(" ")[1] : null;
      if (
        token == null ||
        token == "null" ||
        token == "" ||
        token == "undefined"
      ) {
        let response = error_function({
          status: 401,
          message: "Invalid Access Token",
        });
        res.status(401).send(response);
      } else {
        //verifying token
        jwt.verify(
          token,
          process.env.PRIVATE_KEY,
          async function (err, decoded) {
            if (err) {
              let response = error_function({
                status: 401,
                message: err.message,
              });
              res.status(401).send(response);
            } else {
              //checking access control
              let allowed = access_types
                .split(",")
                .map((obj) => control_data[obj]);
              // console.log("allowed : (from access control) : ", allowed);

              //Finda a user using user_id decoded from token in the users table
              let user = await userModel.findOne({
                where: { id: decoded.user_id },
              });

              //Returns the rows which has the decoded user_id
              let userRolesConnector = await userRoleConnector.findAll({
                where: { user_id: decoded.user_id },
              });

              console.log(
                "Type of user role connector : ",
                typeof userRolesConnector
              );

              console.log("UserRolesConnector : ", userRolesConnector);
              const length = userRolesConnector.length;

              if (user) {
                //Finds role_ids from user_role_connection table
                let user_role_ids = userRolesConnector.map((obj) => {
                  // let role_id_column = await userRoleConnector.findOne({
                  //     plain: true,
                  //     raw: true,
                  //     attributes: ["role_id"],
                  //     where: { user_id: decoded.user_id },
                  //   });
                  //   console.log("Role Id Column : ", role_id_column);
                  //   const role_id = role_id_column.role_id;
                  //   console.log("Role Ids : ", role_id);
                  console.log("Role Id : ", obj.getDataValue("role_id"));
                  return obj.getDataValue("role_id");
                });

                console.log("User role ids : ", user_role_ids);

                //Finds user_role from user_roles table using the role_id

                var user_roles = await Promise.all(
                  user_role_ids.map(async (role_id) => {
                    let user_role_column = await userRoles.findOne({
                      // raw: true,
                      // plain: true,
                      // attributes: ["role"],
                      where: { id: role_id },
                    });

                    console.log("User Role Column : ", user_role_column);

                    return user_role_column.getDataValue("role");
                  })
                );

                console.log("User Roles : ", user_roles);
                console.log("Type of user roles : ", typeof user_roles);
              }

            //   let permitted_role = ()=>{ user_roles.map((role) => {
            //     console.log("role from permission : ", role);
            //     console.log("Allowed : ", allowed);

            //     let temp = allowed.map((e) => {
            //       if (e === role) {

            //         return role;

            //       }else return null;
            //     });

            //     console.log("Temp : ", temp);

            //     if(temp) {
            //         return temp;
            //     }
            //   });
            // }

            let permitted_role = ()=>{
                for(var i =0; i<allowed.length; i++){

                    for(var j=0; j<user_roles.length; j++){
                        if(user_roles[j] === allowed[i]){
                            return user_roles[j];
                        }
                    }
                }
            }

            const role = permitted_role();
            console.log("Allowed role : ", role);

              if (allowed && allowed.includes(role)) {
                //checking if the token is in revoked list
                let revoked = await checkRevoked(token);
                if (revoked === false) {
                  //token not in revoked list
                  next();
                } else if (revoked === true) {
                  //token is in revoked list
                  let response = error_function({
                    status: 401,
                    message: "Revoked Access Token",
                  });
                  res.status(401).send(response);
                } else {
                  let response = error_function({
                    status: 400,
                    message: "Something Went Wrong",
                  });
                  res.status(400).send(response);
                }
              } else {
                let response = error_function({
                  status: 403,
                  message: "Not allowed to access the route",
                });
                res.status(403).send(response);
              }
            }
          }
        );
      }
    }
  } catch (error) {
    let response = error_function(error);
    res.status(400).send(response);
  }
};

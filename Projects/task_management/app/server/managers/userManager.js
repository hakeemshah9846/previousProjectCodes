const userModel = require("../db/models/users");
const userRoles = require("../db/models/user_roles");
const userRoleConnector = require("../db/models/user_roles_connection");
const email_transporter = require("../utils/email_transporter").sendEmail;
const set_password_template =
  require("../utils/email-templates/set_password").resetPassword;
const forgot_password_template =
  require("../utils/email-templates/forgot-password").forgotPassword;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const departmentModel = require("../db/models/departments");
const sectionModel = require("../db/models/sections");
const branchModel = require("../db/models/branches");
const entitiesModel = require('../db/models/entities');
const campusModel = require('../db/models/campus');
const requestProfileModel = require('../db/models/request_profile');
const operatorsModel = require('../db/models/operators');
const finishing_and_bindings = require('../db/models/finishing_and_bindings');
const fs = require('fs');
const fileUpload = require('../utils/file_upload').fileUpload;
const validateCreateUser = require('../validation/create_user');
const users = require("../db/models/users");
const { decode } = require("punycode");
const { Console } = require("console");
const binding_types = require("../db/models/binding_types");
const binding_status = require("../db/models/binding_status");
// const operatorsModel = require('../db/models/operators');
const materialsModel = require('../db/models/materials');
// const branches = require("../db/models/branches");

exports.createUser = async function (
  //Create another login for first time login
  token,
  first_name,
  last_name,
  email,
  image,
  phone,
  roles, 
  isOperator, 
  operator_id, 
  isSupervisor
) {
  return new Promise(async (resolve, reject) => {
    try {
      //checking if requested user is admin or not
      let decoded = jwt.decode(token);

      let adminUser = await userModel.findOne({where :{id : decoded.user_id} });

      if (adminUser) {
        //checking if user exist
        console.log("Inside if statement.......")
        if (first_name && last_name && email && phone && roles) {
          // Validations
          // data ={
          //   first_name : first_name,
          //   last_name : last_name,
          //   email : email,
          //   phone : phone,
          //   role : role,
          //   department : department,
          //   section : section,
          //   branch : branch
          // }

          // const Validations = await validateCreateUser(data);

          // if (!isValid) {
          //   reject({"status" : 400, "data" : errors, "message" : "Validations failed"});
          // }

          let user = await userModel.findOne({ where: { email: email } });
          // decoded = jwt.decode(token);
          // const user_id = decoded.user_id;
          // user_role_id = userRoleConnector.findAll({ where: { user_id: user_id } });

          if (user) {
            //user exist
            reject({ status: 403, message: "User Already Exist" });
          } else {
            let salt = bcrypt.genSaltSync(10);

            // Generating a random one time password for first time login
            let chars =
              "0123456789abcdefghijklmnopqrstuvwxyzABCDE#F$G@H*I&JKLMNOPQRSTUVWXYZ";
            let random_password = "";
            for (let i = 0; i <= 7; i++) {
              var randomNumber = Math.floor(Math.random() * chars.length);
              random_password += chars.substring(randomNumber, randomNumber + 1);
            }

            // let oneTimePassword = bcrypt.hashSync(otp, salt);
            let password = bcrypt.hashSync(random_password);

            //Getting corresponding department id
            // let department_value = await departmentModel.findOne({
            //   attributes: ["id"],
            //   raw: true,
            //   where: { department: department },
            // });
            // let department_id = department_value.id;
            // console.log("Department Id : ", department_id);

            //Getting corresponding section id
            // let section_value = await sectionModel.findOne({
            //   attributes: ["id"],
            //   raw: true,
            //   where: { section: section },
            // });
            // let section_id = section_value.id;
            // console.log("Section Id : ", section_id);

            //Getting corresponding branch id
            // let branch_value = await branchModel.findOne({
            //   attributes: ["id"],
            //   raw: true,
            //   where: { branch: branch },
            // });
            // let branch_id = branch_value.id;
            // console.log("Branch Id : ", branch_id);

            //Initializing user datas
            let new_user = {
              first_name: first_name,
              last_name: last_name,
              image: image,
              email: email,
              phone: phone,
              //             department_id: department_id,
              // section_id: section_id,
              //             branch_id: branch_id,
              password: password,
              isOperator : isOperator,
              // operator_id : operator_id,
              isSupervisor : isSupervisor,
              // otp: oneTimePassword,
              // otp_status: "active",
              new_user: "true",
            };

            //Checking for image
            if (image) {
              image = await fileUpload(image, "users");

              if (image) {
                new_user["image"] = image;
              } else {
                console.log("Unable to save image");
              }
            } else {
              new_user["image"] = null;
            }

            //saving
            let [newUser, created] = await userModel.findOrCreate({
              where: { email: email },
              defaults: new_user,
              raw: true,
            });

            console.log("New user : ", newUser);

            console.log("New user id : ", newUser.id);

            //Saving role
            if (created) {

            
              let ifSupervisor = JSON.parse(isSupervisor);
              console.log("ifSupervisor : ", ifSupervisor);
              
              let ifOperator = JSON.parse(isOperator);
              console.log("ifOperator : ", ifOperator);

              // let role_id = (
              //   await userRoles.findOne({
              //     where: { role: role },
              //     attributes: ["id"],
              //   })
              // ).getDataValue("id");
              
              //if supervisor save role to operators table with user_type as supervisor
              if(ifSupervisor) {

                // let supervisor_id = (await userRoles.findOne({where : {role : "superviosr"},attributes : ['id']})).getDataValue('id');
                // let setRoleId = await userRoleConnector.create({
                //   user_id : newUser.id,
                //   role_id : supervisor_id
                // });

                let saveUser = await operatorsModel.create({
                  operator_name : first_name + ' ' + last_name,
                  operator_type : "superviosr",
                });

                let savedUser = await saveUser.save();

                
                if(savedUser) {

                  let updateId =  await newUser.update({
                     operator_id : saveUser.id,
                   });
 
                   let updated = await updateId.save();
 
                if(updated) {
                  console.log("id from operators table saved in users table");
                }else {
                  console.log("id from operators table not saved in users table");
                }
                  console.log("User is a supervisor and user details saved to operators table with user type supervisr....");
                }else {
                  console.log("Supervisor user not saved in operators table");
                }
              }else {
                console.log("User not a supervisor");
              }




              //if operator save role to operators table with user_type as operator
              if(ifOperator) {

                // let supervisor_id = (await userRoles.findOne({where : {role : "superviosr"},attributes : ['id']})).getDataValue('id');
                // let setRoleId = await userRoleConnector.create({
                //   user_id : newUser.id,
                //   role_id : supervisor_id
                // });

                let saveUser = await operatorsModel.create({
                  operator_name : first_name + ' ' + last_name,
                  operator_type : "operator",
                });

                let savedUser =await saveUser.save();


                if(savedUser) {

                 let updateId =  await newUser.update({
                    operator_id : saveUser.id,
                  });

                  let updated = await updateId.save();

                  if(updated) {
                    console.log(" id from operators table saved to user table...");
                  }else {
                    console.log(" id from operators table not saved to database...");
                  }

                  console.log("User is an operator and user details saved to operators table with user type operator....");
                }else {
                  console.log("Operator user not saved in operators table");
                }
              }else {
                console.log("User not an operator");
              }




              let req_role_ids = roles.map((e)=> {
                return Number(e);
              });


              // for (const data of req_role_ids) {
              //   await userRoleConnector.create({
              //     user_id: newUser.id,
              //     role_id: data,
              //   });
              // }



              // let setRoleId = await userRoleConnector.create({
              //   user_id: newUser.id,
              //   role_id: role,
              // });

              let setRoleId = await Promise.all(req_role_ids.map(async(role) => {
                await userRoleConnector.create({
                  user_id: newUser.id,
                  role_id: role,
                });
              }));


             

              //Sending email and password

              // if (setRoleId) {
                let email_template = await set_password_template(
                  first_name,
                  email,
                  random_password
                );

                // console.log(email_template);
                // await email_transporter(
                //   email,
                //   "Update Password",
                //   email_template
                // );
                resolve({
                  status: 200,
                  data : newUser.id,
                  message: "Login details send to the email address",
                });
              // } else {
              //   reject({ status: 422, message: "Cannot add user role" });
              // }
            } else {
              reject({ status: 422, message: "User not created" });
            }
          }
        } else {
          if (!first_name)
            reject({ status: 422, message: "First Name is required" });
          if (!last_name)
            reject({ status: 422, message: "Last Name is required" });
          if (!phone) reject({ status: 422, message: "Phone is required" });
          if (!roles) reject({ status: 422, message: "Role is required" });
          if (!email) reject({ status: 422, message: "Email is required" });
          if (!password)
            reject({ status: 422, message: "Password is required" });
        }
      }else {

        reject({ status: 422, message: "Requested user not found" });

      }

      
    } catch (error) {
      reject({
        status: 400,
        message: error
          ? error.message
            ? error.message
            : error
          : "Something went wrong",
      });
    }
  });
};

//Update by login user itself
//No role required since login user itself cannot update their role, only admin can update or change or add a role to the users
exports.updateProfile = async function (first_name, last_name, image, phone, role, token) {

  return new Promise(async (resolve, reject) => {
    try {
      if( first_name && last_name && phone && role){

        let decoded = jwt.decode(token);

        let user = await userModel.findOne({where : {id : decoded.user_id}});

        if(user) {

          console.log("User Found : ", user);
          newProfile = {
            first_name : first_name,
            last_name : last_name,
            phone : phone,
            image : image,
          }


             //Checking for image
             if (image) {
               image = await fileUpload(image, "users");

               if (image) {
                 newProfiel["image"] = image;
               } else {
                 console.log("Unable to save image");
               }
             } else {
               newProfile["image"] = null;
             }

             let update = await user.update(newProfile);
             let updated = update.save();

             if (updated) {

              //There is no role update required since login user itself cannot update their roles, only admin can change and update their roles

               resolve({
                 status: 200,
                 message: "Profile updated successfully",
               });
             }else {

              reject({ status: 422, message: "Profile not updated" });

             }

            //  if(updated) {
            //   let role_id = (
            //     await userRoles.findOne({
            //       where: { role: role },
            //       attributes: ["id"],
            //     })
            //   ).getDataValue("id");

            //   let existingRoles = (await userRoleConnector.findAll({where : {user_id : user_id}, attributes : ['role_id']})).getDataValue('role_id');

            //   set_role = Promise.all(existingRoles.map(async(e) => {
            //     if(e.role_id != role_id) {

            //       let setRoleId = await userRoleConnector.create({
            //         user_id: newUser.id,
            //         role_id: role_id,
            //       });

            //       if (setRoleId) {
            //         resolve({
            //           status: 200,
            //           message: "Profile updated successfully",
            //         });
            //       }else {
            //         reject({ status: 422, message: "Role not updated" });
            //       }
            //     }else {
            //       console.log("Role already exists")
            //     }
            //   }));

         
            //  }
  
        }else {
          reject({ status: 422, message: "Requested user not found" });

        }

      } else {
        if (!first_name)
          reject({ status: 422, message: "First Name is required" });
        if (!last_name)
          reject({ status: 422, message: "Last Name is required" });
        if (!phone) reject({ status: 422, message: "Phone is required" });
      }

    } catch (error) {

      reject({
        status: 400,
        message: error
          ? error.message
            ? error.message
            : error
          : "Something went wrong",
      });
      
    }
  })
}


exports.deleteProfile = async function (token, targetId) {
  return new Promise(async (resolve, reject) => {
    try {

      let decoded = jwt.decode(token);

      let user = await userModel.findByPk(decoded.user_id);

      if (user) {
        let targetUser = await userModel.findByPk(targetId);

        await targetUser.destroy();

        resolve({ status: 200, message: "Profile deleted" });
      } else {
        reject({ status: 404, message: "Requested user not found" });
      }

    } catch (error) {
      reject({
        status: 400,
        message: error
          ? error.message
            ? error.message
            : error
          : "Something went wrong",
      });
    }
  });
};


exports.deleteRequestProfile = async function (token, targetId) {
  return new Promise(async (resolve, reject) => {
    try {

      let decoded = jwt.decode(token);

      let user = await userModel.findByPk(decoded.user_id);

      if (user) {
        let targetUser = await requestProfileModel.findByPk(targetId);

        await targetUser.destroy();

        resolve({ status: 200, message: "Request Profile deleted" });
      } else {
        reject({ status: 404, message: "Requested user not found" });
      }

    } catch (error) {
      reject({
        status: 400,
        message: error
          ? error.message
            ? error.message
            : error
          : "Something went wrong",
      });
    }
  });
};

exports.forgotPassword = async function (email) {
  return new Promise(async (resolve, reject) => {
    try {
      if (email) {
        let user = await userModel.findOne({ where: { email: email } });
        if (user) {
          let reset_token = jwt.sign(
            { user_id: user.id },
            process.env.PRIVATE_KEY,
            { expiresIn: "10m" }
          );

          console.log("Reset Token : ", reset_token);

          await user.set({
            forgot_password_token: reset_token,
          });

          let data = await user.save();

          // console.log("Data : ", data);

          if (data) {
            let reset_link = `${process.env.FRONTEND_URL}/reset-password?token=${reset_token}`;
            let email_template = await forgot_password_template(
              user.first_name,
              reset_link
            );
            email_transporter(email, "Forgot Password", email_template);
            resolve({ status: 200, message: "Email sent successfully" });
          } else reject({ status: 400, message: "Password reset failed" });
        } else {
          reject({ status: 403, message: "Forbidden" });
        }
      } else reject({ status: 422, message: "Email is required" });
    } catch (error) {
      reject({
        status: 400,
        message: error
          ? error.message
            ? error.message
            : error
          : "Something went wrong",
      });
    }
  });
};

//Reset Password
exports.passwordReset = async function (token, old_password, new_password, confirm_new_password) {
  return new Promise(async (resolve, reject) => {
    try {
      decoded = jwt.decode(token);
      console.log("User Id : ", decoded.user_id);
      const user_id = decoded.user_id;
      console.log("Decoded : ", decoded);
      let user = await userModel.findOne({
        where: { id: decoded.user_id },
      });

      console.log("User : ", user);

      if (user) {

        //Checking new password and confirm password
        if(new_password !== confirm_new_password) {
          reject({ status: 401, message: "Passwords don't match" });
        }
        //Checking if the user is a new user or not
        //Setting the password value for corresponding users
        let new_user = user.getDataValue('new_user');

        
        console.log("New user : ",new_user);


          let password = user.getDataValue('password'); //Password is password if old user
          console.log("Password : ",password);
          console.log("user_id : ",user.id);
          // console.log("Old user found");
          // console.log("Old password : ",password);
        

        bcrypt.compare(old_password, user.password, async (error, auth) => {
          if (auth === true) {
            let salt = bcrypt.genSaltSync(10);
            let password = bcrypt.hashSync(new_password, salt);

            //  let saveToken = await userModel.update({reset_password_token : token});

            //Updates users password field with new password and set new_user to false and now onwards this new user(if new user) can sccess the login route no need for the firsTime login route
            let updatePassword = await user.update({
              password: password,
              new_user: "false",
              password_changed : true,
            });
            console.log("Updated Password : ", updatePassword);

            if (updatePassword) {
              resolve({
                status: 200,
                message: "Password changed successfully",
              });
            } else reject({ status: 400, message: "Password reset failed" });
          } else {
            reject({ status: 401, message: "Incorrect password" });
          }
        });
      } else reject({ status: 403, message: "Forbidden" });
    } catch (error) {
      reject({
        status: 400,
        message: error
          ? error.message
            ? error.message
            : error
          : "Something went wrong",
      });
    }
  });
};

exports.resetForgettedPassword = async function (token, new_password, confirm_new_password) {
  return new Promise(async (resolve, reject) => {
    try {
      decoded = jwt.decode(token);
      console.log("Decoded : ", decoded);
      console.log("User Id : ", decoded.user_id);
      const user_id = decoded.user_id;
      console.log("Decoded : ", decoded);
      let user = await userModel.findOne({
        where: { id: decoded.user_id },
      });

      console.log("User : ", user);

      if (user) {
        //Checking if the user is a new user or not
        //Setting the password value for corresponding users
        // let new_user = user.new_user;

        //Chencking confirm password matches or not
        if(new_password !== confirm_new_password) {
          reject({ status: 400, message: "Passwords don't match" });
        }

        let salt = bcrypt.genSaltSync(10);
        let password = bcrypt.hashSync(new_password, salt);

        // if (new_user === "true") {
        
        //   await user.update({new_user : "false"});
        // }

        let updatePassword = await user.update({
          password: password,
          new_user: "false",
          password_changed : true,
        });
        console.log("Updated Password : ", updatePassword);

        if (updatePassword) {
          resolve({
            status: 200,
            message: "Password changed successfully",
          });
        } else reject({ status: 400, message: "Password reset failed" });

      } else reject({ status: 403, message: "Forbidden" });
    } catch (error) {
      reject({
        status: 400,
        message: error
          ? error.message
            ? error.message
            : error
          : "Something went wrong",
      });
    }
  });
};

exports.fetchAllProfiles = async function (token, page, pageSize, keyword) {

  return new Promise(async (resolve, reject)=>{

    try {

      // console.log("Token : ", token);
      //decoding token and finding the requested user
      const decoded = jwt.decode(token);
      const user = await userModel.findOne({where : {id : decoded.user_id}});
    
      if(user){
    
        // let users = await userModel.findAll({
        //   attributes: ['first_name', 'last_name', 'email', 'image', 'phone', 'createdAt','updatedAt'] //incomplete, need to implement a way to fetch department, section, and branch details from corresponding columns
        // });

        //Array to store the ids of all users
        let idData = [];

        const offset = (page - 1) * pageSize;

        let where = {};
  if (keyword) {
    where = {
      [Op.or]: [
        {
          first_name: {
            [Op.like]: `%${keyword}%`,
          },
        },
        {
          last_name: {
            [Op.like]: `%${keyword}%`,
          },
        },
        {
          email: {
            [Op.like]: `%${keyword}%`,
          },
        },
        {
          phone: {
            [Op.like]: `%${keyword}%`,
          },
        },
      ],
    };
  }






        //Getting the id's
        const { count, rows } = await userModel.findAndCountAll({ where,attributes  : ['id'],raw : true,order : [['id','DESC']]});

        const totalPages = Math.ceil(count / pageSize);


        // console.log("Rows : ", rows);

        //Pushing all ids to the idData array using map function
        rows.map(id => { idData.push(id.id)});

        console.log("idData : " , idData);

        // let users = [];
      
        //Mapping idData inorder to fetch user details
       let users =  await Promise.all(idData.map(async (id) => { 
        //Variable to store user_info
          let user_info = {}
          //Variable to store user_role ids
          let user_role_id = [];


          //Finding the specific user from database using primary key
          let user = (await userModel.findByPk(id));


          //Saving basic info of user from user table to user_info
          user_info.id = user.id;
          user_info.first_name = user.first_name;
          user_info.last_name = user.last_name;
          user_info.email = user.email;
          user_info.phone = user.phone;

          if(user.image !== null) {

            user_info.image = user.image;

          }else {
            user_info.image = "No image";
          }

          user_info.isOperator = user.isOperator;
          user_info.operator_id = user.operator_id;
          user_info.isSupervisor = user.isSupervisor;

          let image_path = user.image
          console.log("Image Path : ", image_path);
          // if(image_path !== null) {


          //   fs.readFile(`${image_path}`, (err, data) => {
          //     if (err) throw err;
          //     // encode the data as base64 string
          //     const base64Image = Buffer.from(data).toString("base64");
          //     // send the base64 encoded string to the frontend
          //     user_info.image = base64Image;
          //   });

          // }else {
          //   user_info.image = "No image";
          // }



          //Finding role id's of the user from user-role connector table using user_id
          let role_ids = await userRoleConnector.findAll({where : {user_id : id}, raw : true, attributes : ['role_id']});

          //Mapping role_ids from database and storing only the role_id attribute to user_role_id variable
          role_ids.map(role => { user_role_id.push(role.role_id)});
          console.log('Role ids : ',user_role_id );

          
          //Then we got the role_ids and map the user_role_ids inorder to find the roles from roles table
          let roles = await Promise.all(user_role_id.map(async (role_id) => {

            //Find specific role names from roles table
            // console.log("Role id inside map funciton: ", role_id);
            let role = (await userRoles.findOne({where: {id : role_id}}));
            if(role) {

              let role_values = role.getDataValue('role');
              return role_values;
            }else {
              return "No roles found"
            }
            
            
          }))

          // saving roles to the  user_info object variable
          user_info.roles = roles;

          console.log("Roles : ", roles);
          // users.push(user_info);
          // console.log("Users: ", users);


          // let user_by_id = await userModel.findByPk(id);
          //Finding department, section and branch id's
          // let department_id = user.department_id;
          // console.log("Department_id : ", department_id);
          // let section_id = user.section_id;
          // console.log("Section_id : ", section_id);
          // let branch_id = user.branch_id;
          // console.log("Branch_id : ", branch_id);

          // //Finding department, section and banch names from specific tables and saving it to the user_info object variable
          // let department = (await departmentModel.findOne({ where : {id : department_id}, attributes : ['department'], raw : true})).department;
          // console.log("Department : ", department);
          // user_info.department = department;
          // let section = (await sectionModel.findOne({where : {id : section_id}, attributes : ['section'], raw : true})).section;
          // // console.log("Section : ", section);
          // user_info.section = section;
          // let branch = (await branchModel.findOne({where : {id : branch_id}, raw : true, attributes : ['branch']})).branch;
          // // console.log("Branch : ", branch);
          // user_info.branch = branch;

          //Returning the user_info of the user of mapped_id
          return user_info;
          // console.log("Users  : ", users);



        }));

        // console.log("Users : ", users);



      
        // console.log("All fetched Users : ", users);
        resolve({"status" : 200, "data" : users, "message" : "All users details fetched successfully",meta: {
          count,
          totalPages,
          currentPage: page,
          pageSize,
        },});
    
      }
    } catch (error) {

      reject({
        status: 400,
        message: error
          ? error.message
            ? error.message
            : error
          : "Something went wrong",
      });
      
    }


  })



}


exports.fetchSingleProfile = async function (token) {

  return new Promise(async (resolve, reject)=>{

    try {

      console.log("Token : ", token);
      
      const decoded = jwt.decode(token);
      const userId = decoded.user_id;
      console.log("Type : ", typeof(userId));
      console.log("User_id : ", userId);
      // let user_id = userId.Number;
      const admin_user = await userModel.findOne({where : {id : decoded.user_id}});
    
      if(admin_user){

        console.log("If condition passed");


        console.log("Branch_id : ", admin_user.branch_id);
        console.log("Branch type : ",typeof(admin_user.branch_id));
        let branch_id = parseInt(admin_user.branch_id);
        console.log("Branch_id type : ",typeof(branch_id));

        // let branchName = (await branchModel.findOne({where : {id : branch_id}})).branch;
        // console.log("branchName : ", branchName);
        // let sectionName = (await sectionModel.findOne({where : {id : admin_user.section_id}})).section;
        // console.log("sectionName : ", sectionName);

        // let departmentName = (await departmentModel.findOne({where : {id : admin_user.department_id}})).department;
        // console.log("departmentName : ", departmentName);

        //Fetching role
        let role_ids = await userRoleConnector.findAll({where : {user_id : decoded.user_id}, attributes : ['role_id']});
        let roles = await Promise.all(role_ids.map(async (e) =>{
          let role = (await userRoles.findOne({where : {id : e.role_id}, attributes : ['role']})).getDataValue('role');
          return role;
        }));

        console.log("Roles : ", roles);

        let profile = {
          firstName : admin_user.first_name,
          lastName : admin_user.last_name,
          email : admin_user.email,
          image : admin_user.image,
          phone : admin_user.phone,
          roles : roles,
          // department : departmentName,
          // section : sectionName,
          // branch : branchName,
        }
  
      
        console.log("Profile data : ", profile);
        resolve({"status" : 200, "data" : profile, "message" : "User details fetched successfully"});
    
      }else {

        reject({"status" : 404, "message" : "No profile found"});
      }
    } catch (error) {

      reject({
        status: 400,
        message: error
          ? error.message
            ? error.message
            : error
          : "Something went wrong",
      });
      
    }


  })



}



exports.fetchAllDepartments = async function (token) {

  return new Promise(async (resolve, reject)=>{

    try {

      console.log("Token : ", token);
      
      const decoded = jwt.decode(token);
      const user = await userModel.findOne({where : {id : decoded.user_id}});
    
      if(user){
    
        let departments = await departmentModel.findAll({attributes : ['id','department']});

        let data = departments.map((e) => {
          let department = {};
          department.id = e.id;
          department.value = e.department;
          return department;
        });
      
        console.log("All fetched Users : ", departments);
        resolve({"status" : 200, "data" : data, "message" : "Departments fetched successfully"});
    
      }else {
        reject({"status" : 401, "message" : "Not allowed to access the route"});
      }
    } catch (error) {

      reject({
        status: 400,
        message: error
          ? error.message
            ? error.message
            : error
          : "Something went wrong",
      });
      
    }


  })



}


exports.fetchAllSections = async function (token) {

  return new Promise(async (resolve, reject)=>{

    try {

      console.log("Token : ", token);
      
      const decoded = jwt.decode(token);
      const user = await userModel.findOne({where : {id : decoded.user_id}});
    
      if(user){
    
        let sections = await sectionModel.findAll({attributes : ['id','section']});

        let data = sections.map((e)=> {
          let section = {};
          section.id = e.id;
          section.value = e.section;
          return section;
        })
      
        console.log("All fetched Users : ", sections);
        resolve({"status" : 200, "data" : data, "message" : "Sections fetched successfully"});
    
      }else {
        reject({"status" : 401, "message" : "Not allowed to access the route"});
      }
    } catch (error) {

      reject({
        status: 400,
        message: error
          ? error.message
            ? error.message
            : error
          : "Something went wrong",
      });
      
    }


  })



}



exports.fetchAllBranches = async function (token) {

  return new Promise(async (resolve, reject)=>{

    try {

      console.log("Token : ", token);
      
      const decoded = jwt.decode(token);
      const user = await userModel.findOne({where : {id : decoded.user_id}});
    
      if(user){
    
        let branches = await branchModel.findAll({attributes : ['branch']});
      
        console.log("All fetched Users : ", branches);
        resolve({"status" : 200, "data" : branches, "message" : "Branches fetched successfully"});
    
      }else {
        reject({"status" : 401, "message" : "Not allowed to access the route"});
      }
    } catch (error) {

      reject({
        status: 400,
        message: error
          ? error.message
            ? error.message
            : error
          : "Something went wrong",
      });
      
    }


  })



}




exports.fetchAllRoles = async function(token) {

  return new Promise(async (resolve, reject) =>{

    try {

      const decoded = jwt.decode(token);

      const user = await userModel.findByPk(decoded.user_id);
  
      if(user) {
  
        let data = await userRoles.findAll({where : {id : {[Op.not]:1}},raw: true, attributes : ['id','role']});
        console.log("Type of data  : ", typeof(data));
        let roles = [];
        console.log("Role length before : ", roles.length);


        // for(let i=0; i<data.length; i++){

        //   roles.push(data[i].role);

        // }



        data.map(e => { roles.push({id : e.id,role : e.role})});

        console.log("Roles : ", roles);

        console.log("Roles length after : ", roles.length);


        if(roles.length > 0) {

          resolve({"status" : 200, "data" : roles, "message" : "User roles fetched successfully"});
        }else {
          reject({"status" : 400, "message" : "No roles found"});
        }
  
      }else {
        reject({"status" : 400, "message" : "Requested user not found"});
      }
      
    } catch (error) {

      console.log("Error : ", error);

      reject({"status" : 400, "message" : "Something went wrong"});
      
    }

  
  })
}



exports.addRoles = async function (
  //Create another login for first time login
  token,
  role
) {
  return new Promise(async (resolve, reject) => {
    try {
      //checking if requested user is admin or not

      //checking if user exist
      if (token && role
      ) {

        let decoded = jwt.decode(token);
        let user = await userModel.findOne({ where: {id: decoded.user_id } });

        // decoded = jwt.decode(token);
        // const user_id = decoded.user_id;
        // user_role_id = userRoleConnector.findAll({ where: { user_id: user_id } });

        if (user) {
          //user exist
          console.log("Role : ", role);
          // let user_role_id = (await userRoles.findOne({where : {role : role}})).getDataValue('id');
          // console.log("user_role_id : ", user_role_id);
          // let addRole = await userRoleConnector.create({user_id : user_id, role_id : user_role_id});

          let addRole = await  userRoles.create({role : role});
          let saveRole = await addRole.save();

          if(saveRole) {

            resolve({"status" : 200, "message" : "Role added successfully"});
          }else {

            reject({"status" : 400, "message" : "Cannot add  role"});
          }

        } else {
          reject({"status" : 400, "message" : "Cannot find requested user"});
        }
          // console.log(email_template)

        }else {
          reject({"status" : 400, "message" : "Datas not sufficient"});
        }
    } catch (error) {
      reject({
        status: 400,
        message: error
          ? error.message
            ? error.message
            : error
          : "Something went wrong",
      });
    }
  });
};


exports.fetchSingleUserDetails = async function (token, id) {

  return new Promise(async (resolve, reject)=>{

    try {

      console.log("Token : ", token);
      
      const decoded = jwt.decode(token);
      const user = await userModel.findOne({where : {id : decoded.user_id}});
    
      if(user){

        const targetUser = await userModel.findOne({where : {id : id}, attributes : ['id','first_name','last_name','email','phone','image','isOperator','operator_id','isSupervisor'],raw : true});
        if(targetUser){

          console.log("Target user found...");

          let user_roles = await userRoleConnector.findAll({
            where: { user_id: targetUser.id },
            include: [
              {
                model: userRoles,
                as: "user_role",
                attributes: ["role"],
                raw: true,
              },
            ],
            raw: true,
            // attributes: ["user_role.role"],
            attributes : ["role_id"]
          });

          console.log("user_roles.... : ", user_roles);

          // let roles = user_roles.map((role) => {
          //   return role.role;
          // })

          // roles.push(user_roles.user_role.role);
          
          targetUser.roles = user_roles;
          

          // console
          // let branchName = (await branchModel.findOne({where : {id : targetUser.branch_id}})).getDataValue('branch');
          // console.log("branch_name : ", branchName);
          // let sectionName = (await sectionModel.findOne({where : {id : targetUser.section_id}})).getDataValue('section');
          // let departmentName = (await departmentModel.findOne({where : {id : targetUser.department_id}})).getDataValue('department');
          // console.log("department-name : ", departmentName);
          // let user_details = await userRoleConnector.findAll({
          //   where: { user_id: targetUser.id },
          //   include: [
          //     { model: users, attributes: ['id','first_name']},
          //     { model: userRoles, attributes: {exclude : ['createdAt','updatedAt']},separate : false},
          //   ],
          //   attributes: { exclude: ["createdAt", "updatedAt"] },
          // })
          // .then(results => {
          //   const groupedResults = {};
            
          //   results.forEach(result => {
          //     const userData = result.users;
          //     console.log("userData : ", userData);
          //     const userRolesData = result.userRoles;
          //     console.log("userRoles : ", userRolesData);
              
          //     if (!groupedResults[userData.id]) {
          //       // If we haven't seen this userData data before, add it to the grouped results
          //       console.log("Insinde results...");
          //       groupedResults[userData.id] = {
          //         ...userData.toJSON(),
          //         userRolesData: []
          //       };
          //     }
          
          //     // Add the userRolesData data to the appropriate group in the grouped results
          //     groupedResults[userData.id].userRolesData.push(userRolesData.toJSON());
          //   });
          
          //   // Convert the object of grouped results to an array
          //   const finalResults = Object.values(groupedResults);
          
          //   // Do something with the finalResults array
          //   console.log(finalResults);
          // });
          // let roles= [];
  //         console.log("Role_ids : ",roles_ids);

  //          let roles = await Promise.all(roles_ids.map( async role =>{
  //           let user_roles = await userRoles.findAll({where : {id : role.role_id}, attributes : ['role']});
  //           let target_user_role = await Promise.all(user_roles.map( async role => {

  //             console.log("Role : ", role.getDataValue('role'));
  //             let user_role = role.getDataValue('role');
  //             console.log(" user role : ", user_role);
  //             return user_role;
  //             // console.log("Roles :", roles);
  //           } ));
  //           return target_user_role[0];
  //           }))

  // console.log("Roles : ", roles);

  //         let profile = {
  //           firstName : targetUser.first_name,
  //           lastName : targetUser.last_name,
  //           email : targetUser.email,
  //           image : targetUser.image,
  //           phone : targetUser.phone,
  //           department : departmentName,
  //           section : sectionName,
  //           branch : branchName,
  //           roles : roles
  //         }
    
        
  //         console.log("Profile data : ", profile);
          resolve({"status" : 200, "data" : targetUser, "message" : "User details fetched successfully"});
        }else {
          reject({"status" : 404, "message" : "Cannot find this user"});
        }
    
      }else {

        reject({"status" : 404, "message" : "Requested user profile not found"});
      }
    } catch (error) {

      reject({
        status: 400,
        message: error
          ? error.message
            ? error.message
            : error
          : "Something went wrong",
      });
      
    }


  })



}

//Update user details by admin
exports.updateSingleUserDetails = async function (token, user_id, first_name, last_name, image, phone, roles,isOperator, operator_id, isSupervisor) {

  return new Promise(async (resolve, reject)=>{

    try {

      // console.log("Token : ", token);
      
      // const decoded = jwt.decode(token);
      // const admin_user = await userModel.findOne({where : {id : decoded.user_id}});
    
      // if(admin_user){

      //   const targetUser = await userModel.findOne({where : {id : user_id}});
      //   if(targetUser){

      //     // let branch_id = (await branchModel.findOne({where : {branch : branch}})).getDataValue('id');
      //     // let section_id = (await sectionModel.findOne({where : {section : section}})).getDataValue('id');
      //     // let department_id = (await departmentModel.findOne({where : {department : department}})).getDataValue('id');
      //     let role_id = (await userRoles.findOne({where : {role : role}, attributes : ['id']})).getDataValue('id');
      //     // let roles= [];
  
      //     let profileUpdate = {
      //       branch_id : branch_id,
      //       section_id : section_id,
      //       department_id : department_id,
      //     }
    
        
      //     console.log("Update Profile data : ", profileUpdate);

      //     let updatedProfile = await targetUser.update(profileUpdate);
      //     let roleUpdate = await userRoleConnector.create({user_id : id, role_id : role_id});

      //     console.log("UpdatedProfile : ", updatedProfile);
      //     console.log("RoleUpdate : ", roleUpdate);

      //     if(updatedProfile && roleUpdate) {

      //       resolve({"status" : 200, "data" : updatedProfile, "message" : "User details fetched successfully"});
      //     }else {
      //       reject({"status" : 404, "message" : "Cannot update"});

      //     }
      //   }else {
      //     reject({"status" : 404, "message" : "Cannot find this user"});
      //   }
    
      // }else {

      //   reject({"status" : 404, "message" : "Requested user profile not found"});
      // }


      //checking if requested user is admin or not
      let decoded = jwt.decode(token);

      let adminUser = await userModel.findOne({where :{id : decoded.user_id} });

      if (adminUser) {
        //checking if user exist
        console.log("Inside if statement.......");
        if (user_id && first_name && last_name  && phone || roles) {
          // Validations
          // data ={
          //   first_name : first_name,
          //   last_name : last_name,
          //   email : email,
          //   phone : phone,
          //   role : role,
          //   department : department,
          //   section : section,
          //   branch : branch
          // }

          // const Validations = await validateCreateUser(data);

          // if (!isValid) {
          //   reject({"status" : 400, "data" : errors, "message" : "Validations failed"});
          // }

          let user = await userModel.findOne({ where: { id: user_id } });
          // decoded = jwt.decode(token);
          // const user_id = decoded.user_id;
          // user_role_id = userRoleConnector.findAll({ where: { user_id: user_id } });

          if (user) {
            //user exist
          
            // let salt = bcrypt.genSaltSync(10);

            // // Generating a random one time password for first time login
            // let chars =
            //   "0123456789abcdefghijklmnopqrstuvwxyzABCDE#F$G@H*I&JKLMNOPQRSTUVWXYZ";
            // let otp = "";
            // for (let i = 0; i <= 7; i++) {
            //   var randomNumber = Math.floor(Math.random() * chars.length);
            //   otp += chars.substring(randomNumber, randomNumber + 1);
            // }

            // let oneTimePassword = bcrypt.hashSync(otp, salt);
            // let password = bcrypt.hashSync(otp + 10101011011, salt);

            //Getting corresponding department id
            // let department_value = await departmentModel.findOne({
            //   attributes: ["id"],
            //   raw: true,
            //   where: { department: department },
            // });
            // let department_id = department_value.id;
            // console.log("Department Id : ", department_id);

            //Getting corresponding section id
            // let section_value = await sectionModel.findOne({
            //   attributes: ["id"],
            //   raw: true,
            //   where: { section: section },
            // });
            // let section_id = section_value.id;
            // console.log("Section Id : ", section_id);

            //Getting corresponding branch id
            // let branch_value = await branchModel.findOne({
            //   attributes: ["id"],
            //   raw: true,
            //   where: { branch: branch },
            // });
            // let branch_id = branch_value.id;
            // console.log("Branch Id : ", branch_id);

            //Initializing user datas
            let updated_user = {
              first_name: first_name,
              last_name: last_name,
              phone: phone,
              isOperator : isOperator,
              isSupervisor : isSupervisor
            };

            //Checking for image
            if (image) {
              image = await fileUpload(image, "users");

              if (image) {
                updated_user["image"] = image;
              } else {
                console.log("Unable to save image");
              }
            }

            //saving
            let update = await user.update(updated_user);
            let updated = await update.save();

            console.log("Updated user : ", update);

            console.log("Updated user id : ", update.id);

            //Saving role
            if (updated) {


              //getting all the roles of the user
              if(roles && roles.length >0) {

              
              let user_roles = await userRoleConnector.findAll({
                where: { user_id: user_id },
                // include: [
                //   {
                //     model: userRoles,
                //     as: "user_role",
                //     attributes: ["role"],
                //     raw: true,
                //   },
                // ],
                raw: true,
                // attributes: ["user_role.role"],
                attributes : ["role_id"]
              });

              let user_role_ids = user_roles.map((e)=> {
                return e.role_id;
              })

              let req_role_ids = roles.map((e)=> {
                return Number(e);
              })


              console.log("User roles..... : ", user_roles);
              console.log("User Role_ids : ", user_role_ids);

              console.log("Role id's from payload : ", req_role_ids);

      

              //Existing roles id's
              const common = user_role_ids.filter(value => req_role_ids.includes(value));
              console.log("Common values:", common);

              //New role id's from req_body or payload
              const newValues = req_role_ids.filter(value => !user_role_ids.includes(value));
              console.log("New values:", newValues); 

              //Missing role id's in req_body or payload which are the currently deleted roles of the user
              const missingValues = user_role_ids.filter(value => !req_role_ids.includes(value));
              // console.log("Missing values", missingValues);

              var data = {};


              if(common && common.length > 0) {
                data.roles_found = "Roles already found"
              }

              //Saving roles to database

              //Deleting removed roles from database
              if(missingValues.length !==0) {
                console.log("Missing Values : ", missingValues);


                let delete_roles = await Promise.all(missingValues.map(async(e)=> {
                  console.log("user_id : ", user_id);
                  console.log("Role_id : ", e);

                  //Finding primary keys from user roles conneciton table to remove the specific roles
                  let remove_role = await userRoleConnector.findAll({where :{ [Op.and]:[{user_id : user_id} , {role_id : e}]}, attributes : ['id'],raw : true});
                  console.log("Remove role ... : ", remove_role);

                  //Removing roles by using primary keys
                  let removed_role = await Promise.all(remove_role.map(async(pk)=> {
                    let deleted = await userRoleConnector.findByPk(pk.id);
                    let role_deleted = deleted.destroy();
                    if(role_deleted) {
                      data.role_deleted = "Roles deleted";
                    }else {
                      data.role_deleted = "No roles deleted"
                    }

                  }))


                }))
                // console.log("deleted roles : ", delete_roles);

              }else {
                console.log("No roles to delete....");
              }



              //Adding new roles to database
              if(newValues.length !==0) {
                console.log("New values : ", newValues);

                let add_roles = await Promise.all(newValues.map(async (e)=> {
                  console.log("User id : ", user_id);
                  console.log("Role id : ", e);

                  //Adding roles to the database
                  let new_role = {
                    user_id : user_id,
                    role_id : e,
                  }
                  let new_role_update = await userRoleConnector.create(new_role);
                  let new_role_updated = await new_role_update.save();

                  if(new_role_updated) {
                    data.role_created = "New roles added";
                  }else {
                    data.role_created = "No roles added";
                  }
                }))
              }

              // console.log("Data : ", data);



            }else {
              console.log("No roles changes to update...");
            }
              resolve({ status: 200,data : data, message: "User update successful" });

            } else {
              reject({ status: 422, message: "User not created" });
            }
          }
          
        } else {
          if (!first_name)
            reject({ status: 422, message: "First Name is required" });
          if (!last_name)
            reject({ status: 422, message: "Last Name is required" });
          if (!phone) reject({ status: 422, message: "Phone is required" });
          if (!role) reject({ status: 422, message: "Role is required" });
          if(!user_id) reject({ status: 422, message: "user_id is required" });
          if (!password)
            reject({ status: 422, message: "Password is required" });
        }
      }else {

        reject({ status: 422, message: "Requested user not found" });

      }



    } catch (error) {

      reject({
        status: 400,
        message: error
          ? error.message
            ? error.message
            : error
          : "Something went wrong",
      });
      
    }


  })



}



exports.addRequestProfile = async function (
  //Create another login for first time login
  token, name, email, image, contact_no, department, section, campus
) {
  return new Promise(async (resolve, reject) => {
    try {
      //checking if requested user is admin or not
      let decoded = jwt.decode(token);

      let adminUser = await userModel.findOne({where : {id : decoded.user_id}});
      console.log(adminUser);

      if (adminUser) {
        console.log("Admin user found...");

        //checking if user exist
        if (
          name &&
          email &&
          contact_no &&
          department &&
          section &&
          campus
        ) {
          // Validations
          // data ={
          //   first_name : first_name,
          //   last_name : last_name,
          //   email : email,
          //   phone : phone,
          //   role : role,
          //   department : department,
          //   section : section,
          //   branch : branch
          // }

          // const Validations = await validateCreateUser(data);

          // if (!isValid) {
          //   reject({"status" : 400, "data" : errors, "message" : "Validations failed"});
          // }

          let user = await requestProfileModel.findOne({ where: { email: email } });
          // decoded = jwt.decode(token);
          // const user_id = decoded.user_id;
          // user_role_id = userRoleConnector.findAll({ where: { user_id: user_id } });

          if (user) {
            //user exist
            reject({ status: 403, message: "User Already Exist" });
          } else {
            // let salt = bcrypt.genSaltSync(10);

            // // Generating a random one time password for first time login
            // let chars =
            //   "0123456789abcdefghijklmnopqrstuvwxyzABCDE#F$G@H*I&JKLMNOPQRSTUVWXYZ";
            // let otp = "";
            // for (let i = 0; i <= 7; i++) {
            //   var randomNumber = Math.floor(Math.random() * chars.length);
            //   otp += chars.substring(randomNumber, randomNumber + 1);
            // }

            // let oneTimePassword = bcrypt.hashSync(otp, salt);
            // let password = bcrypt.hashSync(otp + 10101011011, salt);

            //Getting corresponding department id
            // let department_value = await departmentModel.findOne({
            //   attributes: ["id"],
            //   raw: true,
            //   where: { department: department },
            // });
            // let department_id = department_value.id;
            // console.log("Department Id : ", department_id);

            //Getting corresponding section id
            // let section_value = await sectionModel.findOne({
            //   attributes: ["id"],
            //   raw: true,
            //   where: { section: section },
            // });
            // let section_id = section_value.id;
            // console.log("Section Id : ", section_id);

            //Getting corresponding branch id
            // let branch_value = await branchModel.findOne({
            //   attributes: ["id"],
            //   raw: true,
            //   where: { branch: branch },
            // });
            // let branch_id = branch_value.id;
            // console.log("Branch Id : ", branch_id);
            console.log("Inside else condition");

            // let department_id = (
            //   await departmentModel.findOne({
            //     where: { department: department },
            //   })
            // ).getDataValue("id");
            // console.log("Department_id : ", department_id);

            // let section_id = (
            //   await sectionModel.findOne({ where: { section: section } })
            // ).getDataValue("id");
            // console.log("Section_id : ", section_id);

            // let campus_id = (
            //   await campusModel.findOne({ where: { campus: campus } })
            // ).getDataValue("id");
            // console.log("Campus_id : ", campus_id);

            //Initializing user datas
            let new_user = {
              dev_flag : true,
              name: name,
              image: image,
              email: email,
              contact_no: contact_no,
              department_id: department,
              section_id: section,
              campus_id: campus,
            };

            //Checking for image
            if (image) {
              image = await fileUpload(image, "users");

              if (image) {
                new_user["image"] = image;
              } else {
                console.log("Unable to save image");
              }
            } else {
              new_user["image"] = "No image";
            }

            //saving
            let [newUser, created] = await requestProfileModel.findOrCreate({
              where: { email: email },
              defaults: new_user,
              raw: true,
            });

            console.log("New user : ", newUser);

            console.log("New user id : ", newUser.id);

            //Saving role
            if (created) {
              // let role_id = (await userRoles.findOne({where : {role : role}, attributes : ['id']})).getDataValue('id');
              // let setRoleId = await userRoleConnector.create({user_id : newUser.id, role_id : role_id});

              //Sending email and password

              resolve({
                status: 200,
                data : newUser,
                message: "Request profile created successfully",
              });

              // if(setRoleId) {

              //   let email_template = await set_password_template(
              //     first_name,
              //     email,
              //     otp
              //   );

              // console.log(email_template);
              //   await email_transporter(email, "Update Password", email_template);
              //   resolve({
              //     status: 200,
              //     message: "Login details send to the email address",
              //   });
              // }else {

              //   reject({ status: 422, message: "Cannot add user role" });

              // }
            } else {
              reject({ status: 422, message: "Request profile not created" });
            }
          }
        } else {
          if (!name) reject({ status: 422, message: "Name is required" });
          if (!contact_no)
            reject({ status: 422, message: "Contact_no is required" });
          if (!department)
            reject({ status: 422, message: "Department is required" });
          if (!email) reject({ status: 422, message: "Email is required" });
          if (!section) reject({ status: 422, message: "Section is required" });
          if (!campus) reject({ status: 422, message: "Campus is required" });
        }
      }else {
        reject({ status: 422, message: "Requested user not found" });

      }

     
    } catch (error) {
      reject({
        status: 400,
        message: error
          ? error.message
            ? error.message
            : error
          : "Something went wrong",
      });
    }
  });
};




exports.editRequestProfile = async function (
  //Create another login for first time login
  token,client_id, name, email, image, contact_no, department, section, campus
) {
  return new Promise(async (resolve, reject) => {
    try {
      //checking if requested user is admin or not
      let decoded = jwt.decode(token);

      let adminUser = await userModel.findOne({where : {id : decoded.user_id}});

      if (adminUser) {
        //checking if user exist
        if (
          client_id &&
          name &&
          email &&
          contact_no &&
          department &&
          section &&
          campus
        ) {
          // Validations
          // data ={
          //   first_name : first_name,
          //   last_name : last_name,
          //   email : email,
          //   phone : phone,
          //   role : role,
          //   department : department,
          //   section : section,
          //   branch : branch
          // }

          // const Validations = await validateCreateUser(data);

          // if (!isValid) {
          //   reject({"status" : 400, "data" : errors, "message" : "Validations failed"});
          // }

          let user = await requestProfileModel.findOne({ where: { id: client_id } });

          // decoded = jwt.decode(token);
          // const user_id = decoded.user_id;
          // user_role_id = userRoleConnector.findAll({ where: { user_id: user_id } });
          
          if (user) {
            
            let dev_flag = user.dev_flag;


            // let department_id = (
            //   await departmentModel.findOne({
            //     where: { department: department },
            //   })
            // ).getDataValue("id");
            // console.log("Department_id : ", department_id);
  
            // let section_id = (
            //   await sectionModel.findOne({ where: { section: section } })
            // ).getDataValue("id");
            // console.log("Section_id : ", section_id);
  
            // let campus_id = (
            //   await campusModel.findOne({ where: { campus: campus } })
            // ).getDataValue("id");
            // console.log("Campus_id : ", campus_id);
  
            //Initializing user datas
            let updated_user = {
              dev_flag : true,
              name: name,
              email: email,
              contact_no: contact_no,
              department_id: department,
              section_id: section,
              campus_id: campus,
            };

            // Checking for image
            if(image) {
              image = await fileUpload(image, "users");
  
              if (image) {
                updated_user["image"] = image;
              } else {
                console.log("Unable to save image");
              }
            }

            console.log("Updated user : ", updated_user);

            //saving
            if(dev_flag) {

              let update_user = await user.update(updated_user);
              let savedUpdate = await update_user.save();
    
              console.log("New user : ", update_user);
    
              console.log("New user id : ", update_user.id);
              //Saving role
              if (savedUpdate) {
                // let role_id = (await userRoles.findOne({where : {role : role}, attributes : ['id']})).getDataValue('id');
                // let setRoleId = await userRoleConnector.create({user_id : newUser.id, role_id : role_id});
    
                //Sending email and password
    
                resolve({
                  status: 200,
                  data : update_user,
                  message: "Request profile Updated successfully",
                });

              } else {
                reject({ status: 422, message: "Request profile not Updated" });
              }

              }else {

                reject({ status: 422, message: "Cannot update production datas during testing and development" });


              }
  
  
         
          } else {

            reject({ status: 422, message: "Request profile not found" });

          }
           

          // }
        } else {
          if (!name) reject({ status: 422, message: "Name is required" });
          if (!contact_no)
            reject({ status: 422, message: "Contact_no is required" });
          if (!department)
            reject({ status: 422, message: "Department is required" });
          if (!email) reject({ status: 422, message: "Email is required" });
          if (!section) reject({ status: 422, message: "Section is required" });
          if (!campus) reject({ status: 422, message: "Campus is required" });
        }
      }else {
        reject({ status: 422, message: "Requested user not found" });

      }

     
    } catch (error) {
      reject({
        status: 400,
        message: error
          ? error.message
            ? error.message
            : error
          : "Something went wrong",
      });
    }
  });
};


exports.deleteRole = async function (token, roleId) {
  return new Promise(async (resolve, reject) => {
    try {

      let decoded = jwt.decode(token);

      let user = await userModel.findByPk(decoded.user_id);

      let deleted;

      if (user) {
        let targetRole = await userRoles.findByPk(roleId);


        if(targetRole) {

           deleted = await targetRole.destroy();
        }else {
          reject({ status: 404, message: "No roles found" });

        }


        if(deleted) {

          resolve({ status: 200,data :deleted , message: "Role deleted" });
        }else {
          reject({ status: 404, message: "Role not deleted" });

        }
      } else {
        reject({ status: 404, message: "Requested user not found" });
      }

    } catch (error) {
      reject({
        status: 400,
        message: error
          ? error.message
            ? error.message
            : error
          : "Something went wrong",
      });
    }
  });
};




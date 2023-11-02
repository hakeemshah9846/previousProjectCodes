const { response } = require('express');
const userManager = require('../managers/userManager');
const success_function = require('../utils/response-handler').success_function;
const error_function = require('../utils/response-handler').error_function;
const validateCreateUser = require('../validation/create_user');
const validateForgotPassword = require('../validation/forgot_password');
const validateResetForgottedPassword = require('../validation/reset_forgetted_password');
const validateResetPassword = require('../validation/reset_password');
const validateUpdateProfile = require('../validation/updateProfile');
const validateRequestProfileInput = require('../validation/request_profile');


exports.createUser = function(req, res)
{

  console.log("Request Body : ", req.body);

  const {errors, isValid}=  validateCreateUser(req.body);
  console.log("Errors from controller : ", errors);
  console.log("isValid from controller : ", isValid);


  // if(!isValid){
  //   return res.status(400).json(errors);
  // }

  if(isValid){


    
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let email = req.body.email;
        let image = req.body.image;
        let phone = req.body.phone;
        let roles = req.body.roles;
        // let department = req.body.department;
        // let section = req.body.section;
        // let branch = req.body.branch;
        // let new_user = req.body.new_user;
        let isOperator = req.body.isOperator;
        let operator_id = req.body.operator_id;
        let isSupervisor = req.body.isSupervisor;
        
        const authHeader = req.headers['authorization'];
        const token = authHeader.split(' ')[1];
    
    
    
        userManager.createUser(token,first_name, last_name, email, image, phone, roles,isOperator, operator_id, isSupervisor)
        .then((result)=>{
            let response = success_function(result);
            res.status(result.status).send(response);
        }).catch((error)=>{
            let response = error_function(error);
            res.status(error.status).send(response);
        });
  }
  else{
    res.status(400).send({"status" : 400,"errors" : errors, "message" : "Validation failed"});
  }
}


exports.updateProfile = function (req,res) {
  
  const {errors, isValid} = validateUpdateProfile(req.body);

  if(isValid){
    console.log("Valid information");
    let user_id = req.body.user_id;
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let image = req.body.image;
    let phone = req.body.phone;
    let role = req.body.role;

    let authHeader = req.headers['authorization'];
  let token = authHeader.split(' ')[1];

    userManager
      .updateProfile(first_name, last_name, image, phone, role, token)
      .then((result) => {
        let response = success_function(result);
        res.status(result.status).send(response);
      })
      .catch((error) => {
        let response = error_function(error);
        res.status(error.status).send(response);
      });


  }else {
    res.status(400).send({"status" : 400, "errors" : errors, "message" : "Validation Failed"});
  }
}


exports.deleteProfile = function (req, res) {
  const authHeader = req.headers['authorization'];
  const token = authHeader.split(' ')[1];

  console.log("Token from delete route : ", token);

  let targetId = req.params.target_id;

  userManager.deleteProfile(token, targetId)
    .then((result)=> {
        const response = success_function(result);
        res.status(result.status).send(response);
    })
    .catch((error)=> {
      const response = error_function(error);
      res.status(error.status).send(response);
    })
}


exports.deleteRequestProfile = function (req, res) {
  const authHeader = req.headers['authorization'];
  const token = authHeader.split(' ')[1];

  console.log("Token from delete route : ", token);

  let targetId = req.params.target_id;

  userManager.deleteRequestProfile(token, targetId)
    .then((result)=> {
        const response = success_function(result);
        res.status(result.status).send(response);
    })
    .catch((error)=> {
      const response = error_function(error);
      res.status(error.status).send(response);
    })
}

exports.forgotPasswordController = function(req, res)
    {
      
      //Enter email and user recieves en email with a link to reset the forgotted password, the link also contains a jwt token which also must be passed to the backend through reset_forgotted_password controller

      let {errors, isValid} = validateForgotPassword(req.body);
        let email = req.body.email;
    
        if(isValid){

          userManager.forgotPassword(email)
          .then((result)=>{
              let response = success_function(result)
              res.status(result.status).send(response);
          }).catch((error)=>{
              let response = error_function(error)
              res.status(error.status).send(response);
          });

        }else{
          res.status(200).send({"status" : 200, "errors" : errors, "message" : "Validation failed"});
        }
    }


    exports.resetPasswordController = function(req, res)
{
  //For login users just to reset the password

  const {errors, isValid} = validateResetPassword(req.body);

  if(isValid){

    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];
  
    let old_password = req.body.old_password; //Random password or otp send through email if first user
    let new_password = req.body.new_password;
    let confirm_new_password = req.body.confirm_new_password;
  
    userManager.passwordReset(token, old_password, new_password, confirm_new_password)
    .then((result)=>{
        let response = success_function(result);
        res.status(result.status).send(response);
    }).catch((error)=>{
        let response = error_function(error);
        res.status(error.status).send(response);
    });

  }else{

    res.status(400).send({"status" : 400, "errors" : errors, "message" : "Validation Failed"});
  }

}


exports.resetForgettedPassword = function(req, res)
{

  //Works after forgot_password controller, requires token and new password through the link send through email to the user

  const {errors, isValid} = validateResetForgottedPassword(req.body);

  if(isValid){

    let token = req.body.token;
    let new_password = req.body.new_password;
    let confirm_new_password = req.body.confirm_new_password;

    userManager.resetForgettedPassword(token, new_password,confirm_new_password)
    .then((result)=>{
        let response = success_function(result);
        res.status(result.status).send(response);
    }).catch((error)=>{
        let response = error_function(error);
        res.status(error.status).send(response);
    });

  }else {
    res.status(400).send({"status" : 400, "errors" : errors, "message" : "Validation failed"});
  }
}


exports.fetchAllProfiles = function (req,res){

  console.log("Fetch all controller reached..");

    const authHeader = req.headers['authorization'];
    const token = authHeader ? authHeader.split(' ')[1] : null;

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const keyword = req.query.keyword;


    userManager
      .fetchAllProfiles(token, page, pageSize,keyword)
      .then((result) => {
        let response = success_function(result);
        response.meta = result.meta;
        res.status(result.status).send(response);
      })
      .catch((error) => {
        let response = error_function(error);
        res.status(error.status).send(response);
      });


}


exports.fetchSingleProfile = function (req,res){

    const authHeader = req.headers['authorization'];
    const token = authHeader ? authHeader.split(' ')[1] : null;

    userManager
      .fetchSingleProfile(token)
      .then((result) => {
        let response = success_function(result);
        res.status(result.status).send(response);
      })
      .catch((error) => {
        let response = error_function(error);
        res.status(error.status).send(response);
      });


}

exports.fetchAllDepartments = function (req,res){

    const authHeader = req.headers['authorization'];
    const token = authHeader ? authHeader.split(' ')[1] : null;

    userManager
      .fetchAllDepartments(token)
      .then((result) => {
        let response = success_function(result);
        res.status(result.status).send(response);
      })
      .catch((error) => {
        let response = error_function(error);
        res.status(error.status).send(response);
      });


}


exports.fetchAllSections = function (req,res){

    const authHeader = req.headers['authorization'];
    const token = authHeader ? authHeader.split(' ')[1] : null;

    userManager
      .fetchAllSections(token)
      .then((result) => {
        let response = success_function(result);
        res.status(result.status).send(response);
      })
      .catch((error) => {
        let response = error_function(error);
        res.status(error.status).send(response);
      });


}


exports.fetchAllBranches = function (req,res){

    const authHeader = req.headers['authorization'];
    const token = authHeader ? authHeader.split(' ')[1] : null;

    userManager
      .fetchAllBranches(token)
      .then((result) => {
        let response = success_function(result);
        res.status(result.status).send(response);
      })
      .catch((error) => {
        let response = error_function(error);
        res.status(error.status).send(response);
      });


}


exports.fetchAllRoles = function (req, res) {

  const authHeader = req.headers['authorization'];
  const token = authHeader.split(' ')[1];

  userManager.fetchAllRoles(token)
    .then((result)=> {
      const response = success_function(result);
      res.status(result.status).send(response);
    })
    .catch((error) =>{
      const response = error_function(error);
      res.status(error.status).send(response);
    })

}

exports.addRoles = function (req, res) {

  const authHeader = req.headers['authorization'];
  const token = authHeader.split(' ')[1];

  // let user_id = req.body.user_id;
  let role = req.body.role;

  userManager.addRoles(token, role)
    .then((result)=> {
      const response = success_function(result);
      res.status(result.status).send(response);
    })
    .catch((error) =>{
      const response = error_function(error);
      res.status(error.status).send(response);
    })

}

exports.fetchSingleUserDetails = function (req, res) {

  const authHeader = req.headers['authorization'];
  const token = authHeader.split(' ')[1];

  const id = req.params.id;

  userManager.fetchSingleUserDetails(token, id)
    .then((result)=> {
      const response = success_function(result);
      res.status(result.status).send(response);
    })
    .catch((error) =>{
      const response = error_function(error);
      res.status(error.status).send(response);
    })

}


exports.updateSingleUserDetails = function (req, res) {

  const authHeader = req.headers['authorization'];
  const token = authHeader.split(' ')[1];

  // const id = req.params.id;
  // const role = req.body.role;
  // const department = req.body.department;
  // const branch = req.body.branch;
  // const section = req.body.section;

  let user_id = req.body.user_id;
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let image = req.body.image;
    let phone = req.body.phone;
    let roles = req.body.roles;
    let isOperator = req.body.isOperator;
    let operator_id = req.body.operator_id;
    let isSupervisor = req.body.isSupervisor;



  userManager.updateSingleUserDetails(token, user_id, first_name, last_name, image, phone, roles,isOperator, operator_id, isSupervisor)
    .then((result)=> {
      const response = success_function(result);
      res.status(result.status).send(response);
    })
    .catch((error) =>{
      const response = error_function(error);
      res.status(error.status).send(response);
    })

}



exports.addRequestProfile = function(req, res)
{

  console.log("Request Body : ", req.body);

  const {errors, isValid}=  validateRequestProfileInput(req.body);
  console.log("Errors from controller : ", errors);
  console.log("isValid from controller : ", isValid);


  // if(!isValid){
  //   return res.status(400).json(errors);
  // }

  if(isValid){


    
        let name = req.body.name;
        let email = req.body.email;
        let image = req.body.image;
        let contact_no = req.body.contact_no;
        // let role = req.body.role;
        let department = req.body.department;
        let section = req.body.section;
        let campus = req.body.campus;
        // let new_user = req.body.new_user;
        
        const authHeader = req.headers['authorization'];
        const token = authHeader.split(' ')[1];
    
    
    
        userManager.addRequestProfile(token, name, email, image, contact_no, department, section, campus)
        .then((result)=>{
            let response = success_function(result);
            res.status(result.status).send(response);
        }).catch((error)=>{
            let response = error_function(error);
            res.status(error.status).send(response);
        });
  }
  else{
    res.status(400).send({"status" : 400,"errors" : errors, "message" : "Validation failed"});
  }
}




exports.editRequestProfile = function(req, res)
{

  console.log("Request Body : ", req.body);

  const {errors, isValid}=  validateRequestProfileInput(req.body);
  console.log("Errors from controller : ", errors);
  console.log("isValid from controller : ", isValid);


  // if(!isValid){
  //   return res.status(400).json(errors);
  // }

  if(isValid){


    
         let client_id = req.body.client_id
        let name = req.body.name;
        let email = req.body.email;
        let image = req.body.image;
        let contact_no = req.body.contact_no;
        // let role = req.body.role;
        let department = req.body.department;
        let section = req.body.section;
        let campus = req.body.campus;
        // let new_user = req.body.new_user;
        
        const authHeader = req.headers['authorization'];
        const token = authHeader.split(' ')[1];
    
    
    
        userManager.editRequestProfile(token,client_id, name, email, image, contact_no, department, section, campus)
        .then((result)=>{
            let response = success_function(result);
            res.status(result.status).send(response);
        }).catch((error)=>{
            let response = error_function(error);
            res.status(error.status).send(response);
        });
  }
  else{
    res.status(400).send({"status" : 400,"errors" : errors, "message" : "Validation failed"});
  }
}



exports.deleteRole = function (req, res) {
  const authHeader = req.headers['authorization'];
  const token = authHeader.split(' ')[1];

  console.log("Token from delete route : ", token);

  let roleId = req.params.role_id;

  userManager.deleteRole(token, roleId)
    .then((result)=> {
        const response = success_function(result);
        res.status(result.status).send(response);
    })
    .catch((error)=> {
      const response = error_function(error);
      res.status(error.status).send(response);
    })
}




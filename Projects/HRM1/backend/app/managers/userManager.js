const addUserValidator = require("../validations/add-user-validation");
const editUserValidator = require("../validations/edit-user-validation");
const success_function = require("../utils/response-handler").success_function;
const error_function = require("../utils/response-handler").error_function;
const users = require("../db/models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dayjs = require("dayjs");
const organizations = require("../db/models/organizations");
const axios = require("axios");
const fileUpload = require("../utils/file-upload").fileUpload;
const set_password_template =
  require("../utils/email-templates/set-password").resetPassword;
const sendEmail = require("../utils/send-email").sendEmail;
const resetPassword =
  require("../utils/email-templates/resetPassword").resetPassword;

exports.checkValid = async function (req) {
  return new Promise(async (resolve, reject) => {
    try {
      //If it is from user edit then user_id will be passed in params, if is from organization edit then user_id will be passed from req.body
      if (req.params.user_id || req.body.user_id) {
        //console.log("Edit user validation");

        const { errors, isValid } = await editUserValidator(req);
        resolve({ errors, isValid });
        return;
      } else {
        //console.log("Create user validation");

        const { errors, isValid } = await addUserValidator(req.body);
        resolve({ errors, isValid });
        return;
      }
    } catch (error) {
      if (process.env.NODE_ENV == "production")
        reject({
          status: 400,
          message: error
            ? error.message
              ? error.message
              : error
            : "Something went wrong",
        });
      else reject({ status: 400, message: error });
    }
  });
};

exports.createUser = async function (req) {
  return new Promise(async (resolve, reject) => {
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader ? authHeader.split(" ")[1] : null;
      let decoded = jwt.decode(token);

      // if (isValid) {
      const organization_user_flag = req.body.organization_user_flag;
      let user_type;
      let organization;

      const employment_information_flag = req.body.employment_information_flag;
      const personel_information_flag = req.body.personel_information_flag;
      const address_flag = req.body.address_flag;
      const bank_details_flag = req.body.bank_details_flag;
      const salary_details_flag = req.body.salary_details_flag;
      const skills_flag = req.body.skills_flag;

      let image = req.body.image;

      let user_details = {};

      if (organization_user_flag === "true") {
        //To add user with user_type organization, if this flag is true then admin is creating a new organization with a user, so the usr_type will be organization
        user_type = "645e34807483b6558146f844";
        user_details["user_type"] = user_type;
        
      } else {
        //Check if the login user is admin or not
        let user = await users
          .findOne({ _id: decoded.user_id })
          .populate("user_type");
        let user_type = user.user_type.user_type;
        let organization_id = user.organization;

        //If login user not an admin, set organization as same that of the login user
        if (user_type !== "admin") {
          if (!organization_id) {
            let response = error_function({
              status: 404,
              message: "Organization not found",
            });
            res.status(response.statusCode).send(response);
          }

          organization = organization_id;
        } else {
          //If login user is admin then set set organization form req body
          //console.log("User is admin : From create user.....");
          // organization = req.body.organization;

          // if (!req.body.organization) {
          //   let response = error_function({
          //     status: 404,
          //     message: "Organization id is required",
          //   });
          //   // res.status(response.statusCode).send(response);
          //   reject({"status" : response.statusCode, "message" : response.message});
          //   return;
          // }
          console.log("Login user is admin, creating organizations...");
        }
        user_details.organization = organization;

        //Setting user type
        // user_type = req.body.user_type_id;
        user_type = "645e34977483b6558146f846";
        user_details.user_type = user_type;
      }

      if (employment_information_flag === "true") {
        var first_name = req.body.first_name;
        var last_name = req.body.last_name;
        const employee_id = req.body.employee_id;
        const job_title = req.body.job_title;
        const department_id = req.body.department_id;
        var official_email = req.body.official_email;
        const employee_type_id = req.body.employee_type_id;
        const date_of_join = req.body.date_of_join;
        const profile_status = req.body.profile_status;

        user_details["personel_details.first_name"] = first_name;
        user_details["personel_details.last_name"] = last_name;

        if (organization_user_flag !== "true") {
          if (employee_id) {
            user_details["official_details.employee_id"] = employee_id;
          }

          user_details["official_details.job_title"] = job_title;
          if (department_id) {
            user_details["official_details.department"] = department_id;
          }

          if (employee_type_id) {
            user_details["official_details.employee_type"] = employee_type_id;
          }

          user_details["official_details.date_of_join"] = date_of_join;
          user_details["official_details.profile_status"] = profile_status;
        }

        console.log("Official_email : ", official_email);
        user_details["official_details.official_email"] = official_email;

        //Generating random uniue number for admin employee id
        function generateRandomNumber(length) {
          var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
          var password = "";
        
          for (var i = 0; i < length; i++) {
            var randomIndex = Math.floor(Math.random() * charset.length);
            password += charset.charAt(randomIndex);
          }
        
          return password;
        }
        
        var numberLength = 10; // Set the desired password length here
        var randomNumber = generateRandomNumber(numberLength);
        console.log(randomNumber);
        
        if(organization_user_flag == "true") {

          user_details["official_details.employee_id"] = randomNumber.toString();
        }

        //Saving email for login, official email is used to login
        user_details["email"] = official_email;

        //Generating random password for new user
        function generateRandomPassword(length) {
          let charset =
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$";
          let password = "";

          for (var i = 0; i < length; i++) {
            var randomIndex = Math.floor(Math.random() * charset.length);
            password += charset.charAt(randomIndex);
          }

          return password;
        }

        var randomPassword = generateRandomPassword(12);
        //console.log(randomPassword);

        let salt = bcrypt.genSaltSync(10);
        let password = bcrypt.hashSync(randomPassword, salt);

        user_details["password"] = password;
      } else {
        reject({
          status: 422,
          message: "Employment information is required",
        });
        return;
      }

      //console.log("personel_information_flag : ", personel_information_flag);
      if (personel_information_flag === "true") {
        const phone = req.body.phone;
        const personel_email = req.body.personel_email;
        const emergency_contact = req.body.emergency_contact;
        const blood_group = req.body.blood_group;
        const dob = req.body.dob;
        const gender = req.body.gender;
        const pan = req.body.pan;

        if (phone) {
          user_details["personel_details.phone"] = phone;
        }

        user_details["personel_details.personel_email"] = personel_email;

        if (emergency_contact) {
          user_details["personel_details.emergency_contact"] =
            emergency_contact;
        }

        if (blood_group) {
          user_details["personel_details.blood_group"] = blood_group;
        }

        user_details["personel_details.dob"] = dob;
        user_details["personel_details.gender"] = gender;
        user_details["personel_details.pan"] = pan;
      } else {
        reject({
          status: 422,
          message: "Personel information is required",
        });
        return;
      }

      //console.log("address_flag : ", address_flag);
      if (address_flag === "true") {
        const permanent_address = req.body.permanent_address;
        const permanent_country = req.body.permanent_country;
        const permanent_state = req.body.permanent_state;
        const permanent_pincode = req.body.permanent_pincode;

        const current_address = req.body.current_address;
        const current_country = req.body.current_country;
        const current_state = req.body.current_state;
        const current_pincode = req.body.current_pincode;

        user_details["contact_details.current_address.address"] =
          current_address;
        user_details["contact_details.current_address.country"] =
          current_country;

        if (current_state) {
          user_details["contact_details.current_address.state"] = current_state;
        }

        if (current_pincode) {
          user_details["contact_details.current_address.pincode"] =
            current_pincode;
        }

        user_details["contact_details.permanent_address.address"] =
          permanent_address;
        user_details["contact_details.permanent_address.country"] =
          permanent_country;

        if (permanent_state) {
          user_details["contact_details.permanent_address.state"] =
            permanent_state;
        }

        if (permanent_pincode) {
          user_details["contact_details.permanent_address.pincode"] =
            permanent_pincode;
        }
      }

      //console.log("bank_details_flag : ", bank_details_flag);
      if (bank_details_flag === "true") {
        const account_details = req.body.account_details;

        user_details["account_details"] = account_details;
      }

      //console.log("salary_details_flag : ", salary_details_flag);
      if (salary_details_flag === "true") {
        const salary = req.body.salary;

        user_details["salary"] = salary;
      }

      //console.log("skills_flag : ", skills_flag);
      if (skills_flag === "true") {
        const skills = req.body.skills;

        user_details["skills"] = skills;
      }

      if (image && image != "removed") {
        image = await fileUpload(image, "users");
        user_details["personel_details.image"] = image;
      } else if (image == "removed") {
        user_details["personel_details.image"] = null;
      }

      //console.log("User details : ", user_details);

      let new_user;
      let saved;

      //Checking for enabled external services
      //If user creation not takes place as a part of creating organizations
      if(organization_user_flag !== "true") {

        console.log("User creation not as a part of creating organizations...");

        function convertObjectValuesToString(obj) {
          // Iterate over each property in the object
          for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
              // Convert the value to a string
              obj[prop] = String(obj[prop]);
            }
          }
        }

        let organization_details = await organizations.findOne({
          $and: [{ _id: organization }, { deleted: { $ne: true } }],
        });
        let external_services;
        // let service_ids = [];
        let zoho_flag;
        let zoho_obj= {};


        if (organization_details) {
          external_services = organization_details.external_services;
  
          external_services.map((e) => {
            let service_id = (e.service_id).toString();

            if(service_id === "64a3e8efaf6c697ec74d632b") {
              zoho_flag = true;
              zoho_obj.client_id = e.client_id;
              zoho_obj.client_secret = e.client_secret;
              zoho_obj.redirect_uri = e.redirect_uri;
            }
            // service_ids.push(service_id);
            
          });

        } else {
          let response = error_function({
            status: 400,
            message: "Organization details not found",
          });
          // res.status(response.statusCode).send(response);
          reject({"status" : response.statusCode, "message" : response.message});
        }
  
        console.log("External services", external_services);
        // console.log("Service ids : ", service_ids);
  
        //Checking if zoho service enabled or not in this organization
        // if (service_ids.includes("64a3e8efaf6c697ec74d632b")) {
          if(zoho_flag) {
          console.log("Zoho enabled...");

          // let client_id = zoho_obj.client_id;
          let client_id = "1000.UUK8YFOIG0BOHX0TMI3NHMDJD28SRI";
          // let client_secret = zoho_obj.client_secret;
          let client_secret = "01dd2a184d67c05266dcb635a65b3505b863671245";
          // let redirect_uri = zoho_obj.redirect_uri;
          let redirect_uri = 'http://localhost:5000/auth/zoho/account/create/callback/649bd1298611e269447532ff';//Redirect uri user for creating account

          //Get zoho refresh token and authorization code from organization
          // let zoho_auth_code = organization_details.zoho_auth_code;
          // let zoid = organization_details.zoho_zoid;
          let zoid = "60021942142";
          // let zoho_account_refresh_token = organization_details.zoho_account_refresh_token;
          let zoho_account_refresh_token = "1000.0545f41ff8c8d5a06ccc0fb6e808dd79.3a94fdc0e6fa5ff9c3fd2460787f30c5";
          // console.log("zoho_auth_code", zoho_auth_code);
          console.log("zoho_refresh_token", zoho_account_refresh_token);
          console.log("zoid", zoid);


          //Getting access_token using refresh_token for creating account

          console.log("Access token url : ", `https://accounts.zoho.in/oauth/v2/token?refresh_token=${zoho_account_refresh_token}&client_secret=${client_secret}&client_id=${client_id}&redirect_uri=${redirect_uri}&grant_type=refresh_token&scope=ZohoMail.organization.accounts.CREATE`);

          const response = await axios.post(
            `https://accounts.zoho.in/oauth/v2/token?refresh_token=${zoho_account_refresh_token}&client_secret=${client_secret}&client_id=${client_id}&redirect_uri=${redirect_uri}&grant_type=refresh_token&scope=ZohoMail.organization.accounts.CREATE`
          );
          const accessToken = response.data.access_token;
          // const refreshToken = response.data.refresh_token;

          console.log("AccessToken : ", accessToken);

          function generateUniqueNumber() {
            const randomNumber = Math.floor(Math.random() * 1000); // Generate random number between 0 and 999
            
            return randomNumber.toString().padStart(3, '0'); // Convert to string and pad with leading zeros if necessary
          }
          
          // Example usage
          const uniqueNumber = generateUniqueNumber();
          console.log(uniqueNumber);
          

          var email_name = first_name + last_name + uniqueNumber + "@pprplane.com";
          var password = `${first_name}${last_name}@${uniqueNumber}`;
          console.log("Email name : ", email_name);
          console.log("Password : ", password);

          //Creating account using access token 
            //Using this access token for getting zoid

    let account_response = await axios.post(
      `https://mail.zoho.in/api/organization/60021942142/accounts`,
      {
        role: "member",
        primaryEmailAddress: `${email_name}`,
        timeZone: "Asia/Kolkata",
        language: "En",
        displayName: `${first_name} + ${last_name}`,
        password: password,
        country: "in",
        //    "groupMailList": ["newgroupmail@mybizemail.com","newgroup@mybizemail.com"]
      },
      {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    console.log("Zoho response : ", account_response);
          // Obtain access token
          async function getAccessToken() {
            //redirect_uri = https://localhost:5000/token
            //home_page_uri = localhost:5000/home

            //Get these details from organization user at the time of enabling an external service itself
            const clientId = "1000.UUK8YFOIG0BOHX0TMI3NHMDJD28SRI";
            const clientSecret = "01dd2a184d67c05266dcb635a65b3505b863671245";
            const refreshToken = "1000.0545f41ff8c8d5a06ccc0fb6e808dd79.3a94fdc0e6fa5ff9c3fd2460787f30c5";

            const response = await axios.post(
              "https://accounts.zoho.com/oauth/v2/token",
              {
                grant_type: "refresh_token",
                client_id: clientId,
                client_secret: clientSecret,
                refresh_token: refreshToken,
              }
            );

            return response.data.access_token;
          }
        }

      }else {
        console.log("User creation by an organization user_type user");
      }

      console.log("user details payload : ", user_details);
      
      new_user = new users(user_details);
      saved = await new_user.save();

      //Saving user details
      if (saved) {
        console.log("REAched here ...");
        //Checking if employment information is filled or not , if filled send email in official email address
        let message = "User details saved successfully";

        if (employment_information_flag === "true") {
          let email_template = await set_password_template(
            first_name,
            official_email,
            randomPassword
          );

          await sendEmail(official_email, "Update Password", email_template);

          message = message + " and login details send to official email";
        }

        // let response = success_function({ status: 201, message: message });
        // res.status(response.statusCode).send(response);
        resolve({ status: 201, message: message, _id: new_user._id, zoho_email : email_name + '@pprplane.com', zoho_password : password});
        return;
      } else {
        // let response = error_function({
        //   status: 422,
        //   message: "User details not saved",
        // });

        // res.status(response.statusCode).send(response);
        reject({
          status: 422,
          message: "User details not saved",
        });
        return;
      }
      // } else {
      //   // let response = error_function({
      //   //   status: 422,
      //   //   message: "Validatioin failed",
      //   // });
      //   // res
      //   //   .status(response.statusCode)
      //   //   .send({ errors: errors, message: "Validatioin failed" });
      //   reject({
      //     status: 422,
      //     errors : errors,
      //     message: "Validatioin failed",
      //   })
      //   return;
      // }
    } catch (error) {
      // console.log("Error : ", error);
      if (process.env.NODE_ENV == "production")
        reject({
          status: 400,
          message: error
            ? error.message
              ? error.message
              : error
            : "Something went wrong",
        });
      else reject({ status: 400, message: error });
    }
  });
};

exports.editUser = async function (req) {
  return new Promise(async (resolve, reject) => {
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader ? authHeader.split(" ")[1] : null;
      let decoded = jwt.decode(token);

      let user_id;
      //If user edit is along with organizations edit then user_id comes with body, else user_id comes with req params
      if (req.params.user_id) {
        user_id = req.params.user_id;
      } else if (req.body.user_id) {
        user_id = req.body.user_id;
      }

      //console.log("User id : ", user_id);

      const organization_user_flag = req.body.organization_user_flag;
      let user_type;
      let organization;

      const employment_information_flag = req.body.employment_information_flag;
      const personel_information_flag = req.body.personel_information_flag;
      const address_flag = req.body.address_flag;
      const bank_details_flag = req.body.bank_details_flag;
      const salary_details_flag = req.body.salary_details_flag;
      const skills_flag = req.body.skills_flag;

      let image = req.body.image;

      let user_details = {};

      if (req.body.organization_user_flag === "true") {
        user_type = "645e34807483b6558146f844";
        user_details["user_type"] = user_type;
      } else {
        //console.log("Reached user id in else block....");
        //Check if the login user is admin or not

        let user = await users
          .findOne({ _id: decoded.user_id })
          .populate("user_type");
        let user_type = user.user_type.user_type;
        let organization_id = user.organization;

        //If login user not an admin, set organization as same that of the login user
        if (user_type !== "admin") {
          organization = organization_id;
        } else {
          
          organization = req.body.organization;

          if (!req.body.organization) {
            let response = error_function({
              status: 404,
              message: "Organization id is required",
            });
            res.status(response.statusCode).send(response);
            return;
          }
        }
        user_details.organization = organization;

        //Setting user type
        // user_type = req.body.user_type_id;
        user_type = "645e34977483b6558146f846";
        user_details.user_type = user_type;
      }

      if (employment_information_flag === "true") {
        var first_name = req.body.first_name;
        const last_name = req.body.last_name;
        const employee_id = req.body.employee_id;
        const job_title = req.body.job_title;
        const department_id = req.body.department_id;
        var official_email = req.body.official_email;
        const employee_type_id = req.body.employee_type_id;
        const date_of_join = req.body.date_of_join;
        const profile_status = req.body.profile_status;

        user_details["personel_details.first_name"] = first_name;
        user_details["personel_details.last_name"] = last_name;

        //For an organization user type these datas are not required since not an employee
        if (organization_user_flag !== "true") {
          if (employee_id) {
            user_details["official_details.employee_id"] = employee_id;
          }

          user_details["official_details.job_title"] = job_title;
          user_details["official_details.department"] = department_id;
          user_details["official_details.employee_type"] = employee_type_id;
          user_details["official_details.date_of_join"] = date_of_join;
          user_details["official_details.profile_status"] = profile_status;
        }

        //Saving email for login, official email is used to login, if official email changed reset password and send email after saving
        var official_email_changed;
        if (official_email) {
          official_email_changed = "true";

          user_details["official_details.official_email"] = official_email;
          user_details["email"] = official_email;

          //Generating random password for new user
          function generateRandomPassword(length) {
            let charset =
              "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$";
            let password = "";

            for (var i = 0; i < length; i++) {
              var randomIndex = Math.floor(Math.random() * charset.length);
              password += charset.charAt(randomIndex);
            }

            return password;
          }

          var randomPassword = generateRandomPassword(12);
          //console.log(randomPassword);

          let salt = bcrypt.genSaltSync(10);
          let password = bcrypt.hashSync(randomPassword, salt);

          user_details["password"] = password;
        } else {
          official_email_changed = "false";
        }
      }

      //console.log("personel_information_flag : ", personel_information_flag);
      if (personel_information_flag === "true") {
        const phone = req.body.phone;
        const personel_email = req.body.personel_email;
        const emergency_contact = req.body.emergency_contact;
        const blood_group = req.body.blood_group;
        const dob = req.body.dob;
        const gender = req.body.gender;
        const pan = req.body.pan;

        user_details["personel_details.phone"] = phone;
        user_details["personel_details.emergency_contact"] = emergency_contact;
        user_details["personel_details.blood_group"] = blood_group;
        user_details["personel_details.dob"] = dob;
        user_details["personel_details.gender"] = gender;
        user_details["personel_details.pan"] = pan;

        if (personel_email) {
          user_details["personel_details.personel_email"] = personel_email;
        }
      }

      //console.log("address_flag : ", address_flag);
      if (address_flag === "true") {
        const permanent_address = req.body.permanent_address;
        const permanent_country = req.body.permanent_country;
        const permanent_state = req.body.permanent_state;
        const permanent_pincode = req.body.permanent_pincode;

        const current_address = req.body.current_address;
        const current_country = req.body.current_country;
        const current_state = req.body.current_state;
        const current_pincode = req.body.current_pincode;

        user_details["contact_details.current_address.address"] =
          current_address;
        user_details["contact_details.current_address.country"] =
          current_country;
        user_details["contact_details.current_address.state"] = current_state;
        user_details["contact_details.current_address.pincode"] =
          current_pincode;

        user_details["contact_details.permanent_address.address"] =
          permanent_address;
        user_details["contact_details.permanent_address.country"] =
          permanent_country;
        user_details["contact_details.permanent_address.state"] =
          permanent_state;
        user_details["contact_details.permanent_address.pincode"] =
          permanent_pincode;
      }

      //console.log("bank_details_flag : ", bank_details_flag);
      if (bank_details_flag === "true") {
        const account_details = req.body.account_details;

        user_details["account_details"] = account_details;
      }

      //console.log("salary_details_flag : ", salary_details_flag);
      if (salary_details_flag === "true") {
        const salary = req.body.salary;

        user_details["salary"] = salary;
      }

      //console.log("skills_flag : ", skills_flag);
      if (skills_flag === "true") {
        const skills = req.body.skills;

        user_details["skills"] = skills;
      }

      if (image && image != "removed") {
        image = await fileUpload(image, "users");
        user_details["personel_details.image"] = image;
      } else if (image == "removed") {
        user_details["personel_details.image"] = null;
      }

      console.log("User details : ", user_details);

      console.log("Reached Here...End of edit");
      //Updating the user
      //console.log("user type : ", user_type);
      //console.log("User id : ", user_id);
      let updated = await users.updateOne(
        { _id: user_id },
        { $set: user_details },
        {
          new: true,
        }
      );
      //console.log("here");

      let message = "User updated successfully";
      //console.log("here");
      if (updated) {
        //Checking if official_email changed or not, if changed then reset password and sent mail new login details
        if (official_email_changed === "true") {
          let email_template = await set_password_template(
            first_name,
            official_email,
            randomPassword
          );

          // await sendEmail(official_email, "Update Password", email_template);

          message = message + " and login details send to new official email";
        }

        // let response = success_function({
        //   status: 200,
        //console.log("Inside updated...")
        //   message: message,
        // });

        // res.status(response.statusCode).send(response);
        return resolve({ status: 200, message: message });
      } else {
        // let response = success_function({
        //   status: 200,
        //   message: "User not updated",
        // });

        // res.status(response.statusCode).send(response);
        reject({ status: 400, message: "User not updated" });
        return;
      }
    } catch (error) {
      if (process.env.NODE_ENV == "production")
        reject({
          status: 400,
          message: error
            ? error.message
              ? error.message
              : error
            : "Something went wrong",
        });
      else reject({ status: 400, message: error });
    }
  });
};

const success_function = require("../utils/response-handler").success_function;
const error_function = require("../utils/response-handler").error_function;
const users = require("../db/models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dayjs = require("dayjs");
const fileUpload = require("../utils/file-upload").fileUpload;
const set_password_template =
  require("../utils/email-templates/set-password").resetPassword;
const sendEmail = require("../utils/send-email").sendEmail;
const resetPassword =
  require("../utils/email-templates/resetPassword").resetPassword;
const editUserValidator = require("../validations/edit-user-validation");
const departmentsModel = require("../db/models/departments");
const employeeTypesModel = require("../db/models/employee_types");
const salary_history_model = require("../db/models/salary_history");
const user_model = require("../db/models/users");
const user_types_model = require("../db/models/user_types");
const revoked_tokens = require("../db/models/revoked_tokens");
const employee_types = require("../db/models/employee_types");
const departments = require("../db/models/departments");
const skills = require("../db/models/skills");
let userManager = require("../managers/userManager");
const mongoose_delete = require("mongoose-delete");
const mongoose = require("mongoose");
const organizations = require("../db/models/organizations");

exports.fetchAll = async function (req, res) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader ? authHeader.split(" ")[1] : null;

    if (!token) {
      let response = error_function({
        status: 400,
        message: "Token is required",
      });
      res.status(response.statusCode).send(response);
      return;
    }

    let decoded = jwt.decode(token);

    let count = Number(await users.count());
    //console.log("Count : ", count);

    const pageNumber = req.query.page || 1;
    const pageSize = req.query.pageSize || count;

    let keyword = req.query.keyword;

    let department_id = req.query.department_id;

    let filters = [];

    if (keyword) {
      filters.push({
        $or: [
          { "personel_details.first_name": { $regex: keyword, $options: "i" } },
          { "personel_details.last_name": { $regex: keyword, $options: "i" } },
          {
            "official_details.department.department": {
              $regex: keyword,
              $options: "i",
            },
          },
          { "official_details.job_title": { $regex: keyword, $options: "i" } },
        ],
      });
    }

    if (department_id) {
      filters.push({ "official_details.department": department_id });
    }
    //Getting organization_id and user_type of the login user
    let user = await users
      .findOne({ _id: decoded.user_id })
      .populate("user_type");
    let user_type = user.user_type.user_type;
    let organization_id = user.organization;

    //console.log("Login user : ", user);
    //console.log("User Type : ", user_type);
    //console.log("Organization id : ", organization_id);

    //If user type not equals admin, then find users of that particular organizaton only, add organization_id to filters if user is not admin
    if (user_type !== "admin") {
      filters.push({ organization: organization_id });
      //adding user_type employee_id to the filter to filter out only employees
      filters.push({
        user_type: new mongoose.Types.ObjectId("645e34977483b6558146f846"),
      });
    } else {
      //console.log("User is admin");
    }

    //For eliminating login user
    filters.push({
      _id: { $ne: new mongoose.Types.ObjectId(decoded.user_id) },
    });
    //For eliminating deleted user
    filters.push({ deleted: { $ne: true } });

    //console.log("Filters : ", filters);
    let users_data = await users
      .find(filters.length > 0 ? { $and: filters } : null)
      .sort({_id : -1})
      .populate("official_details.department", "department")
      .populate("official_details.employee_type", "employee_type -_id")
      .populate("official_details.profile_status", "profile_status -_id")
      .populate("user_type", "user_type -_id")
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize);

    if (users_data) {
      let count = await users.count(
        filters.length > 0 ? { $and: filters } : null
      );
      let total_pages = Math.ceil(count / pageSize);
      let data = {
        count: count,
        totalPages: total_pages,
        currentPage: pageNumber,
        datas: users_data,
      };

      let response = success_function({
        status: 200,
        data: data,
        message: "Users fetched successfully",
      });

      res.status(response.statusCode).send(response);
      return;
    } else {
      let response = error_function({
        status: 404,
        message: "User data not found",
      });
      res.status(response.statusCode).send(response);
      return;
    }
  } catch (error) {
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
};

exports.fetchOne = async function (req, res) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader ? authHeader.split(" ")[1] : null;

    let id = req.params.id;

    if (token && id) {
      let users_data = await users
        .findOne({ _id: id })
        .populate("official_details.department", "department _id")
        .populate("official_details.employee_type", "employee_type _id")
        .populate("official_details.profile_status", "profile_status -_id")
        .populate("user_type", "user_type -_id")
        .populate("skills", "_id skill")
        .populate("documents.document_type","_id document_type document");

      if (users_data) {
        let response = success_function({
          status: 200,
          data: users_data,
          message: "Users fetched successfully",
        });

        res.status(response.statusCode).send(response);
        return;
      } else {
        let response = error_function({
          status: 404,
          message: "User details not found",
        });
        res.status(response.statusCode).send(response);
        return;
      }
    } else {
      if (!token) {
        let response = error_function({
          status: 400,
          message: "Token is required",
        });
        res.status(response.statusCode).send({ response });
        return;
      }
      if (!id) {
        let response = error_function({
          status: 400,
          message: "Id is required",
        });
        res.status(response.statusCode).send(response);
        return;
      }
    }
  } catch (error) {
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
};

exports.fetchProfile = async function (req, res) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader ? authHeader.split(" ")[1] : null;

    let decoded = jwt.decode(token);
    //console.log("user_id : ", decoded.user_id);

    let users_data = await users
      .findOne({ _id: decoded.user_id })
      .populate("official_details.department", "department")
      .populate("official_details.employee_type", "employee_type -_id")
      .populate("official_details.profile_status", "profile_status -_id")
      .populate("user_type", "user_type -_id");

    if (users_data) {
      let response = success_function({
        status: 200,
        data: users_data,
        message: "User fetched successfully",
      });

      res.status(response.statusCode).send(response);
      return;
    } else {
      let response = error_function({
        status: 404,
        message: "User data not found",
      });
      res.status(response.statusCode).send(response);
      return;
    }
  } catch (error) {
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
};

exports.addNewUser = async function (req, res) {
  try {
    await userManager
      .checkValid(req)
      .then(async (result) => {
        if (result.isValid) {
          await userManager
            .createUser(req)
            .then((result) => {
              let response = success_function(result);
              response.zoho_email = result.zoho_email;
              response.zoho_password = result.zoho_password;
              res.status(result.status).send(response);
              return;
            })
            .catch((error) => {
              let response = error_function(error);
              res.status(error.status).send(response);
              return;
            });
        } else {
          let response = error_function({
            status: 400,
            message: "Validation failed",
          });
          response.errors = result.errors;
          res.status(response.statusCode).send(response);
          return;
        }
      })
      .catch((error) => {
        let response = error_function(error);
        response.errors = error.errors;
        res.status(error.status).send(response);
        return;
      });
  } catch (error) {
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
};

exports.editUser = async function (req, res) {
  try {
    const user_id = req.params.user_id;
    if (!user_id) {
      // throw new Error('User id is required');
      let response = error_function({
        status: 400,
        message: "user id is required",
      });
      res.status(response.statusCode).send(response);
      return;
    }

    await userManager
      .checkValid(req)
      .then(async (result) => {
        if (result.isValid) {
          await userManager
            .editUser(req)
            .then((result) => {
              let response = success_function(result);
              res.status(result.status).send(response);
              return;
            })
            .catch((error) => {
              let response = error_function(error);
              res.status(error.status).send(response);
              return;
            });
        } else {
          let response = error_function({
            status: 400,
            message: "Validation failed",
          });
          response.errors = result.errors;
          res.status(response.statusCode).send(response);
          return;
        }
      })
      .catch((error) => {
        let response = error_function(error);
        response.errors = error.errors;
        res.status(error.status).send(response);
        return;
      });
  } catch (error) {
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
      //console.log("Response : ", response);
      res.status(response.statusCode).send(response);
      return;
    }
  }
};

exports.fetchAllDepartments = async function (req, res) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader ? authHeader.split(" ")[1] : null;
    let decoded = jwt.decode(token);

    let count = Number(await departments.count());
    //console.log("Count : ", count);

    const pageNumber = req.query.page || 1;
    const pageSize = req.query.pageSize || count;

    let keyword = req.query.keyword;
    let id = req.query.id;

    let filters = [];

    if (keyword) {
      filters.push({ department: { $regex: keyword, $options: "i" } });
    }

    if (id) {
      filters.push({ _id: id });
    }

    //Getting organization_id and user_type of the login user
    let user = await users
      .findOne({ $and: [{ _id: decoded.user_id }, { deleted: { $ne: true } }] })
      .populate("user_type");

    if (!user) {
      let response = error_function({
        status: 404,
        message: "Login user not found",
      });
      res.status(response.statusCode).send(response);
      return;
    }

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

    //If user type not equals admin, then find users of that particular organizaton only, add organization_id to filters if user is not admin
    if (user_type !== "admin") {
      filters.push({ organization: organization_id });
    } else {
      //console.log("User is admin");
    }

    //For eliminating deleted user
    filters.push({ deleted: { $ne: true } });

    //console.log("Filters : ", filters);

    let departments_data = await departments
      .find(filters.length > 0 ? { $and: filters } : null)
      .sort({_id : -1})
      .select("-createdAt -updatedAt -__v")
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize);

    if (departments) {
      let count = await departments.count(
        filters.length > 0 ? { $and: filters } : null
      );
      let total_pages = Math.ceil(count / pageSize);
      let data = {
        count: count,
        total_pages: total_pages,
        currentPage: pageNumber,
        datas: departments_data,
      };

      let response = success_function({
        status: 200,
        data: data,
        message: "Departments fetched successfully",
      });
      res.status(response.statusCode).send(response);
      return;
    } else {
      let response = error_function({
        status: 404,
        message: "Departments data not found",
      });
      res.status(response.statusCode).send(response);
      return;
    }
  } catch (error) {
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
};

exports.fetchAllEmployeeTypes = async function (req, res) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader ? authHeader.split(" ")[1] : null;

    let decoded = jwt.decode(token);

    //console.log("Count : ", count);

    let filters = [];

    let keyword = req.query.keyword;

    if (keyword) {
      filters.push({
        $or: [{ employee_type: { $regex: keyword, $options: "i" } }],
      });
    }

    //Getting organization_id and user_type of the login user
    let user = await users
      .findOne({ $and: [{ _id: decoded.user_id }, { deleted: { $ne: true } }] })
      .populate("user_type");
    let user_type = user.user_type.user_type;
    let organization_id = user.organization;




    //console.log("Login user : ", user);
    //console.log("User Type : ", user_type);
    //console.log("Organization id : ", organization_id);

    //If user type not equals admin, then find users of that particular organizaton only, add organization_id to filters if user is not admin
    if (user_type !== "admin") {
      filters.push({ organization: organization_id });
    } else {
      //console.log("User is admin");
    }


    //For eliminating deleted user
    filters.push({ deleted: { $ne: true } });
    //console.log("Filters : ", filters);

    let count = Number(await employeeTypesModel.count(filters.length > 0 ? { $and: filters } : null));
    const pageNumber = Number(req.query.page) || Number(1);
    const pageSize = Number(req.query.pageSize) || Number(count);

    let employee_types = await employeeTypesModel
      .find(filters.length > 0 ? { $and: filters } : null)
      .sort({_id : -1})
      .select("-createdAt -updatedAt -__v")
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize);

      

 

    if (employee_types) {
      let total_pages = Math.ceil(count / pageSize);
      let data = {
        count: count,
        total_pages: total_pages,
        currentPage: pageNumber,
        datas: employee_types,
      };
      let response = success_function({
        status: 200,
        data: data,
        message: "Employee types fetched successfully",
      });

      res.status(response.statusCode).send(response);
      return;
    } else {
      let response = error_function({
        status: 404,
        message: "Employee types data not found",
      });
      res.status(response.statusCode).send(response);
      return;
    }
  } catch (error) {
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
};

exports.fetchAllSkills = async function (req, res) {
  try {
    const authHeader = req.headers["authorization"];
    let token = authHeader ? authHeader.split(" ")[1] : null;
    let decoded = jwt.decode(token);

    let count = Number(await skills.count());
    //console.log("Count : ", count);

    const pageNumber = req.query.page || 1;
    const pageSize = req.query.pageSize || count;

    let keyword = req.query.keyword;
    let id = req.query.id;

    let filters = [];

    if (keyword) {
      filters.push({ skill: { $regex: keyword, $options: "i" } });
    }

    if (id) {
      filters.push({ _id: id });
    }

    //Getting organization_id and user_type of the login user
    let user = await users
      .findOne({ $and: [{ _id: decoded.user_id }, { deleted: { $ne: true } }] })
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

    //If user type not equals admin, then find users of that particular organizaton only, add organization_id to filters if user is not admin
    if (user_type !== "admin") {
      filters.push({ organization: organization_id });
    } else {
      //console.log("User is admin");
    }
    //For eliminating deleted user
    filters.push({ deleted: { $ne: true } });

    //console.log("Filters : ", filters);

    let skills_data = await skills
      .find(
        filters.length > 0 ? { $and: filters } : null,
        "-createdAt -updatedAt -__v"
      )
      .sort({_id : -1})
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize);

    if (skills_data) {
      let count = await skills.count(
        filters.length > 0 ? { $and: filters } : null
      );
      let total_pages = Math.ceil(count / pageSize);
      let data = {
        count: count,
        total_pages: total_pages,
        currentPage: pageNumber,
        datas: skills_data,
      };

      let response = success_function({
        status: 200,
        data: data,
        message: "Skills fetched successfully",
      });
      res.status(response.statusCode).send(response);
      return;
    } else {
      let response = error_function({ status: 404, message: "No datas found" });
      res.status(response.statusCode).send(response);
      return;
    }
  } catch (error) {
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
};

exports.addNewSkills = async function (req, res) {
  try {
    const authHeader = req.headers["authorization"];
    let token = authHeader ? authHeader.split(" ")[1] : null;
    let decoded = jwt.decode(token);

    let skills_data = req.body.skills_data; //Send skills as array from front end

    if (skills_data.length < 1) {
      let response = error_function({
        status: 400,
        message: "No skills found",
      });
      res.status(response.statusCode).send(response);
      return;
    }
    let new_skill = [];
    let isFound_data = [];

    //console.log("Payload : ", skills_data);
    await Promise.all(
      skills_data.map(async (skill) => {
        let isFound = await skills.findOne({ skill: skill });
        // //console.log("isFound : ", isFound);

        if (isFound) {
          isFound_data.push(skill);
        } else {
          new_skill.push(skill);
        }
      })
    );

    //console.log("isFound datas : ", isFound_data);
    //console.log("New skills : ", new_skill);

    if (Number(isFound_data.length) === 0) {
      // let newSkill = new skills({ skill: skill });
      // newSkill.save();

      //Getting organization_id and user_type of the login user
      let user = await users
        .findOne({ _id: decoded.user_id })
        .populate("user_type");
      let user_type = user.user_type.user_type;
      let organization_id = user.organization;

      //console.log("Login user : ", user);
      //console.log("User Type : ", user_type);
      //console.log("Organization id : ", organization_id);

      let new_documents = new_skill.map((skill) => {
        // return { skill };
        let doc = {};
        //If user type not equals admin, then find users of that particular organizaton only, add organization_id to filters if user is not admin
        if (user_type !== "admin") {
          // filters.push({ organization: organization_id });
          doc["organization"] = organization_id;
          doc["skill"] = skill;
          return doc;
        } else {
          //console.log("User is admin");
        }
      });

      //console.log("New documents : ", new_documents);

      let inserted_documents = await skills.insertMany(new_documents);

      if (inserted_documents) {
        let response = success_function({
          status: 201,
          data: inserted_documents,
          message: "Skills added successfully",
        });
        res.status(response.statusCode).send(response);
        return;
      } else {
        let response = error_function({
          status: 400,
          message: "Skills not added",
        });
        res.status(response.statusCode).send(response);
        return;
      }
    } else {
      let response = error_function({
        status: 400,
        data: isFound_data,
        message: "Skills already found",
      });
      res.status(response.statusCode).send(response);
      return;
    }
  } catch (error) {
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
};

exports.updateSkills = async function (req, res) {
  try {
    const authHeader = req.headers["authorization"];
    let token = authHeader ? authHeader.split(" ")[1] : null;
    let decoded = jwt.decode(token);

    //Getting organization_id of the login user
    let user = await users
      .findOne({ _id: decoded.user_id })
      .populate("user_type");
    // let user_type = user.user_type.user_type;
    let organization_id = user.organization;

    //console.log("Login user : ", user);
    // //console.log("User Type : ", user_type);
    //console.log("Organization id : ", organization_id);

    let skills_updated_data = req.body.skills_updated_data; // Should be an array

    for (let i = 0; i < Number(skills_updated_data.length); i++) {
      if (!skills_updated_data[i].id) {
        let response = error_function({
          status: 400,
          data: skills_updated_data[i],
          message: "Id is required",
        });
        res.status(response.statusCode).send(response);
        return;
      }

      //console.log("Updated skill : ", skills_updated_data[i].skill);
      if (!skills_updated_data[i].skill) {
        let response = error_function({
          status: 400,
          data: skills_updated_data[i],
          message: "Updated skill is required",
        });
        res.status(response.statusCode).send(response);
        return;
      }

      //Findind organization_id of that particular skill
      let skills_organization = await skills.findOne({
        _id: skills_updated_data[i].id,
      });
      // let user_type = user.user_type.user_type;
      let skills_organization_id = skills_organization.organization;

      if (toString(skills_organization_id) !== toString(organization_id)) {
        let response = error_function({
          status: 400,
          data: skills_updated_data[i],
          message: "Wrong organization",
        });
        res.status(response.statusCode).send(response);
        return;
      }
    }

    let new_skill = [];
    let isFound_data = [];

    await Promise.all(
      skills_updated_data.map(async (e) => {
        let isFound = await skills.findOne({ skill: e.skill });
        // //console.log("isFound : ", isFound);

        if (isFound) {
          isFound_data.push(e);
        } else {
          new_skill.push(e);
        }
      })
    );

    //console.log("isFound datas : ", isFound_data);
    //console.log("New skills : ", new_skill);

    if (Number(isFound_data.length) === 0) {
      // let newSkill = new skills({ skill: skill });
      // newSkill.save();

      const updateDocuments = new_skill.map(({ id, skill }) => ({
        updateOne: {
          filter: { _id: id },
          update: { skill: skill },
        },
      }));

      let updated_documents = await skills.bulkWrite(updateDocuments);

      if (updated_documents) {
        let response = success_function({
          status: 201,
          data: updated_documents,
          message: "Skills updated successfully",
        });
        res.status(response.statusCode).send(response);
        return;
      } else {
        let response = error_function({
          status: 400,
          message: "Skills not updated",
        });
        res.status(response.statusCode).send(response);
        return;
      }
    } else {
      let response = error_function({
        status: 409,
        data: isFound_data,
        message: "Skills already found",
      });
      res.status(response.statusCode).send(response);
      return;
    }
  } catch (error) {
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
};

exports.deleteSkills = async function (req, res) {
  try {
    const authHeader = req.headers["authorization"];
    let token = authHeader ? authHeader.split(" ")[1] : null;
    let decoded = jwt.decode(token);

    //Getting organization_id of the login user
    let user = await users
      .findOne({ $and: [{ _id: decoded.user_id }, { deleted: { $ne: true } }] })
      .populate("user_type");
    // let user_type = user.user_type.user_type;
    let organization_id = user.organization;

    //console.log("Login user : ", user);
    // //console.log("User Type : ", user_type);
    //console.log("Organization id : ", organization_id);

    let target_datas = req.body.target_datas; // Should be an array

    for (let i = 0; i < Number(target_datas.length); i++) {
      //Findind organization_id of that particular skill
      let skills_organization = await skills.findOne({
        _id: target_datas[i],
      });
      // let user_type = user.user_type.user_type;
      let skills_organization_id = skills_organization.organization;

      //console.log("Skills organization id : ", skills_organization_id);
      //console.log("Organization_id : ", organization_id);
      if (toString(skills_organization_id) !== toString(organization_id)) {
        let response = error_function({
          status: 400,
          data: target_datas[i],
          message: "Wrong organization",
        });
        res.status(response.statusCode).send(response);
        return;
      }
    }

    let delete_data = await skills.deleteMany({ _id: { $in: target_datas } });

    let deleted_count = delete_data.deletedCount;
    //console.log("Deleted count : ", deleted_count);

    if (Number(target_datas.length) === Number(deleted_count) && delete_data) {
      let response = success_function({
        status: 200,
        message: `${Number(deleted_count)} documents deleted`,
      });
      res.status(response.statusCode).send(response);
      return;
    } else {
      let response = error_function({
        status: 400,
        message: "Count doesn't match",
      });
      res.status(response.statusCode).send(response);
      return;
    }
  } catch (error) {
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
};

exports.addNewDepartments = async function (req, res) {
  try {
    const authHeader = req.headers["authorization"];
    let token = authHeader ? authHeader.split(" ")[1] : null;
    let decoded = jwt.decode(token);

    let department = req.body.department;

    if (!department) {
      let response = error_function({
        status: 400,
        message: "Department is required",
      });
      res.status(response.statusCode).send(response);
      return;
    }

    //Getting organization_id and user_type of the login user
    let user = await users
      .findOne({ $and: [{ _id: decoded.user_id }, { deleted: { $ne: true } }] })
      .populate("user_type");

    if (!user) {
      let response = error_function({
        status: 404,
        message: "Login user not found",
      });
      res.status(response.statusCode).send(response);
      return;
    }

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

    let isFound = await departments.findOne({
      $and: [
        // { department: { $regex: department, $options: "i" } },
        { department: { $regex: new RegExp("^" + department + "$", "i") } },
        { deleted: { $ne: true } },
        { organization: organization_id },
      ],
    });

    if (isFound) {
      let response = error_function({
        status: 409,
        message: "Department already found",
      });
      res.status(response.statusCode).send(response);
      return;
    }

    let doc = {};

    doc["organization"] = organization_id;
    doc["department"] = department;

    //console.log("doc : ", doc);

    let save_department = await new departments(doc);
    let saved = await save_department.save();

    //console.log("Saved : ", saved);

    if (saved) {
      let response = success_function({
        status: 201,
        data: save_department,
        message: "Department added successfully",
      });
      res.status(response.statusCode).send(response);
      return;
    } else {
      let response = error_function({
        status: 400,
        message: "Failed",
      });
      res.status(response.statusCode).send(response);
      return;
    }
  } catch (error) {
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
};

exports.addNewSkills1 = async function (req, res) {
  try {
    const authHeader = req.headers["authorization"];
    let token = authHeader ? authHeader.split(" ")[1] : null;
    let decoded = jwt.decode(token);

    let skill = req.body.skill;

    if (!skill) {
      let response = error_function({
        status: 400,
        message: "No skills found",
      });
      res.status(response.statusCode).send(response);
      return;
    }

    //Getting organization_id and user_type of the login user
    let user = await users
      .findOne({ $and: [{ _id: decoded.user_id }, { deleted: { $ne: true } }] })
      .populate("user_type");
    let user_type = user.user_type.user_type;
    let organization_id = user.organization;

    //console.log("Login user : ", user);
    //console.log("User Type : ", user_type);
    //console.log("Organization id : ", organization_id);

    if (!organization_id) {
      let response = error_function({
        status: 400,
        message: "Organization not found",
      });
      res.status(response.statusCode).send(response);
      return;
    }

    let isFound = await skills.findOne({
      $and: [
        // { skill: { $regex: skill, $options: "i" } },
        { skill: { $regex: new RegExp("^" + skill + "$", "i") } },
        { deleted: { $ne: true } },
        { organization: organization_id },
      ],
    });

    if (isFound) {
      let response = error_function({
        status: 400,
        message: "Skill already found",
      });
      res.status(response.statusCode).send(response);
      return;
    }

    let doc = {};

    doc["organization"] = organization_id;
    doc["skill"] = skill;

    //console.log("doc : ", doc);

    let save_skill = await new skills(doc);
    let saved = await save_skill.save();

    //console.log("Saved : ", saved);

    if (saved) {
      let response = success_function({
        status: 201,
        data: save_skill,
        message: "Skill added successfully",
      });
      res.status(response.statusCode).send(response);
      return;
    }
  } catch (error) {
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
};

exports.fetchSingleSkill = async function (req, res) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader ? authHeader.split(" ")[1] : null;
    let decoded = jwt.decode(token);
    let id = req.params.id;

    //Getting organization_id and user_type of the login user
    let user = await users
      .findOne({ $and: [{ _id: decoded.user_id }, { deleted: { $ne: true } }] })
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

    if (token && id) {
      let skills_data = await skills.findOne({
        $and: [
          { _id: id },
          { deleted: { $ne: true } },
          { organization: organization_id },
        ],
      });

      if (skills_data) {
        let response = success_function({
          status: 200,
          data: skills_data,
          message: "Skill fetched successfully",
        });

        res.status(response.statusCode).send(response);
        return;
      } else {
        let response = error_function({
          status: 404,
          message: "Skill not found",
        });
        res.status(response.statusCode).send(response);
        return;
      }
    } else {
      if (!token) {
        let response = error_function({
          status: 400,
          message: "Token is required",
        });
        res.status(response.statusCode).send({ response });
        return;
      }
      if (!id) {
        let response = error_function({
          status: 400,
          message: "Id is required",
        });
        res.status(response.statusCode).send(response);
        return;
      }
    }
  } catch (error) {
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
};

exports.updateSkills1 = async function (req, res) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader ? authHeader.split(" ")[1] : null;
    let decoded = jwt.decode(token);

    let filters = [];

    let id = req.params.id;
    let skill = req.body.skill;

    if (!skill) {
      let response = error_function({
        status: 404,
        message: "Updated skill is required",
      });
      res.status(response.statusCode).send(response);
      return;
    }

    if (id) {
      filters.push({ _id: id });
    } else {
      let response = error_function({
        status: 404,
        message: "Skill id is required",
      });
      res.status(response.statusCode).send(response);
      return;
    }

    let user = await users
      .findOne({ $and: [{ _id: decoded.user_id }, { deleted: { $ne: true } }] })
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
    } else {
      //If user type not equals admin, then find users of that particular organizaton only, add organization_id to filters if user is not admin
      if (user_type !== "admin") {
        filters.push({ organization: organization_id });
      } else {
        //console.log("User is admin");
      }

      //For eliminating deleted user
      filters.push({ deleted: { $ne: true } });

      //console.log("Filters : ", filters);

      let isFound = await skills.findOne({
        $and: [
          // { skill: { $regex: skill, $options: "i" } },
          { skill: { $regex: new RegExp("^" + skill + "$", "i") } },
          { deleted: { $ne: true } },
          {_id : {$ne : id}},
          { organization: organization_id },
        ],
      });

      //console.log("isFound : ", isFound);
      if (isFound) {
        let response = error_function({
          status: 400,
          message: "Skill already found",
        });
        res.status(response.statusCode).send(response);
        return;
      }

      //console.log("Skill : ", skill);
      let updated = await skills.updateOne(
        filters.length > 0 ? { $and: filters } : null,
        { $set: { skill } },
        {
          new: true,
        }
      );

      if (
        Number(updated.matchedCount) === 1 &&
        Number(updated.modifiedCount) === 1
      ) {
        let response = success_function({
          status: 200,
          data: updated,
          message: "Skill updated successfully",
        });
        res.status(response.statusCode).send(response);
        return;
      } else {
        let response = error_function({
          status: 400,
          message: "Skill not updated",
        });
        res.status(response.statusCode).send(response);
        return;
      }
    }
  } catch (error) {
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
};

exports.deleteSkills1 = async function (req, res) {
  try {
    const authHeader = req.headers["authorization"];
    let token = authHeader ? authHeader.split(" ")[1] : null;
    let decoded = jwt.decode(token);

    let user = await users
      .findOne({ $and: [{ _id: decoded.user_id }, { deleted: { $ne: true } }] })
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

    let target_id = req.params.id; // Should be an array

    if (!target_id) {
      let response = error_function({
        status: 404,
        message: "Id is required",
      });
      res.status(response.statusCode).send(response);
      return;
    }

    let target_data = await skills.findOne({
      $and: [
        { _id: target_id },
        { deleted: { $ne: true } },
        { organization: organization_id },
      ],
    });

    //console.log("Target data : ", target_data);

    if (target_data) {
      let delete_data = await target_data.delete();

      let save_delete = await delete_data.save();

      //console.log("delete_data : ", delete_data);

      if (save_delete) {
        let response = success_function({
          status: 200,
          data: delete_data,
          message: `Skill deleted`,
        });
        res.status(response.statusCode).send(response);
        return;
      } else {
        let response = error_function({
          status: 400,
          message: "Failed",
        });
        res.status(response.statusCode).send(response);
        return;
      }
    } else {
      let response = error_function({
        status: 404,
        message: "Not found",
      });
      res.status(response.statusCode).send(response);
      return;
    }
  } catch (error) {
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
};

exports.fetchSingleDepartment = async function (req, res) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader ? authHeader.split(" ")[1] : null;
    let decoded = jwt.decode(token);
    let id = req.params.id;

    //Getting organization_id and user_type of the login user
    let user = await users
      .findOne({ $and: [{ _id: decoded.user_id }, { deleted: { $ne: true } }] })
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

    if (token && id) {
      let departments_data = await departments
        .findOne({
          $and: [
            { _id: id },
            { deleted: { $ne: true } },
            { organization: organization_id },
          ],
        })
        .select("-createdAt -updatedAt -__v");

      if (departments_data) {
        let response = success_function({
          status: 200,
          data: departments_data,
          message: "Department fetched successfully",
        });

        res.status(response.statusCode).send(response);
        return;
      } else {
        let response = error_function({
          status: 404,
          message: "Department not found",
        });
        res.status(response.statusCode).send(response);
        return;
      }
    } else {
      if (!token) {
        let response = error_function({
          status: 400,
          message: "Token is required",
        });
        res.status(response.statusCode).send({ response });
        return;
      }
      if (!id) {
        let response = error_function({
          status: 400,
          message: "Id is required",
        });
        res.status(response.statusCode).send(response);
        return;
      }
    }
  } catch (error) {
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
};

exports.updateDepartments = async function (req, res) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader ? authHeader.split(" ")[1] : null;
    let decoded = jwt.decode(token);

    let filters = [];

    let id = req.params.id;
    let department = req.body.department;

    if (!department) {
      let response = error_function({
        status: 404,
        message: "Updated Department is required",
      });
      res.status(response.statusCode).send(response);
      return;
    }

    if (id) {
      filters.push({ _id: id });
    } else {
      let response = error_function({
        status: 404,
        message: "Department id is required",
      });
      res.status(response.statusCode).send(response);
      return;
    }

    let user = await users
      .findOne({ $and: [{ _id: decoded.user_id }, { deleted: { $ne: true } }] })
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
    } else {
      //If user type not equals admin, then find users of that particular organizaton only, add organization_id to filters if user is not admin
      if (user_type !== "admin") {
        filters.push({ organization: organization_id });
      } else {
        //console.log("User is admin");
      }

      //For eliminating deleted user
      filters.push({ deleted: { $ne: true } });

      //console.log("Filters : ", filters);

      let isFound = await departments.findOne({
        $and: [
          // { department: { $regex: department, $options: "i" } },
          { department: { $regex: new RegExp("^" + department + "$", "i") } },
          { deleted: { $ne: true } },
          {_id : {$ne : id}},
          { organization: organization_id },
        ],
      });

      if (isFound) {
        let response = error_function({
          status: 400,
          message: "Department already found",
        });
        res.status(response.statusCode).send(response);
        return;
      }

      //console.log("Department : ", department);
      let updated = await departments.updateOne(
        filters.length > 0 ? { $and: filters } : null,
        { $set: { department } },
        {
          new: true,
        }
      );

      if (
        Number(updated.matchedCount) === 1 &&
        Number(updated.modifiedCount) === 1
      ) {
        let response = success_function({
          status: 200,
          data: updated,
          message: "Department updated successfully",
        });
        res.status(response.statusCode).send(response);
        return;
      } else {
        let response = error_function({
          status: 400,
          message: "Department not updated",
        });
        res.status(response.statusCode).send(response);
        return;
      }
    }
  } catch (error) {
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
};

exports.deleteDepartments = async function (req, res) {
  try {
    const authHeader = req.headers["authorization"];
    let token = authHeader ? authHeader.split(" ")[1] : null;
    let decoded = jwt.decode(token);

    let user = await users
      .findOne({ $and: [{ _id: decoded.user_id }, { deleted: { $ne: true } }] })
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

    let target_id = req.params.id; // Should be an array

    if (!target_id) {
      let response = error_function({
        status: 404,
        message: "Id is required",
      });
      res.status(response.statusCode).send(response);
      return;
    }

    let target_data = await departments.findOne({
      $and: [
        { _id: target_id },
        { deleted: { $ne: true } },
        { organization: organization_id },
      ],
    });

    //console.log("Target data : ", target_data);

    if (target_data) {
      //Checking if any user has this particular department assigned or not
      let target_user = await users.find({
        $and: [
          { organization: new mongoose.Types.ObjectId(organization_id) },
          { deleted: { $ne: true } },
          {
            "official_details.department": new mongoose.Types.ObjectId(
              target_id
            ),
          },
        ],
      });

      if (Number(target_user.length) > Number(0)) {
        let response = error_function({
          status: 409,
          message: "Department already assigned",
        });
        res.status(response.statusCode).send(response);
        return;
      }

      let delete_data = await target_data.delete();

      let save_delete = await delete_data.save();

      if (save_delete) {
        let response = success_function({
          status: 200,
          data: delete_data,
          message: `Department deleted`,
        });
        res.status(response.statusCode).send(response);
        return;
      } else {
        let response = error_function({
          status: 400,
          message: "Failed",
        });
        res.status(response.statusCode).send(response);
        return;
      }
    } else {
      let response = error_function({
        status: 404,
        message: "Not found",
      });
      res.status(response.statusCode).send(response);
      return;
    }
  } catch (error) {
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
};

exports.fetchSingleEmployeeTypes = async function (req, res) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader ? authHeader.split(" ")[1] : null;
    let decoded = jwt.decode(token);
    let id = req.params.id;

    //Getting organization_id and user_type of the login user
    let user = await users
      .findOne({ $and: [{ _id: decoded.user_id }, { deleted: { $ne: true } }] })
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

    if (token && id) {
      let employee_types_data = await employeeTypesModel
        .findOne({
          $and: [
            { _id: id },
            { deleted: { $ne: true } },
            { organization: organization_id },
          ],
        })
        .select("-createdAt -updatedAt -__v");

      if (employee_types_data) {
        let response = success_function({
          status: 200,
          data: employee_types_data,
          message: "Employee type fetched successfully",
        });

        res.status(response.statusCode).send(response);
        return;
      } else {
        let response = error_function({
          status: 404,
          message: "Employee type not found",
        });
        res.status(response.statusCode).send(response);
        return;
      }
    } else {
      if (!token) {
        let response = error_function({
          status: 400,
          message: "Token is required",
        });
        res.status(response.statusCode).send({ response });
        return;
      }
      if (!id) {
        let response = error_function({
          status: 400,
          message: "Id is required",
        });
        res.status(response.statusCode).send(response);
        return;
      }
    }
  } catch (error) {
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
};

exports.addNewEmployeeTypes = async function (req, res) {
  try {
    const authHeader = req.headers["authorization"];
    let token = authHeader ? authHeader.split(" ")[1] : null;
    let decoded = jwt.decode(token);

    let employee_type = req.body.employee_type;

    if (!employee_type) {
      let response = error_function({
        status: 400,
        message: "Employee type is required",
      });
      res.status(response.statusCode).send(response);
      return;
    }

    //Getting organization_id and user_type of the login user
    let user = await users
      .findOne({ $and: [{ _id: decoded.user_id }, { deleted: { $ne: true } }] })
      .populate("user_type");
    let user_type = user.user_type.user_type;
    let organization_id = user.organization;

    //console.log("Login user : ", user);
    //console.log("User Type : ", user_type);
    //console.log("Organization id : ", organization_id);

    if (!organization_id) {
      let response = error_function({
        status: 400,
        message: "Organization not found",
      });
      res.status(response.statusCode).send(response);
      return;
    }

    let isFound = await employeeTypesModel.findOne({
      $and: [
        // { employee_type: { $regex: employee_type, $options: "i" } },
        {
          employee_type: { $regex: new RegExp("^" + employee_type + "$", "i") },
        },
        { deleted: { $ne: true } },
        { organization: organization_id },
      ],
    });

    if (isFound) {
      let response = error_function({
        status: 400,
        message: "Employee type already found",
      });
      res.status(response.statusCode).send(response);
      return;
    }

    let doc = {};

    doc["organization"] = organization_id;
    doc["employee_type"] = employee_type;

    //console.log("doc : ", doc);

    let save_employee_type = await new employeeTypesModel(doc);
    let saved = await save_employee_type.save();

    //console.log("Saved : ", saved);

    if (saved) {
      let response = success_function({
        status: 201,
        data: save_employee_type,
        message: "Employee type added successfully",
      });
      res.status(response.statusCode).send(response);
      return;
    }
  } catch (error) {
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
};

exports.updateEmployeeTypes = async function (req, res) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader ? authHeader.split(" ")[1] : null;
    let decoded = jwt.decode(token);

    let filters = [];

    let id = req.params.id;
    let employee_type = req.body.employee_type;

    if (!employee_type) {
      let response = error_function({
        status: 404,
        message: "Updated employee type is required",
      });
      res.status(response.statusCode).send(response);
      return;
    }

    if (id) {
      filters.push({ _id: id });
    } else {
      let response = error_function({
        status: 404,
        message: "Employee type id is required",
      });
      res.status(response.statusCode).send(response);
      return;
    }

    let user = await users
      .findOne({ $and: [{ _id: decoded.user_id }, { deleted: { $ne: true } }] })
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
    } else {
      //If user type not equals admin, then find users of that particular organizaton only, add organization_id to filters if user is not admin
      if (user_type !== "admin") {
        filters.push({ organization: organization_id });
      } else {
        //console.log("User is admin");
      }

      //For eliminating deleted user
      filters.push({ deleted: { $ne: true } });

      //console.log("Filters : ", filters);

      let isFound = await employeeTypesModel.findOne({
        $and: [
          { employee_type: { $regex: employee_type, $options: "i" } },
          { deleted: { $ne: true } },
          {_id : {$ne : id}},
          { organization: organization_id },
        ],
      });

      if (isFound) {
        let response = error_function({
          status: 400,
          message: "Employee type already found",
        });
        res.status(response.statusCode).send(response);
        return;
      }

      //console.log("employee_type : ", employee_type);
      let updated = await employeeTypesModel.updateOne(
        filters.length > 0 ? { $and: filters } : null,
        { $set: { employee_type } },
        {
          new: true,
        }
      );

      if (
        Number(updated.matchedCount) === 1 &&
        Number(updated.modifiedCount) === 1
      ) {
        let response = success_function({
          status: 200,
          data: updated,
          message: "Employee types updated successfully",
        });
        res.status(response.statusCode).send(response);
        return;
      } else {
        let response = error_function({
          status: 400,
          message: "Employee types not updated",
        });
        res.status(response.statusCode).send(response);
        return;
      }
    }
  } catch (error) {
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
};

exports.deleteEmployeeTypes = async function (req, res) {
  try {
    const authHeader = req.headers["authorization"];
    let token = authHeader ? authHeader.split(" ")[1] : null;
    let decoded = jwt.decode(token);

    let user = await users
      .findOne({ $and: [{ _id: decoded.user_id }, { deleted: { $ne: true } }] })
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

    let target_id = req.params.id; // Should be an array

    if (!target_id) {
      let response = error_function({
        status: 404,
        message: "Id is required",
      });
      res.status(response.statusCode).send(response);
      return;
    }

    let target_data = await employeeTypesModel.findOne({
      $and: [
        { _id: target_id },
        { deleted: { $ne: true } },
        { organization: organization_id },
      ],
    });

    //console.log("Target data : ", target_data);

    if (target_data) {

      //Checking if any user has this particular employee type assigned or not
      let target_user = await users.find({
        $and: [
          { organization: new mongoose.Types.ObjectId(organization_id) },
          { deleted: { $ne: true } },
          {
            "official_details.employee_type": new mongoose.Types.ObjectId(
              target_id
            ),
          },
        ],
      });

      if (Number(target_user.length) > Number(0)) {
        let response = error_function({
          status: 409,
          message: "Employee type already assigned",
        });
        res.status(response.statusCode).send(response);
        return;
      }

      let delete_data = await target_data.delete();

      let save_delete = await delete_data.save();

      //console.log("delete_data : ", delete_data);

      if (save_delete) {
        let response = success_function({
          status: 200,
          data: delete_data,
          message: `Employee type deleted`,
        });
        res.status(response.statusCode).send(response);
        return;
      } else {
        let response = error_function({
          status: 400,
          message: "Failed",
        });
        res.status(response.statusCode).send(response);
        return;
      }
    } else {
      let response = error_function({
        status: 404,
        message: "Not found",
      });
      res.status(response.statusCode).send(response);
      return;
    }
  } catch (error) {
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
};

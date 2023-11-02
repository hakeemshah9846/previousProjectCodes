const success_function = require("../utils/response-handler").success_function;
const error_function = require("../utils/response-handler").error_function;
const organization = require("../db/models/organizations");
const addOrganizationsValidation = require("../validations/add-organizations-validations");
const editOrganizationsValidation = require("../validations/edit-organizations-validation");
const mongoose_delete = require("mongoose-delete");
const jwt = require("jsonwebtoken");
const userManager = require("../managers/userManager");
const users = require("../db/models/users");
const external_services = require("../db/models/external_services");
const organizations = require("../db/models/organizations");
const express = require("express");
const { default: axios } = require("axios");
const { default: mongoose } = require("mongoose");
const router = express.Router();

exports.addNewOrganization = async function (req, res) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader ? authHeader.split(" ")[1] : null;

    //Validation for organization datas
    const { organization_errors, Organization_isValid } =
      await addOrganizationsValidation(req.body);
    //Validation for user datas
    const { errors, isValid } = await userManager.checkValid(req);

    if (Organization_isValid && isValid) {
      let message;
      let success;
      let user_id;
      let organization_id;

      //Setting user_type as organization
      req.body.user_type_id = "645e34807483b6558146f844";

      //Create organization user
      await userManager
        .createUser(req)
        .then((result) => {
          // let response = success_function(result);
          // res.status(result.status).send(response);
          message = result.message;
          success = true;
          //console.log("User result : ", result);
          //console.log("User_id : ", result._id);
          user_id = result._id;
          // return;
        })
        .catch((error) => {
          // let response = error_function(error);
          // response.errors = error.errors;
          // res.status(error.status).send(response);
          // return;
          console.log("Error from add organizations controller: ", error);
          message = error.message;
          success = false;
        });

      if (success) {
        const name = req.body.name;
        const email = req.body.email;
        const contact_no = req.body.contact_no;
        const street = req.body.street;
        const city = req.body.city;
        const state = req.body.state;
        const country = req.body.country;
        const zipCode = req.body.zipCode;
        const website = req.body.website;
        const founded_year = req.body.founded_year;
        const industry = req.body.industry;

        let organization_details = {};

        organization_details.user = user_id;
        organization_details.name = name;
        organization_details.email = email;
        organization_details.contact_no = contact_no;
        organization_details["address.street"] = street;
        organization_details["address.city"] = city;
        organization_details["address.state"] = state;
        organization_details["address.country"] = country;
        organization_details["address.zipCode"] = zipCode;
        organization_details.website = website;
        organization_details.founded_year = founded_year;
        organization_details.industry = industry;

        //console.log("Organization details : ", organization_details);

        //Saving to database
        let new_organization = new organization(organization_details);
        let saved = await new_organization.save();

        if (saved) {
          organization_id = new_organization._id;

          //Finding organization user just created above and updating with organization id
          let user = await users.updateOne(
            { _id: user_id },
            { $set: { organization: organization_id } },
            { new: true }
          );
          // await users.updateOne({_id : user_id},{organization : organization_id},{new : true});

          // await user.save();

          let response = success_function({
            status: 200,
            message: {
              organization: "Organization details saved successfully",
              user: message,
            },
          });
          res.status(response.statusCode).send(response);
          return;
        } else {
          let response = error_function({
            status: 202,
            message: {
              organization: "Organization details not saved",
              user: message,
            },
          });
          res.status(response.statusCode).send(response);
          return;
        }
      } else {
        let response = error_function({
          status: 422,
          message: "User details not saved",
        });

        res.status(response.statusCode).send(response);
        return;
      }
    } else {
      let response = error_function({
        status: 422,
        message: "Validatioin failed",
      });
      response.organization_errors = organization_errors;
      response.user_errors = errors;
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

exports.editOrganization = async function (req, res) {
  try {
    console.log("Organization edit reached here...");
    const authHeader = req.headers["authorization"];
    const token = authHeader ? authHeader.split(" ")[1] : null;

    if (!req.params.organization_id) {
      // throw new Error('User id is required');
      let response = error_function({
        status: 400,
        message: "Organization id is required",
      });
      res.status(response.statusCode).send(response);
      return;
    } else if (!req.body.user_id) {
      let response = error_function({
        status: 400,
        message: "User id is required",
      });
      res.status(response.statusCode).send(response);
      return;
    }
    //Validation for organization datas
    const { organization_errors, organization_isValid } =
      await editOrganizationsValidation(req.body);
    //Validation for user datas
    const { errors, isValid } = await userManager.checkValid(req);

    if (organization_isValid && isValid) {
      const organization_id = req.params.organization_id;
      const name = req.body.name;
      const email = req.body.email; //Send email only if changed in edit
      const contact_no = req.body.contact_no;
      const street = req.body.street;
      const city = req.body.city;
      const state = req.body.state;
      const country = req.body.country;
      const zipCode = req.body.zipCode;
      const website = req.body.website;
      const founded_year = req.body.founded_year;
      const industry = req.body.industry;
      
      let organization_details = {};
      
      organization_details.name = name;
      //Updates email if found, so send email only if email changed during edit
      if (email) {
        organization_details.email = email;
      } else {
        //console.log("Email not changed in organization details edit");
      }

      organization_details.contact_no = contact_no;
      organization_details["address.street"] = street;
      organization_details["address.city"] = city;
      organization_details["address.state"] = state;
      organization_details["address.country"] = country;
      organization_details["address.zipCode"] = zipCode;
      organization_details.website = website;
      organization_details.founded_year = founded_year;
      organization_details.industry = industry;

      //console.log("Organization details : ", organization_details);

      //Saving to database
      //Updating the user
      let updated = await organization.updateOne(
        { _id: organization_id },
        {
          $set: organization_details,
        }
      );

      //console.log("Reached here!!!!!");
      if (updated) {
        let success;

        await userManager
          .editUser(req)
          .then((result) => {
            // let response = success_function(result);
            // res.status(result.status).send(response);
            message = result.message;
            success = true;
            user_id = result._id;
            // return;
          })
          .catch((error) => {
            // let response = error_function(error);
            // response.errors = error.errors;
            // res.status(error.status).send(response);
            // return;
            message = error.message;
            success = false;
          });

        if (success) {
          let response = success_function({
            status: 201,
          });
          response.organization = "Organization details updated successfully";
          response.user = "User details updated successfully";
          res.status(response.statusCode).send(response);
          return;
        } else {
          let response = error_function({
            status: 400,
          });
          response.organization = "Organization details updated successfully";
          response.user = "User details not updated";
        }
      } else {
        let response = error_function({
          status: 422,
          message: "Organization details not updated",
        });

        res.status(response.statusCode).send(response);
        return;
      }
    } else {
      let response = error_function({
        status: 422,
        message: "Validatioin failed",
      });
      response.organization_errors = organization_errors;
      response.user_errors = errors;
      res
        .status(response.statusCode)
        // .send({ errors: errors, message: "Validatioin failed" });
        .send(response);
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

exports.fetchAllOrganizations = async function (req, res) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader ? authHeader.split(" ")[1] : null;

    let count = Number(await organization.count());
    //console.log("Count : ", count);

    const pageNumber = req.query.page || 1;
    const pageSize = req.query.pageSize || count;

    let keyword = req.query.keyword;
    let organization_id = req.query.organization_id;

    let filters = [];

    if (keyword) {
      filters.push({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { email: { $regex: keyword, $options: "i" } },
          { "address.street": { $regex: keyword, $options: "i" } },
          { "address.city": { $regex: keyword, $options: "i" } },
          { "address.state": { $regex: keyword, $options: "i" } },
          { "address.country": { $regex: keyword, $options: "i" } },
          { website: { $regex: keyword, $options: "i" } },
          { industry: { $regex: keyword, $options: "i" } },
        ],
      });
    }

    if (organization_id) {
      filters.push({ _id: organization_id });
    }

    filters.push({ deleted: { $ne: true } });

    //console.log("Filters : ", filters);
    let organizations_data = await organization
      .find(filters.length > 0 ? { $and: filters } : null)
      .sort({ _id: -1 })
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize);

    if (organizations_data) {
      let count = await organization.count();
      let total_pages = Math.ceil(count / pageSize);
      let data = {
        count: count,
        totalPages: total_pages,
        currentPage: pageNumber,
        datas: organizations_data,
      };

      let response = success_function({
        status: 200,
        data: data,
        message: "Organizations fetched successfully",
      });

      res.status(response.statusCode).send(response);
      return;
    } else {
      let response = error_function({
        status: 404,
        message: "Organizations data not found",
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

exports.fetchSingleOrganization = async function (req, res) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader ? authHeader.split(" ")[1] : null;

    let id = req.params.id;

    if (!id) {
      let response = error_function({
        status: 400,
        message: "Organization id is required",
      });
      res.status(response.statusCode).send(response);
      return;
    }

    let filters = [];
    //Finding the organization id of the requested user or login user
    let decoded = jwt.decode(token);
    //Getting organization_id and user_type of the login user
    let user = await users
      .findOne({ _id: decoded.user_id })
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

    //console.log("Login user : ", user);
    //console.log("User Type : ", user_type);

    //If user type not equals admin, then find users of that particular organizaton only, add organization_id to filters if user is not admin
    if (user_type !== "admin") {
      let organization_id = user.organization;

      //console.log("Organization id : ", organization_id);

      if (!organization_id) {
        let response = error_function({
          status: 404,
          message: "Organization not found",
        });
        res.status(response.statusCode).send(response);
        return;
      }

      //Checking if organizations of login user equals the requested organization id
      if (organization_id == id) {
        //console.log("Reached oranization else condition")
        //console.log("organization_id : ", toString(organization_id));
        //console.log("id : ", toString(id));
        filters.push({ _id: organization_id });
      } else {
        let response = error_function({
          status: 400,
          message: "Wrong organization",
        });
        res.status(response.statusCode).send(response);
        return;
      }
    } else {
      //console.log("User is admin");
      filters.push({ _id: id });
    }

    filters.push({ deleted: { $ne: true } });

    if (token && id) {
      let organization_data = await organization
        .findOne(
          // $and: [{ _id: id }, { deleted: { $ne: true } }],
          filters.length > 0 ? { $and: filters } : null
        )
        .populate(
          "user",
          "-password_token -last_login -password -createdAt -updatedAt -__v"
        );

      if (organization_data) {
        let response = success_function({
          status: 200,
          data: organization_data,
          message: "Organization details fetched successfully",
        });

        res.status(response.statusCode).send(response);
        return;
      } else {
        let response = error_function({
          status: 404,
          message: "Organization details not found",
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

exports.deleteOrganization = async function (req, res) {
  try {
    const authHeader = req.headers["authorization"];
    let token = authHeader ? authHeader.split(" ")[1] : null;

    let target_id = req.params.id; // Should be an array

    let target_data = await organization.findOne({
      $and: [{ _id: target_id }, { deleted: { $ne: true } }],
    });

    //console.log("Target data : ", target_data);

    if (target_data) {
      let delete_data = await target_data.delete();

      let save_delete = await delete_data.save();

      //console.log("delete_data : ", delete_data);

      if (save_delete) {
        let response = success_function({
          status: 200,
          message: `Organization deleted`,
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
        status: 400,
        message: "Already deleted",
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

exports.addNewExternalService = async function (req, res) {
  try {
    const authHeader = req.headers["authorization"];
    let token = authHeader ? authHeader.split(" ")[1] : null;
    let decoded = jwt.decode(token);

    let service = req.body.service;

    if (!service) {
      let response = error_function({
        status: 400,
        message: "Service is required",
      });
      res.status(response.statusCode).send(response);
      return;
    }

    //Getting organization_id and user_type of the login user
    let user = await users
      .findOne({ $and: [{ _id: decoded.user_id }, { deleted: { $ne: true } }] })
      .populate("user_type");
    let user_type = user.user_type.user_type;
    // let organization_id = user.organization;

    //console.log("Login user : ", user);
    //console.log("User Type : ", user_type);
    // //console.log("Organization id : ", organization_id);

    // if (!organization_id) {
    //   let response = error_function({
    //     status: 400,
    //     message: "Organization not found",
    //   });
    //   res.status(response.statusCode).send(response);
    //   return;
    // }

    let isFound = await external_services.findOne({
      $and: [
        // { service: { $regex: service, $options: "i" } },
        { service: { $regex: new RegExp("^" + service + "$", "i") } },
        { deleted: { $ne: true } },
      ],
    });

    if (isFound) {
      let response = error_function({
        status: 400,
        message: "Service already found",
      });
      res.status(response.statusCode).send(response);
      return;
    }

    let doc = {};

    doc["service"] = service;

    //console.log("doc : ", doc);

    let save_service = await new external_services(doc);
    let saved = await save_service.save();

    //console.log("Saved : ", saved);

    if (saved) {
      let response = success_function({
        status: 201,
        data: save_service,
        message: "Service added successfully",
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

exports.fetchAllExternalServices = async function (req, res) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader ? authHeader.split(" ")[1] : null;
    let decoded = jwt.decode(token);

    let count = Number(await external_services.count());
    //console.log("Count : ", count);

    const pageNumber = req.query.page || 1;
    const pageSize = req.query.pageSize || count;

    let keyword = req.query.keyword;
    let id = req.query.id;

    let filters = [];

    if (keyword) {
      filters.push({ service: { $regex: keyword, $options: "i" } });
    }

    if (id) {
      filters.push({ _id: id });
    }

    //Getting organization_id and user_type of the login user
    let user = await users
      .findOne({ $and: [{ _id: decoded.user_id }, { deleted: { $ne: true } }] })
      .populate("user_type");
    let user_type = user.user_type.user_type;
    // let organization_id = user.organization;

    //console.log("Login user : ", user);
    //console.log("User Type : ", user_type);
    // //console.log("Organization id : ", organization_id);

    // if (!organization_id) {
    //   let response = error_function({
    //     status: 404,
    //     message: "Organization not found",
    //   });
    //   res.status(response.statusCode).send(response);
    //   return;
    // }

    //If user type not equals admin, then find users of that particular organizaton only, add organization_id to filters if user is not admin
    if (user_type !== "admin") {
      // filters.push({ organization: organization_id });
      //console.log("User not admin");
    } else {
      //console.log("User is admin");
    }

    //For eliminating deleted service
    filters.push({ deleted: { $ne: true } });

    //console.log("Filters : ", filters);

    let services_data = await external_services
      .find(filters.length > 0 ? { $and: filters } : null)
      .sort({ _id: -1 })
      .select("-createdAt -updatedAt -__v")
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize);

    if (services_data) {
      let count = await external_services.count(
        filters.length > 0 ? { $and: filters } : null
      );
      let total_pages = Math.ceil(count / pageSize);
      let data = {
        count: count,
        total_pages: total_pages,
        currentPage: pageNumber,
        datas: services_data,
      };

      let response = success_function({
        status: 200,
        data: data,
        message: "Services fetched successfully",
      });
      res.status(response.statusCode).send(response);
      return;
    } else {
      let response = error_function({
        status: 404,
        message: "Data not found",
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

exports.fetchSingleExternalService = async function (req, res) {
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
    // let organization_id = user.organization;

    //console.log("Login user : ", user);
    //console.log("User Type : ", user_type);
    // //console.log("Organization id : ", organization_id);

    // if (!organization_id) {
    //   let response = error_function({
    //     status: 404,
    //     message: "Organization not found",
    //   });
    //   res.status(response.statusCode).send(response);
    //   return;
    // }

    if (token && id) {
      let service_data = await external_services
        .findOne({
          $and: [{ _id: id }, { deleted: { $ne: true } }],
        })
        .select("-createdAt -updatedAt -__v");

      if (service_data) {
        let response = success_function({
          status: 200,
          data: service_data,
          message: "Service fetched successfully",
        });

        res.status(response.statusCode).send(response);
        return;
      } else {
        let response = error_function({
          status: 404,
          message: "Service not found",
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

exports.updateExternalService = async function (req, res) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader ? authHeader.split(" ")[1] : null;
    let decoded = jwt.decode(token);

    let filters = [];

    let id = req.params.id;
    let service = req.body.service;

    if (!service) {
      let response = error_function({
        status: 404,
        message: "Updated service is required",
      });
      res.status(response.statusCode).send(response);
      return;
    }

    if (id) {
      filters.push({ _id: id });
    } else {
      let response = error_function({
        status: 404,
        message: "Service id is required",
      });
      res.status(response.statusCode).send(response);
      return;
    }

    let user = await users
      .findOne({ $and: [{ _id: decoded.user_id }, { deleted: { $ne: true } }] })
      .populate("user_type");

    let user_type = user.user_type.user_type;
    // let organization_id = user.organization;

    //console.log("Login user : ", user);
    //console.log("User Type : ", user_type);
    // //console.log("Organization id : ", organization_id);

    // if (!organization_id) {
    //   let response = error_function({
    //     status: 404,
    //     message: "Organization not found",
    //   });
    //   res.status(response.statusCode).send(response);
    //   return;
    // } else {
    //If user type not equals admin, then find users of that particular organizaton only, add organization_id to filters if user is not admin
    if (user_type !== "admin") {
      // filters.push({ organization: organization_id });
      //console.log("User not admin");
    } else {
      //console.log("User is admin");
    }

    //For eliminating deleted email_service
    filters.push({ deleted: { $ne: true } });

    //console.log("Filters : ", filters);

    let isFound = await external_services.findOne({
      $and: [
        // { service: { $regex: service, $options: "i" } },
        { service: { $regex: new RegExp("^" + service + "$", "i") } },
        { deleted: { $ne: true } },
      ],
    });

    if (isFound) {
      let response = error_function({
        status: 400,
        message: "Service already found",
      });
      res.status(response.statusCode).send(response);
      return;
    }

    //console.log("Service : ", service);
    let updated = await external_services.updateOne(
      filters.length > 0 ? { $and: filters } : null,
      { $set: { service } },
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
        message: "Update successful",
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
    // }
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

exports.deleteExternalService = async function (req, res) {
  try {
    const authHeader = req.headers["authorization"];
    let token = authHeader ? authHeader.split(" ")[1] : null;
    let decoded = jwt.decode(token);

    let user = await users
      .findOne({ $and: [{ _id: decoded.user_id }, { deleted: { $ne: true } }] })
      .populate("user_type");

    let user_type = user.user_type.user_type;
    // let organization_id = user.organization;

    //console.log("Login user : ", user);
    //console.log("User Type : ", user_type);
    // //console.log("Organization id : ", organization_id);

    // if (!organization_id) {
    //   let response = error_function({
    //     status: 404,
    //     message: "Organization not found",
    //   });
    //   res.status(response.statusCode).send(response);
    //   return;
    // }

    let target_id = req.params.id; // Should be an array

    if (!target_id) {
      let response = error_function({
        status: 404,
        message: "Id is required",
      });
      res.status(response.statusCode).send(response);
      return;
    }

    let target_data = await external_services.findOne({
      $and: [{ _id: target_id }, { deleted: { $ne: true } }],
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
          message: `Delete successful`,
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

// exports.enableExternalService = async function (req, res) {
//   try {
//     const authHeader = req.headers["authorization"];
//     let token = authHeader ? authHeader.split(" ")[1] : null;
//     let decoded = jwt.decode(token);

//     let service_id = req.body.service_id; //For security using req.body instead of params

//     if (!service_id) {
//       let response = error_function({
//         status: 400,
//         message: "Service id is required",
//       });
//       res.status(response.statusCode).send(response);
//       return;
//     }

//     let user = await users
//       .findOne({ $and: [{ _id: decoded.user_id }, { deleted: { $ne: true } }] })
//       .populate("user_type");

//     if (!user) {
//       let response = error_function({
//         status: 404,
//         message: "User not found",
//       });
//       res.status(response.statusCode).send(response);
//       return;
//     }

//     let user_type = user.user_type.user_type;
//     var organization_id = user.organization;

//     //console.log("Login user : ", user);
//     //console.log("User Type : ", user_type);
//     //console.log("Organization id : ", organization_id);

//     if (!organization_id) {
//       let response = error_function({
//         status: 404,
//         message: "Organization not found",
//       });
//       res.status(response.statusCode).send(response);
//       return;
//     }

//     //Checking if service already enabled or not
//     const isFound = await organizations.find({
//       $and: [
//         {
//           _id: organization_id,
//         },
//         { deleted: { $ne: true } },
//         {
//           external_services: {
//             $elemMatch: { service_id: { $eq: service_id } },
//           },
//         },
//       ],
//     });

//     console.log("Reached here..");

//     let found_flag;

//     console.log("isFound : ", isFound);

//     if (Number(isFound.length) > Number(0)) {
//       for (let i = 0; i < isFound.length; i++) {
//         let service_id_converted = new mongoose.Types.ObjectId(service_id);
//         console.log("Service_id converted : ", service_id_converted);
//         let objs = isFound[i];
//         console.log("objs : ", objs);
//         let foundIndex = false;

//         for (let j = 0; j < objs.length; j++) {
//           console.log("objs.service_id : ", objs[j].service_id);
//           if (objs[j].toString() === service_id.toString()) {
//             foundIndex = true;
//             break;
//           }
//         }

//         if (foundIndex) {
//           found_flag = true;

//           let response = error_function({
//             status: 409,
//             message: "Already found",
//           });
//           res.status(response.statusCode).send(response);
//           return;
//         }
//       }
//     }

//     //First time enable request
//     if (!found_flag) {
//       let service_obj = {};

//       if (service_id.toString() === "64a3e8efaf6c697ec74d632b") {
//         console.log("Enable zoho request...");

//         let client_id;
//         let client_secret;

//         //Checking if client id and client secret already in database or not
//         let organization = await organizations.findOne({
//           $and: [{ _id: organization_id }, { deleted: { $ne: true } }],
//         });

//         client_id = organization.zoho_client_id;
//         client_secret = organization.client_secret;

//         if (!client_id) {
//           client_id = req.body.client_id;
//         }

//         // client_id = "1000.UUK8YFOIG0BOHX0TMI3NHMDJD28SRI";
//         //  client_secret = "01dd2a184d67c05266dcb635a65b3505b863671245";

//         //   var client_id = req.body.client_id;
//         // var client_secret = req.body.client_secret;

//         // if (!client_id) {
//         //   let response = error_function({
//         //     status: 400,
//         //     message: "Client id is required",
//         //   });
//         //   res.status(response.statusCode).send(response);
//         //   return;
//         // }

//         // if (!client_secret) {
//         //   let response = error_function({
//         //     status: 400,
//         //     message: "Client secret is required",
//         //   });
//         //   res.status(response.statusCode).send(response);
//         //   return;
//         // }

//         service_obj["client_id"] = client_id;
//         service_obj["client_secret"] = client_secret;

//         //Authorization url for getting zoid
//         var authorization_uri_zoid = `https://accounts.zoho.in/oauth/v2/auth?scope=ZohoMail.partner.organization.ALL&client_id=${client_id}&response_type=code&access_type=offline&prompt=consent&redirect_uri=http://localhost:5000/auth/zoho/account/zoid/callback/${organization_id}`;
//         var updated_redirect_uri_zoid = `http://localhost:5000/auth/zoho/account/zoid/callback/${organization_id}`;

//         //Authorization url for getting refresh token for creating account
//         var authorization_uri_account = `https://accounts.zoho.in/oauth/v2/auth?scope=ZohoMail.partner.organization.ALL&client_id=${client_id}&response_type=code&access_type=offline&prompt=consent&redirect_uri=http://localhost:5000/auth/zoho/account/zoid/callback/${organization_id}`;
//         var updated_redirect_uri_account = `http://localhost:5000/auth/zoho/account/create/callback/${organization_id}`;

//         service_obj["redirect_uri_zoid"] = updated_redirect_uri_zoid;
//         service_obj["redirect_uri_account"] = updated_redirect_uri_account;
//       }

//       service_obj["service_id"] = service_id;

//       console.log("Service object : ", service_obj);

//       //Send the zoho url for user consent here

//       //Insert id in the external service array of organizations model
//       let insert_id = await organizations.findOneAndUpdate(
//         { $and: [{ _id: organization_id }, { deleted: { $ne: true } }] },
//         { $push: { external_services: service_obj } },
//         { new: true }
//       );

//       let change_status = await organizations.findOneAndUpdate(
//         { $and: [{ _id: organization_id }, { deleted: { $ne: true } }] },
//         { zoho_status: "enabled" },
//         { new: true }
//       );

//       //console.log("Inserted id : ", insert_id);
//       if (insert_id) {
//         let response = success_function({
//           status: 200,
//           data: insert_id,
//           message: "Success",
//         });

//         response.alert =
//           "Update redirect_uri first , then call authorization_uri";
//         // response.updated_redirect_uri = updated_redirect_uri;
//         // response.authorization_uri = authorization_uri;
//         response.redirect_uri_for_zoid = updated_redirect_uri_zoid;
//         response.authorization_uri_for_zoid = authorization_uri_zoid;
//         response.redirect_uri_for_account_create = updated_redirect_uri_account;
//         response.authorization_uri_for_account = authorization_uri_account;

//         res.status(response.statusCode).send(response);
//         return;
//       } else {
//         let response = error_function({
//           status: 400,
//           message: "Failed",
//         });
//         res.status(response.statusCode).send(response);
//         return;
//       }
//     } else {
//       let response = error_function({
//         status: 409,
//         message: "Already found",
//       });
//       res.status(response.statusCode).send(response);
//       return;
//     }
//   } catch (error) {
//     console.log("Error : ", error);
//     if (process.env.NODE_ENV == "production") {
//       let response = error_function({
//         status: 400,
//         message: error
//           ? error.message
//             ? error.message
//             : error
//           : "Something went wrong",
//       });

//       res.status(response.statusCode).send(response);
//       return;
//     } else {
//       let response = error_function({ status: 400, message: error });
//       res.status(response.statusCode).send(response);
//       return;
//     }
//   }
// };

exports.enableExternalService = async function (req, res) {
  try {
    const authHeader = req.headers["authorization"];
    let token = authHeader ? authHeader.split(" ")[1] : null;
    let decoded = jwt.decode(token);

    let service_id = req.body.service_id;

    if (!service_id) {
      let response = error_function({
        status: 400,
        message: "Service id is required",
      });
      res.status(response.statusCode).send(response);
      return;
    }

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
    var organization_id = user.organization;

    if (!organization_id) {
      let response = error_function({
        status: 404,
        message: "Organization not found",
      });
      res.status(response.statusCode).send(response);
      return;
    }

    let service_obj = {};

    if (service_id.toString() === "64a3e8efaf6c697ec74d632b") {
      console.log("Enable zoho request ...");

      let client_id = req.body.client_id;
      let client_secret = req.body.client_secret;

      if (!client_id) {
        let response = error_function({
          status: 400,
          message: "Client id is required",
        });
        res.status(response.statusCode).send(response);
        return;
      }

      if (!client_secret) {
        let response = error_function({
          status: 400,
          message: "Client secret is required",
        });
        res.status(response.statusCode).send(response);
        return;
      }

      service_obj["service_id"] = service_id;
      service_obj["status"] = "enabled";

      // let update = await organizations.findOneAndUpdate({
      //   { $and: [{ _id: organization_id }, { deleted: { $ne: true } }] },
      // });

      //Authorization url for getting zoid and refresh token for creating email account
      var updated_redirect_uri_zoid = `http://localhost:5000/auth/zoho/account/zoid/callback/${organization_id}`;
      var authorization_uri_zoid = `https://accounts.zoho.in/oauth/v2/auth?scope=ZohoMail.partner.organization.ALL&client_id=${client_id}&response_type=code&access_type=offline&prompt=consent&redirect_uri=http://localhost:5000/auth/zoho/account/zoid/callback/${organization_id}`;

      //Saving service_obj to database
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

exports.disableExternalService = async function (req, res) {
  try {
    const authHeader = req.headers["authorization"];
    let token = authHeader ? authHeader.split(" ")[1] : null;
    let decoded = jwt.decode(token);

    let service_id = req.body.service_id; //For security using req.body instead of params

    if (!service_id) {
      let response = error_function({
        status: 400,
        message: "Service id is required",
      });
      res.status(response.statusCode).send(response);
      return;
    }

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

    if (!organization_id) {
      let response = error_function({
        status: 404,
        message: "Organization not found",
      });
      res.status(response.statusCode).send(response);
      return;
    }

    //Checking if service already enabled or not
    // const isFound = await organizations.find({
    //   $and: [
    //     {
    //       _id: organization_id,
    //     },
    //     { deleted: { $ne: true } },
    //     {
    //       external_services: {
    //         $elemMatch: { $eq: service_id },
    //       },
    //     },
    //   ],
    // });

    // let found_flag;

    // if (Number(isFound.length) > Number(0)) {
    //   for (let i = 0; i < isFound.length; i++) {
    //     //console.log("IsFound : ", isFound);

    //     let foundIndex = isFound[i].external_services.indexOf(service_id);

    //     if (foundIndex !== -1) {
    //       //console.log(`Found at index ${foundIndex} in document with ID ${isFound._id}`);

    //       found_flag = true;
    //     }
    //   }
    // }

    //Checking if service already enabled or not
    const isFound = await organizations.find({
      $and: [
        {
          _id: organization_id,
        },
        { deleted: { $ne: true } },
        {
          external_services: {
            $elemMatch: { service_id: { $eq: service_id } },
          },
        },
      ],
    });

    console.log("Reached here..");

    let found_flag;

    console.log("isFound : ", isFound);

    if (Number(isFound.length) > Number(0)) {
      for (let i = 0; i < isFound.length; i++) {
        //console.log("IsFound : ", isFound);

        let service_id_converted = new mongoose.Types.ObjectId(service_id);
        console.log("Service_id converted : ", service_id_converted);
        // console.log("isFound[i].external_services : ", isFound[i].external_services);
        let objs = isFound[i].external_services;
        console.log("objs : ", objs);
        // let foundIndex = isFound[i].external_services.indexOf(service_id_converted);
        // let foundIndex = isFound[i].external_services.findIndex(
        //   (service) => service.service_id === service_id_converted
        // );
        let foundIndex = false;
        for (let j = 0; j < objs.length; j++) {
          console.log("objs.service_id : ", objs[j].service_id);
          if (objs[j].service_id.toString() === service_id.toString()) {
            foundIndex = true;
            break;
          }
        }

        // ...

        // console.log("Found index : ", foundIndex);
        if (foundIndex) {
          // if (found_flag) {
          //console.log(`Found at index ${foundIndex} in document with ID ${isFound._id}`);

          found_flag = true;

          // let response = error_function({
          //   status: 409,
          //   message: "Already found",
          // });
          // res.status(response.statusCode).send(response);
          // return;
        }
      }
    }

    if (found_flag) {
      //Insert id in the external service array of organizations model
      // let remove_id = await organizations.findOneAndUpdate(
      //   { $and: [{ _id: organization_id }, { deleted: { $ne: true } }] },
      //   { $pull: { external_services: service_id } },
      //   { new: true }
      // );

      let change_status = await organizations.findOneAndUpdate(
        { $and: [{ _id: organization_id }, { deleted: { $ne: true } }] },
        { zoho_status: "disabled" },
        { new: true }
      );
      //console.log("Inserted id : ", remove_id);

      if (change_status) {
        let response = success_function({
          status: 200,
          data: change_status,
          message: "Success",
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

exports.zohoCallBackZoid = async function (req, res) {
  try {
    console.log("Zoho sign in callback...");

    let code = req.query.code.toString();
    let organization_id = req.params.organization_id;

    console.log("Auth code for sign in :", code);
    console.log("Organization id : ", organization_id);

    let organization_id_converted = new mongoose.Types.ObjectId(
      organization_id
    );
    console.log("Converted oranization_id : ", organization_id_converted);

    let organization = await organizations.findOne({
      $and: [{ _id: organization_id_converted }, { deleted: { $ne: true } }],
    });

    console.log("Organization : ", organization);

    let external_services = organization.external_services;

    console.log("External_services : ", external_services);

    function findObjectByField(array, field, value) {
      return array.find((obj) => obj[field].toString() === value.toString());
    }

    //Finding zoho object from external services array in organizations model
    let service_id = new mongoose.Types.ObjectId("64a3e8efaf6c697ec74d632b");
    let service_object = findObjectByField(
      external_services,
      "service_id",
      service_id
    );

    console.log("Service object : ", service_object);
    let client_id = service_object.client_id;
    let client_secret = service_object.client_secret;
    let redirect_uri = service_object.redirect_uri_zoid;
    // let redirect_uri = 'http://localhost:5000/auth/zoho/account/zoid/callback/649bd1298611e269447532ff'

    console.log("Client_id : ", client_id);
    console.log("Client_secret : ", client_secret);
    console.log("Redirect uri : ", redirect_uri);
    console.log("Auth code for sign in :", code);

    //Url for getting refresh token for finding organization id zoid by using the particular scope in query params
    console.log(
      "Post url for zoid : ",
      `https://accounts.zoho.in/oauth/v2/token?code=${code}&client_secret=${client_secret}&client_id=${client_id}&redirect_uri=${redirect_uri}&grant_type=authorization_code&scope=ZohoMail.partner.organization.ALL`
    );

    //Get access toke and refresh token for getting zoid
    const zoid_response = await axios.post(
      `https://accounts.zoho.in/oauth/v2/token?code=${code}&client_secret=${client_secret}&client_id=${client_id}&redirect_uri=${redirect_uri}&grant_type=authorization_code&scope=ZohoMail.partner.organization.ALL`
    );

    const zoid_accessToken = zoid_response.data.access_token;
    const zoid_refreshToken = zoid_response.data.refresh_token;

    console.log("Zoid AccessToken : ", zoid_accessToken);
    console.log(" ZoidRefreshToken : ", zoid_refreshToken);

    //Using this access token for getting zoid
    let zoid_response1 = await axios.get(
      `https://mail.zoho.in/api/organization`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${zoid_accessToken}`,
        },
      }
    );

    // console.log("zoid_response : ", zoid_response1.data);

    let zoid = zoid_response1.data.data.zoid;
    console.log("Zoid : ", zoid);

    if (zoid) {
      //Save to that particular organization database
      console.log(
        "Initial callback executed by organization admin to generate zoid : authtoken with scope for getting organization id or zoid..."
      );

      let save_zoid = await organizations.updateOne(
        {
          $and: [
            { _id: organization_id_converted },
            { deleted: { $ne: true } },
          ],
        },
        { zoho_zoid: zoid },
        { new: true }
      );

      if (
        Number(save_zoid.modifiedCount) == 1 &&
        Number(save_zoid.matchedCount) == 1
      ) {
        let response = success_function({
          status: 200,
          message: "zoid saved successfully",
        });
        res.status(response.statusCode).send(response);
        return;
      } else {
        let response = error_function({
          status: 400,
          message: "zoid not saved",
        });
        res.status(response.statusCode).send(response);
        return;
      }
    } else {
      console.log("Callback not part of generating zoid");
    }
  } catch (error) {
    console.log("Error : ", error);
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

exports.zohoCallBackCreate = async function (req, res) {
  try {
    console.log("Zoho sign in callback...");

    let code = req.query.code.toString();
    let organization_id = req.params.organization_id;

    console.log("Auth code for sign in :", code);
    console.log("Organization id : ", organization_id);

    let organization_id_converted = new mongoose.Types.ObjectId(
      organization_id
    );
    console.log("Converted oranization_id : ", organization_id_converted);

    let organization = await organizations.findOne({
      $and: [{ _id: organization_id_converted }, { deleted: { $ne: true } }],
    });

    console.log("Organization : ", organization);

    let external_services = organization.external_services;

    console.log("External_services : ", external_services);

    function findObjectByField(array, field, value) {
      return array.find((obj) => obj[field].toString() === value.toString());
    }

    //Finding zoho object from external services array in organizations model
    let service_id = new mongoose.Types.ObjectId("64a3e8efaf6c697ec74d632b");
    let service_object = findObjectByField(
      external_services,
      "service_id",
      service_id
    );

    console.log("Service object : ", service_object);
    let client_id = service_object.client_id;
    let client_secret = service_object.client_secret;
    let redirect_uri = service_object.redirect_uri_account;
    // let redirect_uri = 'http://localhost:5000/auth/zoho/account/create/callback/649bd1298611e269447532ff'

    console.log("Client_id : ", client_id);
    console.log("Client_secret : ", client_secret);
    console.log("Redirect uri : ", redirect_uri);
    console.log("Auth code for sign in :", code);

    //Requests for creating accounts, Getting the refresh token for creating zoho account with a seperate scope
    console.log(
      "Post url for creating zoho account : ",
      `https://accounts.zoho.in/oauth/v2/token?code=${code}&client_secret=${client_secret}&client_id=${client_id}&redirect_uri=${redirect_uri}&grant_type=authorization_code&scope=ZohoMail.organization.accounts.CREATE `
    );

    const account_response = await axios.post(
      `https://accounts.zoho.in/oauth/v2/token?code=${code}&client_secret=${client_secret}&client_id=${client_id}&redirect_uri=${redirect_uri}&grant_type=authorization_code&scope=ZohoMail.organization.accounts.CREATE `
    );

    let account_access_token = account_response.data.access_token;
    let account_refresh_token = account_response.data.refresh_token;

    console.log("Account access token : ", account_access_token);
    console.log("Account refresh token : ", account_refresh_token);

    if (account_refresh_token) {
      console.log(
        "Callback as a part of account creation : authcode with scope for account creation in an organization..."
      );

      let save_account_refresh_token = await organizations.updateOne(
        {
          $and: [
            { _id: organization_id_converted },
            { deleted: { $ne: true } },
          ],
        },
        { zoho_account_refresh_token: account_refresh_token },
        { new: true }
      );

      console.log("Save refresh token : ", save_account_refresh_token);
      if (
        Number(save_account_refresh_token.modifiedCount) == 1 &&
        Number(save_account_refresh_token.matchedCount) == 1
      ) {
        let response = success_function({ status: 200, message: "Success" });
        res.status(response.statusCode).send(response);
        return;
      } else {
        let response = error_function({ status: 400, message: "Failed" });
        res.status(response.statusCode).send(response);
        return;
      }
    } else {
      console.log(
        "Callback not as a part of creating email account for a user in an organization..."
      );
    }
  } catch (error) {
    console.log("Error : ", error);
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

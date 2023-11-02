const success_function = require("../utils/response-handler").success_function;
const error_function = require("../utils/response-handler").error_function;
const users = require("../db/models/users");
const userDocumentTypesModel = require("../db/models/user_document_types");
const systemDocumentTypesModel = require("../db/models/system_document_types");
const fileUpload = require("../utils/file-upload").fileUpload;
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const jwt = require("jsonwebtoken");
const dayjs = require('dayjs');
const { ObjectId } = require('mongodb');

exports.addNewUserDocumentType = async function (req, res) {
  try {
    const authHeader = req.headers["authorization"];
    let token = authHeader ? authHeader.split(" ")[1] : null;
    let decoded = jwt.decode(token);

    let document_type = req.body.document_type;

    if (!document_type) {
      let response = error_function({
        status: 400,
        message: "Document type is required",
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

    let isFound = await userDocumentTypesModel.findOne({
      $and: [
        // { document_type: { $regex: document_type, $options: "i" } },
        { document_type: { $regex: new RegExp("^" + document_type + "$", "i") } },
        { deleted: { $ne: true } },
        { organization: organization_id },
      ],
    });

    if (isFound) {
      let response = error_function({
        status: 409,
        message: "Document type already found",
      });
      res.status(response.statusCode).send(response);
      return;
    }

    let doc = {};

    doc["organization"] = organization_id;
    doc["document_type"] = document_type;

    //console.log("doc : ", doc);

    let save_document_type = await new userDocumentTypesModel(doc);
    let saved = await save_document_type.save();

    //console.log("Saved : ", saved);

    if (saved) {
      let response = success_function({
        status: 201,
        data: save_document_type,
        message: "Document type added successfully",
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

exports.fetchAllUserDocumentType = async function (req, res) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader ? authHeader.split(" ")[1] : null;
    let decoded = jwt.decode(token);

    let count = Number(await userDocumentTypesModel.count());
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

    let documents_data = await userDocumentTypesModel
      .find(filters.length > 0 ? { $and: filters } : null)
      .sort({_id : -1})
      .select("-createdAt -updatedAt -__v")
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize);

    if (documents_data) {
      let count = await userDocumentTypesModel.count(
        filters.length > 0 ? { $and: filters } : null
      );
      let total_pages = Math.ceil(count / pageSize);
      let data = {
        count: count,
        total_pages: total_pages,
        currentPage: pageNumber,
        datas: documents_data,
      };

      let response = success_function({
        status: 200,
        data: data,
        message: "Document types fetched successfully",
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

exports.fetchSingleUserDocumentType = async function (req, res) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader ? authHeader.split(" ")[1] : null;
    let decoded = jwt.decode(token);
    let id = req.params.id;

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

    if (token && id) {
      let document_data = await userDocumentTypesModel
        .findOne({
          $and: [
            { _id: id },
            { deleted: { $ne: true } },
            { organization: organization_id },
          ],
        })
        .select("-createdAt -updatedAt -__v");

      if (document_data) {
        let response = success_function({
          status: 200,
          data: document_data,
          message: "Document type fetched successfully",
        });

        res.status(response.statusCode).send(response);
        return;
      } else {
        let response = error_function({
          status: 404,
          message: "Document type not found",
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

exports.updateUserDocumentType = async function (req, res) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader ? authHeader.split(" ")[1] : null;
    let decoded = jwt.decode(token);

    let filters = [];

    let id = req.params.id;
    let document_type = req.body.document_type;

    if (!document_type) {
      let response = error_function({
        status: 404,
        message: "Updated document type is required",
      });
      res.status(response.statusCode).send(response);
      return;
    }

    if (id) {
      filters.push({ _id: id });
    } else {
      let response = error_function({
        status: 404,
        message: "Document type id is required",
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

      let isFound = await userDocumentTypesModel.findOne({
        $and: [
          // { document_type: { $regex: document_type, $options: "i" } },
          { document_type: { $regex: new RegExp("^" + document_type + "$", "i") } },
          { deleted: { $ne: true } },
          { organization: organization_id },
        ],
      });

      if (isFound) {
        let response = error_function({
          status: 400,
          message: "Document type already found",
        });
        res.status(response.statusCode).send(response);
        return;
      }

      //console.log("Document type : ", document_type);
      let updated = await userDocumentTypesModel.updateOne(
        filters.length > 0 ? { $and: filters } : null,
        { $set: { document_type } },
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
          message: "Document type updated successfully",
        });
        res.status(response.statusCode).send(response);
        return;
      } else {
        let response = error_function({
          status: 400,
          message: "Document type not updated",
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

exports.deleteUserDocumentType = async function (req, res) {
  try {
    const authHeader = req.headers["authorization"];
    let token = authHeader ? authHeader.split(" ")[1] : null;
    let decoded = jwt.decode(token);

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

    let target_id = req.params.id; // Should be an array

    if (!target_id) {
      let response = error_function({
        status: 404,
        message: "Id is required",
      });
      res.status(response.statusCode).send(response);
      return;
    }

    let target_data = await userDocumentTypesModel.findOne({
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
          message: `Document type deleted`,
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

exports.uploadNewUserDocument = async function (req, res) {
  try {
    const authHeader = req.headers["authorization"];
    let token = authHeader ? authHeader.split(" ")[1] : null;
    let decoded = jwt.decode(token);

    let document_type_id = req.body.document_type_id;
    let document = req.body.document;

    if (!document_type_id) {
      let response = error_function({
        status: 400,
        message: "Document type id  is required",
      });
      res.status(response.statusCode).send(response);
      return;
    }

    if (!document) {
      let response = error_function({
        status: 400,
        message: "Document is required",
      });
      res.status(response.statusCode).send(response);
      return;
    }

    let doc = {};

    doc["document_type"] = document_type_id;

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

    //If organization user_type then user_id is required in req body, else get id get from token, and upload the document for that user_id
    let user_id;
    let self_flag;
    if (user_type == "organization") {
      // filters.push({ organization: organization_id });
      //console.log("User_type is organization...");
      self_flag = req.body.self_flag;
      if (self_flag !== "true") {
        let target_user_id = req.body.target_user_id;

        if (!target_user_id) {
          let response = error_function({
            status: 400,
            message: "Target user id is required",
          });
          res.status(response.statusCode).send(response);
          return;
        }

        //Getting organization_id and user_type of the target user
        let target_user = await users
          .findOne({
            $and: [{ _id: target_user_id }, { deleted: { $ne: true } }],
          })
          .populate("user_type")
          .select("-createdAt -updatedAt -password");

        if (!target_user) {
          let response = error_function({
            status: 404,
            message: "Target user not found",
          });
          res.status(response.statusCode).send(response);
          return;
        }

        let target_organization_id = target_user.organization;

        if (!target_organization_id) {
          let response = error_function({
            status: 404,
            message: "Target user organization not found",
          });
          res.status(response.statusCode).send(response);
          return;
        }

        let org1 = organization_id.toString();
        let org2 = target_organization_id.toString();
        //console.log("Organization id : ", organization_id.toString());
        //console.log("Target_organization_id : ", target_organization_id.toString());
        if (org1 !== org2) {
          let response = error_function({
            status: 400,
            message: "Wrong organization",
          });
          res.status(response.statusCode).send(response);
          return;
        }

        user_id = target_user_id;
      } else {
        user_id = decoded.user_id;
      }
    } else if (user_type == "employee") {
      //console.log("User is an employee...");
      user_id = decoded.user_id;
    }else {
      let response = error_function({
        status: 400,
        message: "User type error",
      });
      res.status(response.statusCode).send(response);
      return;
    }

    //Checking if document type already exists or not
    // const target_isFound = await users.find({
    //   $and: [
    //     {
    //       _id: user_id,
    //     },
    //     { deleted: { $ne: true } },
    //     { organization: organization_id },
    //     {
    //         documents: {
    //             $elemMatch: { document_type: document_type_id },
    //           },
    //     },
    //   ],
    // });
let check_id = new ObjectId(document_type_id)
    //console.log("document_type_id : ",  check_id);

    const target_isFound = await users.find({
        _id: user_id,
        deleted: { $ne: true },
        organization: organization_id,
        documents: {
          $elemMatch: { document_type: check_id },
        },
      });
      
      //console.log("Target isFound : ", target_isFound);

    let target_found_flag;

    if (Number(target_isFound.length) > Number(0)) {
      // found_flag = true;
      // for (let i = 0; i < target_isFound.length; i++) {
      //   //console.log("target_isFound : ", target_isFound);

      //   let foundIndex = target_isFound[i].documents.indexOf({
      //     document_type: document_type_id,
      //   });

      //   if (foundIndex !== -1) {
      //     //console.log(
      //       `Found at index ${foundIndex} in document with ID ${isFound._id}`
      //     );

      //     target_found_flag = true;

      //     let response = error_function({
      //       status: 409,
      //       message: "Already found",
      //     });
      //     res.status(response.statusCode).send(response);
      //     return;
      //   }
      // }
      target_found_flag = true;
    } else {
      //console.log("Document type not found, unique");
    }

    if (!target_found_flag) {
      //Upload document
      let file = await fileUpload(document, "user_documents");
      doc["document"] = file;

      let user_id_1 = new ObjectId(user_id);
      let organization_id_1 = organization_id.toString();
      //console.log("Doc : ", doc);
      //console.log("User_id : ", user_id);
      //console.log("user_id_1 : ", user_id_1);
      //console.log("oranization_id : ", organization_id);
      //console.log("oranization_id_1 : ", organization_id_1);
      //console.log("Self flag : ", self_flag);
      let updated = await users.findOneAndUpdate(
        {
          $and: [
            { _id: user_id_1 },
            { organization: organization_id },
            { deleted: { $ne: true } },
          ],
        },
        {$push: { documents: doc } },
        {
          new: true,
        }
      ).select('-createdAt -updatedAt -password');

      //console.log("Updated : ", updated);
      if (updated) {
        let response = success_function({
          status: 200,
          data: updated,
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
        status: 409,
        message: "Already found",
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


exports.removeUserDocument = async function (req, res) {
  try {

    const authHeader = req.headers["authorization"];
    let token = authHeader ? authHeader.split(" ")[1] : null;
    let decoded = jwt.decode(token);

    let target_document_id = req.body.target_document_id;

    if (!target_document_id) {
      let response = error_function({
        status: 400,
        message: "Targetdocument type id  is required",
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

    let user_id;
    let self_flag;

    if (user_type == "organization") {
      //console.log("User_type is organization...");
      self_flag = req.body.self_flag;

      if (self_flag !== "true") { 

        let target_user_id = req.body.target_user_id;

        if (!target_user_id) {
          let response = error_function({
            status: 400,
            message: "Target user id is required",
          });
          res.status(response.statusCode).send(response);
          return;
        }

        
        //Getting organization_id and user_type of the target user
        let target_user = await users
          .findOne({
            $and: [{ _id: target_user_id }, { deleted: { $ne: true } }],
          })
          .populate("user_type")
          .select("-createdAt -updatedAt -password");

        if (!target_user) {
          let response = error_function({
            status: 404,
            message: "Target user not found",
          });
          res.status(response.statusCode).send(response);
          return;
        }

        let target_organization_id = target_user.organization;

        if (!target_organization_id) {
          let response = error_function({
            status: 404,
            message: "Target user organization not found",
          });
          res.status(response.statusCode).send(response);
          return;
        }

        let org1 = organization_id.toString();
        let org2 = target_organization_id.toString();
        //console.log("Organization id : ", organization_id.toString());
        //console.log("Target_organization_id : ", target_organization_id.toString());

        if (org1 !== org2) {
          let response = error_function({
            status: 400,
            message: "Wrong organization",
          });
          res.status(response.statusCode).send(response);
          return;
        }
        user_id = target_user_id;


      }else {
        user_id = decoded.user_id;
      }


    }else if (user_type == "employee") {
      //console.log("User is an employee...");
      user_id = decoded.user_id;
    }else {
      let response = error_function({
        status: 400,
        message: "User type error",
      });
      res.status(response.statusCode).send(response);
      return;
    }

    let check_id = new ObjectId(target_document_id)
    //console.log("document_type_id : ",  check_id);

    const target_isFound = await users.find({
      _id: user_id,
      deleted: { $ne: true },
      organization: organization_id,
      documents: {
        $elemMatch: { _id: check_id },
      },
    });
    
    //console.log("Target isFound : ", target_isFound);

    let target_found_flag;

    if (Number(target_isFound.length) > Number(0)) {
      target_found_flag = true;
    } else {
      //console.log("Document type not found, unique");
    }


    if (target_found_flag) {

      let user_id_1 = new ObjectId(user_id);
      let organization_id_1 = organization_id.toString();
      // //console.log("Doc : ", doc);
      //console.log("user_id : ", user_id_1);
      //console.log("oranization_id : ", organization_id);
      //console.log("oranization_id_1 : ", organization_id_1);
      //console.log("Self flag : ", self_flag);

      let updated = await users.findOneAndUpdate(
        {
          $and: [
            { _id: user_id },
            { organization: organization_id },
            { deleted: { $ne: true } },
          ],
        },
        {$pull: { documents: {_id : target_document_id }} },
        {
          new: true,
        }
      ).select('-createdAt -updatedAt -password');

      //console.log("Updated : ", updated);
      if (updated) {
        let response = success_function({
          status: 200,
          data: updated,
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
        status: 409,
        message: "Not found",
      });
      res.status(response.statusCode).send(response);
      return;
    }

  }catch (error) {
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


exports.fetchAllSystemDocumentType = async function (req, res) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader ? authHeader.split(" ")[1] : null;
    let decoded = jwt.decode(token);

    let count = Number(await systemDocumentTypesModel.count());
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

      if(!user) {
        let response = error_function({
            status: 404,
            message: "Login user not found",
          });
          res.status(response.statusCode).send(response);
          return;
      }
      
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
    // if (user_type !== "admin") {
    //   filters.push({ organization: organization_id });
    // } else {
    //   //console.log("User is admin");
    // }

    //For eliminating deleted user
    filters.push({ deleted: { $ne: true } });

    //console.log("Filters : ", filters);

    let documents_data = await systemDocumentTypesModel
      .find(filters.length > 0 ? { $and: filters } : null)
      .sort({_id : -1})
      .select("-createdAt -updatedAt -__v")
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize);

    if (documents_data) {

      let count = await systemDocumentTypesModel.count(
        filters.length > 0 ? { $and: filters } : null
      );
      let total_pages = Math.ceil(count / pageSize);
      let data = {
        count: count,
        total_pages: total_pages,
        currentPage: pageNumber,
        datas: documents_data,
      };


      let response = success_function({
        status: 200,
        data: data,
        message: "Document types fetched successfully",
      });
      res.status(response.statusCode).send(response);
      return;
    } else {
      let response = error_function({
        status: 404,
        message: " Datas not found",
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


exports.generateSystemDocumentType = async function (req, res) {
  try {
    
    const authHeader = req.headers["authorization"];
    const token = authHeader ? authHeader.split(" ")[1] : null;
    let decoded = jwt.decode(token);

    let document_type_id = req.params.document_type_id;

    if(!document_type_id) {
      let response = error_function({
        status: 404,
        message: "Document type id is required",
      });
      res.status(response.statusCode).send(response);
      return;
    }


    let user = await users
      .findOne({$and : [{ _id: decoded.user_id },{deleted : {$ne : true}}]})
      .populate("user_type");
      
    let user_type = user.user_type.user_type;
    // let organization_id = user.organization;

    //console.log("Login user : ", user);
    //console.log("User Type : ", user_type);
    // //console.log("Organization id : ", organization_id);

    //Checking for document_type
    let required_document_type = document_type_id.toString();
    //console.log("Document type id : ", required_document_type);
    let pay_slip = "64a7dba94a9127eeea8e083a";
    let relieving_letter = "64a7dbb74a9127eeea8e083b";
    let experience_letter = "64a7dbc04a9127eeea8e083c";
    let form_16 = "64a7dbcc4a9127eeea8e083d";
    let salary_certificate = "64a7dbcc4a9127eeea8e083d";

    let date = "dateString";
    let file_name;
    let content;

    if(required_document_type === pay_slip) {
      content = `Payslip for ${user.personel_details.first_name}`;
      file_name = `payslip${decoded.user_id}${date}.pdf`;
    }else if(required_document_type === relieving_letter) {
      content = `Relieving letter for ${user.personel_details.first_name}`;
      file_name = `relievingletter${decoded.user_id}${date}.pdf`;
    }else if(required_document_type === experience_letter) {
      content = `Experience letter for ${user.personel_details.first_name}`;
      file_name = `experienceletter${decoded.user_id}${date}.pdf`;
    }else if(required_document_type === form_16) {
      content = `Form 16 for ${user.personel_details.first_name}`;
      file_name = `form16${decoded.user_id}${date}.pdf`;
    }else if(required_document_type === salary_certificate) {
      content = `Salary certificate for ${user.personel_details.first_name}`;
      file_name = `salarycertificate${decoded.user_id}${date}.pdf`;
    }
    

    //console.log("file_name : ", file_name);
    //console.log("content : ", content);

    //Generating document
    // const outputPath = path.join('../uploads/system_generated_documents', 'output.pdf');
    let path_name = '../uploads/system_generated_documents';
    // let file_name = 'output4.pdf';
    const outputPath = path.join(__dirname, path_name, file_name);
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);
    doc.font('Helvetica').fontSize(12).text(content, 50, 50);
    doc.on('error', (err) => {
      console.error('Error during PDF generation:', err);
    });
    doc.end();
    stream.on('finish', () => {
      //console.log('PDF created successfully.');
    });

    let response = success_function({
      status: 200,
      data: `/uploads/system_generated_documents/${file_name}`,
      message: "Document type added successfully",
    });
    res.status(response.statusCode).send(response);
    return;

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
}


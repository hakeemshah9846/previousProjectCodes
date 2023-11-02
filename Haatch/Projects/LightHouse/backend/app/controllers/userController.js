const userModel = require("../models/userModel.js");
const success_function = require("../utils/response-handler").success_function;
const error_function = require("../utils/response-handler").error_function;

exports.fetchOne = function (req, res) {
  const authHeader = req.headers["authorization"];
  const token = authHeader ? authHeader.split(" ")[1] : null;

  let id = req.params.id;
  userModel
    .fetchOne(token, id)
    .then((result) => {
      let response = success_function(result);
      res.status(result.status).send(response);
    })
    .catch((error) => {
      let response = error_function(error);
      res.status(error.status).send(response);
    });
};

exports.fetchAll = function (req, res) {
  const authHeader = req.headers["authorization"];
  const token = authHeader ? authHeader.split(" ")[1] : null;

  let type = req.query.type ? req.query.type.split(",") : null;
  let account_type = req.account_type;
  let status = req.query.status;
  let keyword = req.query.keyword;
  let page = req.query.page;
  let limit = req.query.limit;

  userModel
    .fetchAll(token, type, account_type, status, keyword, page, limit)
    .then((result) => {
      let response = success_function(result);
      res.status(result.status).send(response);
    })
    .catch((error) => {
      let response = error_function(error);
      res.status(error.status).send(response);
    });
};

exports.fetchProfile = function (req, res) {
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];

  userModel
    .fetchProfile(token)
    .then((result) => {
      let response = success_function(result);
      res.status(result.status).send(response);
    })
    .catch((error) => {
      let response = error_function(error);
      res.status(error.status).send(response);
    });
};

exports.updateProfile = function (req, res) {
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];

<<<<<<< HEAD
  let first_name = req.body.first_name;
  let last_name = req.body.last_name;
  let short_name = req.body.short_name;
  let image = req.body.image;
  let description = req.body.description;
  let gender = req.body.gender;
  let phone = req.body.phone;
  let occupation = req.body.occupation;
  let date_of_birth = req.body.date_of_birth;
  let birth_place = req.body.birth_place;
  let father_name = req.body.father_name;
  let country = req.body.country;
  let passport = req.body.passport;
  let user_policy = req.body.user_policy;
  let social_media = req.body.social_media;

  userModel
    .updateProfile(
      token,
      first_name,
      last_name,
      short_name,
      image,
      description,
      gender,
      phone,
      occupation,
      date_of_birth,
      birth_place,
      father_name,
      country,
      passport,
      user_policy,
      social_media
    )
    .then((result) => {
      let response = success_function(result);
      res.status(result.status).send(response);
    })
    .catch((error) => {
      let response = error_function(error);
      res.status(error.status).send(response);
=======
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let short_name = req.body.short_name;
    let image = req.body.image;
    let description = req.body.description;
    let gender = req.body.gender;
    let phone = req.body.phone;
    let occupation = req.body.occupation;
    let date_of_birth = req.body.date_of_birth;
    let birth_place = req.body.birth_place;
    let father_name = req.body.father_name;
    let country = req.body.country;
    let passport = req.body.passport;
    let user_policy = req.body.user_policy;
    let social_media = req.body.social_media;
    let public_email = req.body.public_email;
    let account_type = req.body.account_type;

    userModel.updateProfile(token, first_name, last_name, short_name, image, description, gender, phone, occupation, date_of_birth, birth_place, father_name, country, passport, user_policy, social_media, public_email, account_type)
    .then((result)=>{
        let response = success_function(result)
        res.status(result.status).send(response);
    }).catch((error)=>{
        let response = error_function(error)
        res.status(error.status).send(response);
>>>>>>> 01de542bda33bda283000971baa7f7f7c085630b
    });
};

exports.fetchOnePayment = function (req, res) {
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];

  let id = req.params.id;
  userModel
    .fetchOnePayment(token, id)
    .then((result) => {
      let response = success_function(result);
      res.status(result.status).send(response);
    })
    .catch((error) => {
      let response = error_function(error);
      res.status(error.status).send(response);
    });
};

exports.fetchPayments = function (req, res) {
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];

  userModel
    .fetchPayments(token)
    .then((result) => {
      let response = success_function(result);
      res.status(result.status).send(response);
    })
    .catch((error) => {
      let response = error_function(error);
      res.status(error.status).send(response);
    });
};

exports.addPayment = function (req, res) {
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];

  let payment_template = req.body;
  userModel
    .addPayment(token, payment_template)
    .then((result) => {
      let response = success_function(result);
      res.status(result.status).send(response);
    })
    .catch((error) => {
      let response = error_function(error);
      res.status(error.status).send(response);
    });
};

exports.updatePayment = function (req, res) {
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];

  let id = req.params.id;
  let payment_template = req.body;
  let otp = req.query.otp;

  userModel
    .updatePayment(token, id, payment_template, otp)
    .then((result) => {
      let response = success_function(result);
      res.status(result.status).send(response);
    })
    .catch((error) => {
      let response = error_function(error);
      res.status(error.status).send(response);
    });
};

exports.changeType = function (req, res) {
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];

  let id = req.params.id;
  let type = req.body.type;

  userModel
    .changeType(token, id, type)
    .then((result) => {
      let response = success_function(result);
      res.status(result.status).send(response);
    })
    .catch((error) => {
      let response = error_function(error);
      res.status(error.status).send(response);
    });
};

exports.fetchInn = function (req, res) {
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];

  let request = req.query.request;

  userModel
    .fetchInn(token, request)
    .then((result) => {
      let response = success_function(result);
      res.status(result.status).send(response);
    })
    .catch((error) => {
      let response = error_function(error);
      res.status(error.status).send(response);
    });
};

exports.generateOTP = function (req, res) {
  const authHeader = req.headers["authorization"];
  const token = authHeader ? authHeader.split(" ")[1] : null;

  userModel
    .generateOTP(token)
    .then((result) => {
      let response = success_function(result);
      res.status(result.status).send(response);
    })
    .catch((error) => {
      let response = error_function(error);
      res.status(error.status).send(response);
    });
<<<<<<< HEAD
};

exports.changeSupport = function (req, res) {
  const authHeader = req.headers["authorization"];
  const token = authHeader ? authHeader.split(" ")[1] : null;

  let curator = req.body.curator;

  userModel
    .changeSupport(token, curator)
    .then((result) => {
      let response = success_function(result);
      res.status(result.status).send(response);
    })
    .catch((error) => {
      let response = error_function(error);
      res.status(error.status).send(response);
    });
};
exports.getOrganizationCount = function (req, res) {
  userModel
    .organizationcount()
    .then((result) => {
      let response = success_function(result);
      res.status(result.status).send(response);
    })
    .catch((error) => {
      let response = error_function(error);
      res.status(error.status).send(response);
    });
};
=======
}
>>>>>>> 01de542bda33bda283000971baa7f7f7c085630b

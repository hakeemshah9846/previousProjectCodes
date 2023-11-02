const collectionModel = require("../models/collectionModel.js");
const updatedCollectionModel = require("../models/updatedCollectionModel.js");
const success_function = require("../utils/response-handler").success_function;
const error_function = require("../utils/response-handler").error_function;

exports.fetchCollection = function (req, res) {
  const authHeader = req.headers["authorization"];
  const token = authHeader ? authHeader.split(" ")[1] : null;
  let id = req.params.id;

  collectionModel
    .fetchCollection(token, id)
    .then((result) => {
      let response = success_function(result);
      res.status(result.status).send(response);
    })
    .catch((error) => {
      let response = error_function(error);
      res.status(error.status).send(response);
    });
};

exports.fetchCollections = function (req, res) {
  const authHeader = req.headers["authorization"];
  const token = authHeader ? authHeader.split(" ")[1] : null;

  let status = req.query.status;
  let added_by = req.query.added_by;
  let curator = req.query.curator;
  let curator_status = req.query.curator_status;
  let keyword = req.query.keyword;
  let collections_combined = req.query.collections_combined;
  let page = req.query.page;
  let limit = req.query.limit;

  collectionModel
    .fetchCollections(
      token,
      status,
      added_by,
      curator,
      curator_status,
      keyword,
      collections_combined,
      page,
      limit
    )
    .then((result) => {
      let response = success_function(result);
      res.status(result.status).send(response);
    })
    .catch((error) => {
      let response = error_function(error);
      res.status(error.status).send(response);
    });
};

exports.addCollection = function (req, res) {
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];
  let purpose = req.body.purpose;
  let description = req.body.description;
  let featured_image = req.body.featured_image;
  let featured_video = req.body.featured_video;
  let files = req.body.files;
  let curators = req.body.curators;
  let target_amount = Number(req.body.target_amount);
  let payment_templates = req.body.payment_templates;
  let permalink = req.body.permalink;
  let payment_purpose = req.body.payment_purpose;

  collectionModel
    .addCollection(
      token,
      purpose,
      description,
      featured_image,
      featured_video,
      files,
      curators,
      target_amount,
      payment_templates,
      permalink,
      payment_purpose
    )
    .then((result) => {
      let response = success_function(result);
      res.status(result.status).send(response);
    })
    .catch((error) => {
      let response = error_function(error);
      res.status(error.status).send(response);
    });
};

exports.updateCollection = function (req, res) {
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];
  let id = req.params.id;
  let otp = req.query.otp;
  let purpose = req.body.purpose;
  let description = req.body.description;
  let featured_image = req.body.featured_image;
  let featured_video = req.body.featured_video;
  let files = req.body.files;
  let curators = req.body.curators;
  let target_amount = Number(req.body.target_amount);
  let payment_templates = req.body.payment_templates;
  let permalink = req.body.permalink;
  let payment_purpose = req.body.payment_purpose;

  collectionModel
    .updateCollection(
      token,
      id,
      purpose,
      description,
      featured_image,
      featured_video,
      files,
      curators,
      target_amount,
      payment_templates,
      permalink,
      payment_purpose,
      otp
    )
    .then((result) => {
      let response = success_function(result);
      res.status(result.status).send(response);
    })
    .catch((error) => {
      let response = error_function(error);
      res.status(error.status).send(response);
    });
};

exports.completeCollection = function (req, res) {
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];
  let id = req.params.id;

  collectionModel
    .completeCollection(token, id)
    .then((result) => {
      let response = success_function(result);
      res.status(result.status).send(response);
    })
    .catch((error) => {
      let response = error_function(error);
      res.status(error.status).send(response);
    });
};

exports.acceptCollection = function (req, res) {
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];
  let id = req.params.id;
  let video = req.body.video;

  collectionModel
    .acceptCollection(token, id, video)
    .then((result) => {
      let response = success_function(result);
      res.status(result.status).send(response);
    })
    .catch((error) => {
      let response = error_function(error);
      res.status(error.status).send(response);
    });
};

exports.rejectCollection = function (req, res) {
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];
  let id = req.params.id;

  collectionModel
    .rejectCollection(token, id)
    .then((result) => {
      let response = success_function(result);
      res.status(result.status).send(response);
    })
    .catch((error) => {
      let response = error_function(error);
      res.status(error.status).send(response);
    });
};

exports.holdCollection = function (req, res) {
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];

  let id = req.params.id;

  collectionModel
    .holdCollection(token, id)
    .then((result) => {
      let response = success_function(result);
      res.status(result.status).send(response);
    })
    .catch((error) => {
      let response = error_function(error);
      res.status(error.status).send(response);
    });
};

exports.activateCollection = function (req, res) {
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];

  let id = req.params.id;

  collectionModel
    .activateCollection(token, id)
    .then((result) => {
      let response = success_function(result);
      res.status(result.status).send(response);
    })
    .catch((error) => {
      let response = error_function(error);
      res.status(error.status).send(response);
    });
};

<<<<<<< HEAD
exports.deleteCollection = function (req, res) {
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];
=======
exports.hideCollection = function(req, res)
{
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];

    let id = req.params.id;
    
    collectionModel.hideCollection(token, id)
    .then((result)=>{
        let response = success_function(result)
        res.status(result.status).send(response);
    }).catch((error)=>{
        let response = error_function(error)
        res.status(error.status).send(response);
    });
}

exports.unhideCollection = function(req, res)
{
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];

    let id = req.params.id;
    
    collectionModel.unhideCollection(token, id)
    .then((result)=>{
        let response = success_function(result)
        res.status(result.status).send(response);
    }).catch((error)=>{
        let response = error_function(error)
        res.status(error.status).send(response);
    });
}

exports.deleteCollection = function(req, res)
{
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];
>>>>>>> 01de542bda33bda283000971baa7f7f7c085630b

  let id = req.params.id;

  collectionModel
    .deleteCollection(token, id)
    .then((result) => {
      let response = success_function(result);
      res.status(result.status).send(response);
    })
    .catch((error) => {
      let response = error_function(error);
      res.status(error.status).send(response);
    });
};

exports.holdRequestCollection = function (req, res) {
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];
  let id = req.params.id;

  collectionModel
    .holdRequestCollection(token, id)
    .then((result) => {
      let response = success_function(result);
      res.status(result.status).send(response);
    })
    .catch((error) => {
      let response = error_function(error);
      res.status(error.status).send(response);
    });
};

<<<<<<< HEAD
exports.addCollectionUpdates = function (req, res) {
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];

  let id = req.params.id;
  let video = req.body.video;
  let files = req.body.files;
  let description = req.body.description;

  collectionModel
    .addCollectionUpdates(token, id, video, files, description)
    .then((result) => {
      let response = success_function(result);
      res.status(result.status).send(response);
    })
    .catch((error) => {
      let response = error_function(error);
      res.status(error.status).send(response);
=======
exports.fetchCollectionUpdates = function(req, res)
{
    let collection = req.query.collection;
    let extra_amount = req.query.extra_amount;
    
    collectionModel.fetchCollectionUpdates(collection, extra_amount)
    .then((result)=>{
        let response = success_function(result)
        res.status(result.status).send(response);
    }).catch((error)=>{
        let response = error_function(error)
        res.status(error.status).send(response);
    });
}

exports.fetchOneCollectionUpdate = function(req, res)
{
    let id = req.params.id;
    
    collectionModel.fetchOneCollectionUpdate(id)
    .then((result)=>{
        let response = success_function(result)
        res.status(result.status).send(response);
    }).catch((error)=>{
        let response = error_function(error)
        res.status(error.status).send(response);
    });
}

exports.addCollectionUpdates = function(req, res)
{
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];

    let id = req.params.id;
    let video = req.body.video;
    let files = req.body.files;
    let description = req.body.description;
    let extra_amount = (req.body.extra_amount) ? Number(req.body.extra_amount): 0;
    
    collectionModel.addCollectionUpdates(token, id, video, files, description, extra_amount)
    .then((result)=>{
        let response = success_function(result)
        res.status(result.status).send(response);
    }).catch((error)=>{
        let response = error_function(error)
        res.status(error.status).send(response);
>>>>>>> 01de542bda33bda283000971baa7f7f7c085630b
    });
};

exports.updateCollectionUpdates = function (req, res) {
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];

<<<<<<< HEAD
  let id = req.params.id;
  let video = req.body.video;
  let files = req.body.files;
  let description = req.body.description;

  collectionModel
    .updateCollectionUpdates(token, id, video, files, description)
    .then((result) => {
      let response = success_function(result);
      res.status(result.status).send(response);
    })
    .catch((error) => {
      let response = error_function(error);
      res.status(error.status).send(response);
    });
};

exports.fetchOneCollectionUpdate = function (req, res) {
  let id = req.params.id;

  collectionModel
    .fetchOneCollectionUpdate(id)
    .then((result) => {
      let response = success_function(result);
      res.status(result.status).send(response);
    })
    .catch((error) => {
      let response = error_function(error);
      res.status(error.status).send(response);
=======
    let id = req.params.id;
    let video = req.body.video;
    let files = req.body.files;
    let description = req.body.description;
    let extra_amount = (req.body.extra_amount) ? Number(req.body.extra_amount): 0;
    
    collectionModel.updateCollectionUpdates(token, id, video, files, description, extra_amount)
    .then((result)=>{
        let response = success_function(result)
        res.status(result.status).send(response);
    }).catch((error)=>{
        let response = error_function(error)
        res.status(error.status).send(response);
>>>>>>> 01de542bda33bda283000971baa7f7f7c085630b
    });
};

exports.deleteCollectionUpdate = function (req, res) {
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];

  let id = req.params.id;

  collectionModel
    .deleteCollectionUpdate(token, id)
    .then((result) => {
      let response = success_function(result);
      res.status(result.status).send(response);
    })
    .catch((error) => {
      let response = error_function(error);
      res.status(error.status).send(response);
    });
};

exports.fetchUpdatedCollection = function (req, res) {
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];

  let id = req.params.id;

  updatedCollectionModel
    .fetchUpdatedCollection(token, id)
    .then((result) => {
      let response = success_function(result);
      res.status(result.status).send(response);
    })
    .catch((error) => {
      let response = error_function(error);
      res.status(error.status).send(response);
    });
};

exports.fetchUpdatedCollections = function (req, res) {
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];

  let collection = req.query.collection;
  let status = req.query.status;
  let keyword = req.query.keyword;
  let page = req.query.page;
  let limit = req.query.limit;

  updatedCollectionModel
    .fetchUpdatedCollections(token, collection, status, keyword, page, limit)
    .then((result) => {
      let response = success_function(result);
      res.status(result.status).send(response);
    })
    .catch((error) => {
      let response = error_function(error);
      res.status(error.status).send(response);
    });
};

exports.acceptUpdatedCollection = function (req, res) {
  const authHeader = req.headers["authorization"];
  const token = authHeader ? authHeader.split(" ")[1] : null;
  let id = req.params.id;

  updatedCollectionModel
    .acceptUpdatedCollection(token, id)
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

  let id = req.params.id;

  collectionModel
    .generateOTP(token, id)
    .then((result) => {
      let response = success_function(result);
      res.status(result.status).send(response);
    })
    .catch((error) => {
      let response = error_function(error);
      res.status(error.status).send(response);
    });
};

//Middleware to hide collections
exports.hideCollection = function (req, res) {
  const authHeader = req.headers["authorization"];
  const token = authHeader ? authHeader.split(" ")[1] : null;

  let id = (req.params.id);

  collectionModel
    .hideCollection(token, id)
    .then((result) => {
      let response = success_function(result);
      res.status(result.status).send(response);
    })
    .catch((error) => {
      let response = error_function(error);
      res.status(error.status).send(response);
    });
};

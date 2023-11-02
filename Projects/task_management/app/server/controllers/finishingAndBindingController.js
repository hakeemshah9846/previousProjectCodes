const success_function = require('../utils/response-handler').success_function;
const error_function = require('../utils/response-handler').error_function;
const finishingAndBindingManager = require('../managers/finishingAndBindingManager');
const binding_edit_validation = require('../validation/binding_edit_validation');
const binding_validation = require('../validation/binding_validation');



exports.createNew = function (req, res) {

  
  console.log("Request Body : ", req.body);

  const {errors, isValid} = binding_validation(req.body);

  console.log("Errors from controller : ", errors);
  console.log("isValid from controller : ", isValid);

  if(isValid) {


    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];


    let job_id = req.body.job_id; // (id) to be sent from the front-end from the createJob response
    let binding_operator = req.body.binding_operator; // (Dropdown) (completed) From binding_operators table
    let binding_type = req.body.binding_type; // (Dropdown) (completed) From binding_types table
    let binding_status = req.body.binding_status; // (Dropdown) (completed) From binding_statuses table
    // let material = req.body.material; // (Dropdown) (completed) From materials table
    let binding_page_count = req.body.binding_page_count;
    let binding_quantity = req.body.binding_quantity;
    let require_perforation = req.body.require_perforation // Yes or No
    let binding_material = req.body.binding_material; // (Dropdown) (completed) From binding_materials table
    let unit_cost = req.body.unit_cost; // (Dropdown) (completed) From binding_unit_costs table
    // let request_date // (Insert date using dayjs)
    // let completed_date // (Insert using dayjs)


  
    finishingAndBindingManager.createNew(token, job_id, binding_operator, binding_type, binding_status, binding_page_count, binding_quantity, require_perforation, binding_material, unit_cost)
      .then((result) => {
        const response = success_function(result);
        res.status(result.status).send(response);
      })
      .catch((error) => {
        const response = error_function(error);
        res.status(error.status).send(response);
      })

    }else {
      res.status(400).send({"status" : 400,"errors" : errors, "message" : "Validation failed"});

    }
  }


  exports.bindingEdit = function (req, res) {


    console.log("Request Body : ", req.body);

    const {errors, isValid} = binding_edit_validation(req.body);
  
    console.log("Errors from controller : ", errors);
    console.log("isValid from controller : ", isValid);
  
    if(isValid) {

    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];


    let binding_id = req.body.binding_id;
    let job_id = req.body.job_id; // (id) to be sent from the front-end from the createJob response
    let binding_operator = req.body.binding_operator; // (Dropdown) (completed) From binding_operators table
    let binding_type = req.body.binding_type; // (Dropdown) (completed) From binding_types table
    let binding_status = req.body.binding_status; // (Dropdown) (completed) From binding_statuses table
    // let material = req.body.material; // (Dropdown) (completed) From materials table
    let binding_page_count = req.body.binding_page_count;
    let binding_quantity = req.body.binding_quantity;
    let require_perforation = req.body.require_perforation // Yes or No
    let binding_material = req.body.binding_material; // (Dropdown) (completed) From binding_materials table
    let unit_cost = req.body.unit_cost; // (Dropdown) (completed) From binding_unit_costs table
    // let request_date // (Insert date using dayjs)
    // let completed_date // (Insert using dayjs)


  
    finishingAndBindingManager.bindingEdit(token, binding_id ,job_id, binding_operator, binding_type, binding_status, binding_page_count, binding_quantity, require_perforation, binding_material, unit_cost)
      .then((result) => {
        const response = success_function(result);
        res.status(result.status).send(response);
      })
      .catch((error) => {
        const response = error_function(error);
        res.status(error.status).send(response);
      })

    }else {
      res.status(400).send({"status" : 400,"errors" : errors, "message" : "Validation failed"});
    }
  }


  exports.fetchAllBindingOperators = function (req, res) {

    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];

  
    finishingAndBindingManager.fetchAllBindingOperators(token)
      .then((result) => {
        const response = success_function(result);
        res.status(result.status).send(response);
      })
      .catch((error) => {
        const response = error_function(error);
        res.status(error.status).send(response);
      })
  }


  exports.fetchAllBindingTypes = function (req, res) {

    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];

  
    finishingAndBindingManager.fetchAllBindingTypes(token)
      .then((result) => {
        const response = success_function(result);
        res.status(result.status).send(response);
      })
      .catch((error) => {
        const response = error_function(error);
        res.status(error.status).send(response);
      })
  }

  exports.fetchAllBindingStatus = function (req, res) {

    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];

  
    finishingAndBindingManager.fetchAllBindingStatus(token)
      .then((result) => {
        const response = success_function(result);
        res.status(result.status).send(response);
      })
      .catch((error) => {
        const response = error_function(error);
        res.status(error.status).send(response);
      })
  }


  exports.fetchAllBindingMaterials = function (req, res) {

    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];

  
    finishingAndBindingManager.fetchAllBindingMaterials(token)
      .then((result) => {
        const response = success_function(result);
        res.status(result.status).send(response);
      })
      .catch((error) => {
        const response = error_function(error);
        res.status(error.status).send(response);
      })
  }

  
  exports.fetchAllMaterials = function (req, res) {

    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];

  
    finishingAndBindingManager.fetchAllMaterials(token)
      .then((result) => {
        const response = success_function(result);
        res.status(result.status).send(response);
      })
      .catch((error) => {
        const response = error_function(error);
        res.status(error.status).send(response);
      })
  }

  exports.fetchAllBindingUnitCosts = function (req, res) {

    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];

  
    finishingAndBindingManager.fetchAllBindingUnitCosts(token)
      .then((result) => {
        const response = success_function(result);
        res.status(result.status).send(response);
      })
      .catch((error) => {
        const response = error_function(error);
        res.status(error.status).send(response);
      })
  }


  exports.fetchSingleBindingDetails = function (req, res) {

    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];

    const binding_id = req.params.binding_id;

  
    finishingAndBindingManager.fetchSingleBindingDetails(token, binding_id)
      .then((result) => {
        const response = success_function(result);
        res.status(result.status).send(response);
      })
      .catch((error) => {
        const response = error_function(error);
        res.status(error.status).send(response);
      })
  }
  
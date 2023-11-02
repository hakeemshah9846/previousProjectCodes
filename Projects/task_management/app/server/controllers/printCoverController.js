const printCoverManager = require('../managers/printCoverManager');
const print_cover_edit_validation = require('../validation/print_cover_edit_validation');
const print_cover_validation = require('../validation/print_cover_validation');
const print_pages_validations = require('../validation/print_pages_validations');
const success_function = require('../utils/response-handler').success_function;
const error_function = require('../utils/response-handler').error_function;




exports.createNew = function (req, res) {


  console.log("Request Body : ", req.body);

    const {errors, isValid} = print_cover_validation(req.body);

    console.log("Errors from controller : ", errors);
    console.log("isValid from controller : ", isValid);

    if(isValid) {

    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];


    let job_id = req.body.job_id;
    let print_cover_operator = req.body.print_cover_operator // (Dropdown) (completed) From print_cover_operators table
    let print_cover_color = req.body.print_cover_color // (Dropdown) (completed) From print_cover_colors table
    let print_cover_status = req.body.print_cover_status // (Dropdown) (completed) From print_cover_statuses table
    let print_cover_printer = req.body.print_cover_printer // (Dropdown) (completed) From print_cover_printers table
    let print_cover_paper_type = req.body.print_cover_paper_type // (Dropdown) (completed) From print_cover_paper_types table
    let print_cover_side = req.body.print_cover_side // (Dropdown) (completed) From print_cover_sides table
    let require_lamination = req.body.require_lamination; // Yes or No
    let print_cover_quantity = req.body.print_cover_quantity;
    // let print_cover_machine = req.body.print_cover_machine; // (Dropdown)
    let print_cover_material = req.body.print_cover_material; // (Dropdown)
    // let request_date; // Insert date using dayjs
    // let completed_date; // Insert date using dayjs
    printCoverManager.createNew(token, job_id, print_cover_operator, print_cover_color, print_cover_status, print_cover_printer, print_cover_paper_type, print_cover_side, require_lamination, print_cover_quantity, print_cover_material)
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


  exports.printCoverEdit = function (req, res) {

    console.log("Request Body : ", req.body);

    const {errors, isValid} = print_cover_edit_validation(req.body);

    console.log("Errors from controller : ", errors);
    console.log("isValid from controller : ", isValid);

    if(isValid) {

    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];


    let print_cover_id = req.body.print_cover_id;
    let job_id = req.body.job_id;
    let print_cover_operator = req.body.print_cover_operator // (Dropdown) (completed) From print_cover_operators table
    let print_cover_color = req.body.print_cover_color // (Dropdown) (completed) From print_cover_colors table
    let print_cover_status = req.body.print_cover_status // (Dropdown) (completed) From print_cover_statuses table
    let print_cover_printer = req.body.print_cover_printer // (Dropdown) (completed) From print_cover_printers table
    let print_cover_paper_type = req.body.print_cover_paper_type // (Dropdown) (completed) From print_cover_paper_types table
    let print_cover_side = req.body.print_cover_side // (Dropdown) (completed) From print_cover_sides table
    let require_lamination = req.body.require_lamination; // Yes or No
    let print_cover_quantity = req.body.print_cover_quantity;
    // let print_cover_machine = req.body.print_cover_machine; // (Dropdown)
    let print_cover_material = req.body.print_cover_material; // (Dropdown)
    // let request_date; // Insert date using dayjs
    // let completed_date; // Insert date using dayjs
    printCoverManager.printCoverEdit(token, print_cover_id, job_id, print_cover_operator, print_cover_color, print_cover_status, print_cover_printer, print_cover_paper_type, print_cover_side, require_lamination, print_cover_quantity, print_cover_material)
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


exports.fetchAllPrintCoverOperators = function (req, res) {

    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];

  
    printCoverManager.fetchAllPrintCoverOperators(token)
      .then((result) => {
        const response = success_function(result);
        res.status(result.status).send(response);
      })
      .catch((error) => {
        const response = error_function(error);
        res.status(error.status).send(response);
      })
  }


  exports.fetchAllPrintCoverColors = function (req, res) {

    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];

  
    printCoverManager.fetchAllPrintCoverColors(token)
      .then((result) => {
        const response = success_function(result);
        res.status(result.status).send(response);
      })
      .catch((error) => {
        const response = error_function(error);
        res.status(error.status).send(response);
      })
  }


  exports.fetchAllPrintCoverStatus = function (req, res) {

    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];

  
    printCoverManager.fetchAllPrintCoverStatus(token)
      .then((result) => {
        const response = success_function(result);
        res.status(result.status).send(response);
      })
      .catch((error) => {
        const response = error_function(error);
        res.status(error.status).send(response);
      })
  }



  exports.fetchAllPrintCoverPrinters = function (req, res) {

    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];

  
    printCoverManager.fetchAllPrintCoverPrinters(token)
      .then((result) => {
        const response = success_function(result);
        res.status(result.status).send(response);
      })
      .catch((error) => {
        const response = error_function(error);
        res.status(error.status).send(response);
      })
  }

  
  exports.fetchAllPrintCoverPaperTypes = function (req, res) {

    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];

  
    printCoverManager.fetchAllPrintCoverPaperTypes(token)
      .then((result) => {
        const response = success_function(result);
        res.status(result.status).send(response);
      })
      .catch((error) => {
        const response = error_function(error);
        res.status(error.status).send(response);
      })
  }

  exports.fetchAllPrintCoverSides = function (req, res) {

    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];

  
    printCoverManager.fetchAllPrintCoverSides(token)
      .then((result) => {
        const response = success_function(result);
        res.status(result.status).send(response);
      })
      .catch((error) => {
        const response = error_function(error);
        res.status(error.status).send(response);
      })
  }


  exports.fetchAllPrintCoverMachines = function (req, res) {

    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];

  
    printCoverManager.fetchAllPrintCoverMachines(token)
      .then((result) => {
        const response = success_function(result);
        res.status(result.status).send(response);
      })
      .catch((error) => {
        const response = error_function(error);
        res.status(error.status).send(response);
      })
  }

  exports.fetchAllPrintCoverMaterials = function (req, res) {

    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];

  
    printCoverManager.fetchAllPrintCoverMaterials(token)
      .then((result) => {
        const response = success_function(result);
        res.status(result.status).send(response);
      })
      .catch((error) => {
        const response = error_function(error);
        res.status(error.status).send(response);
      })
  }




  exports.fetchSinglePrintCoverDetails = function (req, res) {

    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];

    const print_cover_id = req.params.print_cover_id;

  
    printCoverManager.fetchSinglePrintCoverDetails(token, print_cover_id)
      .then((result) => {
        const response = success_function(result);
        res.status(result.status).send(response);
      })
      .catch((error) => {
        const response = error_function(error);
        res.status(error.status).send(response);
      })
  }
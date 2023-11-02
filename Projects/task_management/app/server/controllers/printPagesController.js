const success_function = require('../utils/response-handler').success_function;
const error_function = require('../utils/response-handler').error_function;
const printPagesManager = require('../managers/printPagesManager');
const print_pages_edit_validation = require('../validation/print_pages_edit_validation');
const print_pages_validations = require('../validation/print_pages_validations');


exports.createNew =async function (req, res) {


  console.log("Request Body : ", req.body);

    let {errors, isValid} = await print_pages_validations(req.body);

    console.log("Errors from controller : ", errors);
    console.log("isValid from controller : ", isValid);

    if(isValid) {

    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];

    let job_id = req.body.job_id;
    let job_print_operator = req.body.job_print_operator; // (Dropdown) (Completed) From job_print_operators table
    let job_print_color = req.body.job_print_color; // (Dropdown) (Completed) From job_print_colors table
    let print_sides = req.body.print_sides; // (Single or Double)
    let job_print_pages = req.body.job_print_pages;
    let print_pages_printer = req.body.print_pages_printer; // (Dropdown) (Completed) From print_pages_printers table
    let job_print_quantity = req.body.job_print_quantity;
    let paper_type = req.body.paper_type; // (Dropdown) (Completed) From print_pages_paper_types table
    let job_req_paper_quantity = req.body.job_req_paper_quantity;
    let job_print_comment = req.body.job_print_comment;
    // let print_pages_machine = req.body.print_pages_machine // (Dropdown) (Completed) From print_pages_machines table
    let job_print_total = req.body.job_print_total;
    let job_req_lamination = req.body.job_req_lamination;
    let job_req_stappled = req.body.job_req_stappled;
    let job_print_cost = req.body.job_print_cost;
    let job_paper_cost = req.body.job_paper_cost;

    printPagesManager.createNew(token, job_id, job_paper_cost, job_print_cost, job_req_stappled, job_req_lamination, job_print_operator, job_print_color, print_sides, job_print_pages, print_pages_printer, job_print_quantity,  paper_type, job_req_paper_quantity, job_print_comment, job_print_total)
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


  exports.printPagesEdit = function (req, res) {


    console.log("Request Body : ", req.body);

    const {errors, isValid} = print_pages_edit_validation(req.body);

    console.log("Errors from controller : ", errors);
    console.log("isValid from controller : ", isValid);

    if(isValid) {

    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];

    let print_page_id = req.body.print_page_id;
    let job_id = req.body.job_id;
    let job_print_operator = req.body.job_print_operator; // (Dropdown) (Completed) From job_print_operators table
    let job_print_color = req.body.job_print_color; // (Dropdown) (Completed) From job_print_colors table
    let print_sides = req.body.print_sides; // (Single or Double)
    let job_print_pages = req.body.job_print_pages;
    let print_pages_printer = req.body.print_pages_printer; // (Dropdown) (Completed) From print_pages_printers table
    let job_print_quantity = req.body.job_print_quantity;
    let paper_type = req.body.paper_type; // (Dropdown) (Completed) From print_pages_paper_types table
    let job_req_paper_quantity = req.body.job_req_paper_quantity;
    let job_print_comment = req.body.job_print_comment;
    // let print_pages_machine = req.body.print_pages_machine // (Dropdown) (Completed) From print_pages_machines table
    let job_print_total = req.body.job_print_total;
    let job_req_lamination = req.body.job_req_lamination;
    let job_req_stappled = req.body.job_req_stappled;
    let job_print_cost = req.body.job_print_cost;
    let job_paper_cost = req.body.job_paper_cost;

    printPagesManager.printPagesEdit(token, print_page_id, job_id, job_paper_cost, job_print_cost, job_req_stappled, job_req_lamination, job_print_operator, job_print_color, print_sides, job_print_pages, print_pages_printer, job_print_quantity,  paper_type, job_req_paper_quantity, job_print_comment, job_print_total)
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


exports.fetchAllPrintPagesOperators = function (req, res) {

    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];

  
    printPagesManager.fetchAllPrintPagesOperators(token)
      .then((result) => {
        const response = success_function(result);
        res.status(result.status).send(response);
      })
      .catch((error) => {
        const response = error_function(error);
        res.status(error.status).send(response);
      })
  }


  
exports.fetchAllPrintPagesColors = function (req, res) {

    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];

  
    printPagesManager.fetchAllPrintPagesColors(token)
      .then((result) => {
        const response = success_function(result);
        res.status(result.status).send(response);
      })
      .catch((error) => {
        const response = error_function(error);
        res.status(error.status).send(response);
      })
  }


  exports.fetchAllPrintPagesPrinters = function (req, res) {

    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];

    const color_id = req.query.color_id;


  
    printPagesManager.fetchAllPrintPagesPrinters(token, color_id)
      .then((result) => {
        const response = success_function(result);
        res.status(result.status).send(response);
      })
      .catch((error) => {
        const response = error_function(error);
        res.status(error.status).send(response);
      })
  }

  exports.fetchAllPrintPagesPaperTypes = function (req, res) {

    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];

    const printer_id = req.query.printer_id;
  
    printPagesManager.fetchAllPrintPagesPaperTypes(token,printer_id)
      .then((result) => {
        const response = success_function(result);
        res.status(result.status).send(response);
      })
      .catch((error) => {
        const response = error_function(error);
        res.status(error.status).send(response);
      })
  }


  exports.fetchAllPrintPagesMachines = function (req, res) {

    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];

  
    printPagesManager.fetchAllPrintPagesMachines(token)
      .then((result) => {
        const response = success_function(result);
        res.status(result.status).send(response);
      })
      .catch((error) => {
        const response = error_function(error);
        res.status(error.status).send(response);
      })
  }
const salary_history = require("../db/models/salary_history");
const success_function = require("../utils/response-handler").success_function;
const error_function = require("../utils/response-handler").error_function;
const users = require("../db/models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dayjs = require("dayjs");
const mongoose = require('mongoose');
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore')
const { Schema } = require("mongoose");
const e = require("express");
const fileUpload = require("../utils/file-upload").fileUpload;
const salary_template = require("../db/models/salary_template");
let mongoose_delete = require("mongoose-delete");

dayjs.extend(isSameOrBefore)

exports.salaryList = async function (req, res) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader ? authHeader.split(" ")[1] : null;

    let salary_year_from = req.query.salary_year_from;
    let salary_month_from = req.query.salary_month_from;
    let salary_year_to = req.query.salary_year_to;
    let salary_month_to = req.query.salary_month_to;
    let user_id = req.query.user_id;

    let salary_year = req.query.salary_year;
    let salary_month = req.query.salary_month;

    let keyword = req.query.keyword;

    let count = await salary_history.count();

    //console.log("count : ", count);

    const pageSize = req.query.pageSize || Number(count);
    const pageNumber = req.query.page || 1;

    let decoded = jwt.decode(token);

    // if (req_user) {
    let filters = [];

    //Finding organization_id of request user of user_type organization
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
    } else {
      //console.log("User is admin");
    }

    //Avoiding login user and deleted user
    filters.push({ _id: { $ne: decoded.user_id } });
    filters.push({ deleted: { $ne: true } });

    //adding user_type employee_id to the filter to filter out only employees
    filters.push({ user_type: "645e34977483b6558146f846" });

    if (salary_year) {
      filters.push({ salary_year: salary_year });
    }

    if (salary_month) {
      filters.push({ salary_month: salary_month });
    }

    if (salary_year_from) {
      filters.push({ salary_year: { $gte: salary_year_from } });
    }

    if (salary_month_from) {
      filters.push({ salary_month: { $gte: salary_month_from } });
    }

    if (salary_year_to) {
      filters.push({ salary_year: { $lte: salary_year_to } });
    }

    if (salary_month_to) {
      filters.push({ salary_month: { $lte: salary_month_to } });
    }

    if (user_id) {
      filters.push({ user: user_id });
    }

    //Finding organization_id

    const salary_history_data = await salary_history
      .find(filters.length > 0 ? { $and: filters } : null)
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize);

    // const users_data = await users.find();
    // //console.log("Users : ", users_data);

    // Checking if users id exists in salary history or not, if not found then a new blank payment history is added to an array

    // array to store salary history if user id not found in salary history, the payment in this should always blank
    // let blank_payment_history = [];
    // let unpaid = [];
    // let partially_paid = [];
    // let paid = [];

    // // let salary_history = [];

    // //Finding maximum and minimum salary and month values from database
    // let max_year_value = 2023;
    // let max_month_value = 12;
    // let min_year_value = 2018;
    // let min_month_value = 1;

    // for (let i = 0; i < users_data.length; i++) {
    //   let user_id = users_data[i]._id;

    //   //Finding total salary
    //   let salary = Number(users_data[i].salary);

    //   //Finding joining data
    //   let joining_date = users_data[i].official_details.date_of_join;
    //   //console.log("Joining date : ", joining_date);

    //   //Getting joining year and joining month from joining date
    //   let joining_year = joining_date.split("-")[0];
    //   let joining_month = joining_date.split("-")[1];

    //   //Finding minimum and maximum year and month values from database

    //   //Initializing Starting and ending month and year values
    //   let starting_year;
    //   let starting_month;
    //   let max_salary_year;
    //   let max_salary_month;

    //   if (
    //     salary_year_from &&
    //     salary_month_from &&
    //     salary_year_to &&
    //     salary_month_to
    //   ) {
    //     if (Number(salary_year_to) > Number(max_year_value)) {
    //       let response = error_function({
    //         status: 400,
    //         message: "Invalid year limit",
    //       });
    //       res.status(response.statusCode).send(response);
    //       return;
    //     }
    //     //In this case all four values are availabe and datas in between these values are send
    //     starting_year = Number(salary_year_from);
    //     starting_month = Number(salary_month_from);
    //     max_salary_year = Number(salary_year_to);
    //     // max_salary_month = 12;
    //     max_salary_month = Number(salary_month_to);
    //     //console.log("starting_year : ", starting_year);
    //     //console.log("starting_month : ", starting_month);
    //     //console.log("max_salary_year : ", max_salary_year);
    //     //console.log("max_salary_month : ", max_salary_month);
    //   } else if (salary_year_from && salary_year_to) {
    //     //If salary_year_from and salary_year_to is present then the datas between this year is send
    //     starting_year = Number(salary_year_from);
    //     max_salary_year = Number(salary_year_to);
    //     starting_month = Number(joining_month);
    //     max_salary_month = 12;

    //     if (Number(salary_year_to) > Number(max_year_value)) {
    //       let response = error_function({
    //         status: 400,
    //         message: "Limit too high",
    //       });
    //       res.status(response.statusCode).send(response);
    //       return;
    //     }
    //   } else if (salary_year_from && salary_month_from) {
    //     //If salary_year_from and salary_month_from is present then the datas from this year upto the current year and the month of the first year is selected according to the joining date
    //     starting_year = Number(salary_year_from);
    //     max_salary_year = 2023; //Should find max year from database
    //     max_salary_month = 12;

    //     if (Number(joining_month) > Number(salary_month_from)) {
    //       starting_month = Number(joining_month);
    //     } else if (Number(joining_month <= Number(salary_month_from))) {
    //       starting_month = Number(salary_month_from);
    //     } else {
    //       starting_month = Number(salary_month_from);
    //     }

    //     if (Number(salary_month_from) > 12 || Number(salary_month_from) < 1) {
    //       let response = error_function({
    //         status: 400,
    //         message: "Invalid month limit",
    //       });
    //       res.status(response.statusCode).send(response);
    //       return;
    //     }

    //     //console.log("Reached here...");
    //     //console.log("Starting_month From else if : ", starting_month);
    //   } else if (salary_year_to && salary_month_to) {
    //     //Histories of all the years upto salary_year_to upto salary_month_to in all years is send
    //     starting_year = 2018; //Should find min value from database
    //     starting_month = Number(joining_month);
    //     max_salary_year = Number(salary_year_to);
    //     max_salary_month = Number(salary_month_to);
    //   } else if (salary_year_from) {
    //     //If only the starting year is present, then the datas from this year to the current year is send
    //     starting_year = Number(salary_year_from);
    //     starting_month = Number(joining_month);
    //     max_salary_year = 2023; //Should find max year from salary history
    //     max_salary_month = 12;
    //   } else if (salary_year_to) {
    //     //If only salary_year_to is present then the datas up to this year from the starting year is send
    //     starting_year = 2018; //Should find min salary year from database
    //     max_salary_year = Number(salary_year_to);
    //     starting_month = Number(joining_month);
    //     max_salary_month = 12;
    //   } else if (salary_year) {
    //     //If only salary_year is present then the datas of that particular is send
    //     starting_year = Number(salary_year);
    //     starting_month = 1;
    //     max_salary_year = Number(salary_year);
    //     max_salary_month = 12;
    //   } else if (salary_month) {
    //     //If only salary_month is present then the datas of that particular month from all years is send
    //     starting_year = 2018; //Should find min year from database
    //     starting_month = Number(salary_month);
    //     max_salary_year = 2023; //Should find max year from database
    //     max_salary_month = Number(salary_month);
    //   } else if (salary_month_from) {
    //     //In this case the datas of months starting from salary_month_from value of all years is send
    //     starting_year = 2018; //Get from database
    //     starting_month = Number(salary_month_from);
    //     max_salary_year = 2023; //Fetch from database
    //     max_salary_month = 12;
    //   } else if (salary_month_to) {
    //     //In this case the datas of all years where the month datas upto this salary_month_to value is send
    //     starting_year = 2018; //Find from database
    //     starting_month = 1;
    //     max_salary_year = 2023; //Find from database
    //     max_salary_month = Number(salary_month_to);
    //   } else {
    //     let response = error_function({
    //       status: 400,
    //       message: "Invalid payload",
    //     });
    //     res.status(response.statusCode).send(response);
    //     return;
    //   }

    //   //console.log("Starting year : ", starting_year);
    //   //console.log("Starting month : ", starting_month);

    //   for (
    //     let salary_year = starting_year;
    //     salary_year <= Number(max_salary_year);
    //     salary_year++
    //   ) {
    //     //For only the loop salary_year matching the joining_year
    //     if (Number(joining_year) == Number(salary_year)) {
    //       if (salary_month_from) {
    //         if (Number(joining_month) < Number(salary_month_from)) {
    //           starting_month = Number(salary_month_from);
    //         } else {
    //           starting_month = Number(joining_month);
    //         }
    //       } else {
    //         starting_month = Number(joining_month);
    //       }
    //     } else if (salary_month_from) {
    //       //console.log("Reached else iffff....");
    //       starting_month = Number(salary_month_from);
    //     } else {
    //       starting_month = 1;
    //       //console.log("Reached else .....");
    //     }

    //     //console.log("starting month from for loop : ", starting_month);

    //     for (
    //       let salary_month = Number(starting_month);
    //       salary_month <= Number(max_salary_month);
    //       salary_month++
    //     ) {
    //       let isFound = salary_history_data.some(
    //         (obj) =>
    //           obj.user === user_id &&
    //           Number(obj.salary_month) === Number(salary_month) &&
    //           Number(obj.salary_year) === Number(salary_year)
    //       );

    //       if (isFound) {
    //         //console.log("Found...");
    //         let history_data = salary_history_data.find(
    //           (obj) =>
    //             obj.user === user_id &&
    //             Number(obj.salary_month) === Number(salary_month) &&
    //             Number(obj.salary_year) === Number(salary_year)
    //         );
    //         let history_salary = history_data.salary;
    //         let history_payment = history_data.payment;
    //         let total_paid_amount = 0;
    //         let history_addition = history_data.addition;
    //         let history_deduction = history_data.deduction;
    //         let total_history_addition_amount = 0;
    //         let total_history_deduction_amount = 0;

    //         if (history_addition.length > 0) {
    //           history_addition.forEach((e) => {
    //             total_history_addition_amount =
    //               total_history_addition_amount + Number(e.amount);
    //           });
    //         }

    //         if (history_deduction.length > 0) {
    //           history_deduction.forEach((e) => {
    //             total_history_deduction_amount =
    //               total_history_deduction_amount + Number(e.amount);
    //           });
    //         }

    //         let amount_to_be_paid =
    //           Number(history_salary) +
    //           Number(total_history_addition_amount) -
    //           Number(total_history_deduction_amount);

    //         if (history_payment.length > 0) {
    //           history_payment.forEach((e) => {
    //             total_paid_amount = total_paid_amount + Number(e.paid_amount);
    //           });
    //         }

    //         if (
    //           Number(total_paid_amount) < Number(amount_to_be_paid) &&
    //           Number(total_paid_amount) > 0
    //         ) {
    //           history_data.status = "partially paid";
    //           partially_paid.push(history_data);
    //         } else if (
    //           Number(total_paid_amount) === Number(amount_to_be_paid)
    //         ) {
    //           history_data.status = "paid";
    //           paid.push(history_data);
    //         } else if (
    //           Number(total_paid_amount) > Number(amount_to_be_paid)
    //         ) {
    //           history_data.status = "extra payment";
    //           paid.push(history_data);
    //         } else if (Number(total_paid_amount) <= 0) {
    //           history_data.status = "unpaid";
    //           unpaid.push(history_data);
    //         }
    //       } else {
    //         // //console.log("Not found...");

    //         if (Number(joining_year) <= Number(salary_year)) {
    //           unpaid.push({
    //             user: user_id,
    //             salary: "0", //Previous salary not available, only current salary available
    //             addition: [],
    //             deduction: [],
    //             payment: [],
    //             status: "unpaid",
    //             salary_year: salary_year,
    //             salary_month: salary_month,
    //           });
    //         }
    //       }

    //       // if(Number(starting_month) === Number(max_salary_month)) {
    //       //   break;
    //       // }
    //     }

    //     // //console.log("salary_month : ", salary_month);
    //     if (salary_month) {
    //       //Checks
    //       if (Number(joining_year) > Number(salary_year)) {
    //         starting_month = Number(salary_month);
    //         max_salary_month = Number(salary_month);
    //       }

    //       if (Number(joining_year) === Number(salary_year)) {
    //         if (Number(joining_month) > Number(salary_month)) {
    //           starting_month = Number(joining_month);
    //           max_salary_month = Number(joining_month);
    //         } else {
    //           starting_month = Number(salary_month);
    //           max_salary_month = Number(salary_month);
    //         }
    //       }

    //       if (Number(joining_year) < Number(salary_year)) {
    //         starting_month = Number(salary_month);
    //         max_salary_month = Number(salary_month);
    //       }
    //     } else if (salary_month_from) {
    //       if (Number(joining_year) > Number(salary_year)) {
    //         starting_month = Number(salary_month_from);
    //       }

    //       if (Number(joining_year) === Number(salary_year)) {
    //         if (Number(joining_month) > Number(salary_month_from)) {
    //           starting_month = Number(joining_month);
    //         } else {
    //           starting_month = Number(salary_month_from);
    //         }
    //       }

    //       if (Number(joining_year) < Number(salary_year)) {
    //         starting_month = Number(salary_month_from);
    //       }
    //     } else {
    //       // if(Number(joining_year) > Number(salary_year)) {
    //       //   starting_month = 1;
    //       // }
    //       // if(Number(joining_year) == Number(salary_year)) {
    //       //   starting_month = Number(joining_month);
    //       //   // //console.log("Joining_year = salary_year");
    //       //   // //console.log("joining_month : ", Number(joining_month));
    //       //   // //console.log("starting_month : ", starting_month);
    //       // }else {
    //       //   starting_month = 1;
    //       // }
    //       // if(Number(joining_year) < Number(salary_year)) {
    //       //   starting_month = 1;
    //       // }
    //     }

    //     //If it is the last year loop and if salary_month_to is present set the max_salary_month to salary_month_to value inorder to avoid datas after this salary_month_to value
    //     if (Number(salary_year) === Number(max_salary_year)) {
    //       if (salary_month_to) {
    //         max_salary_month = Number(salary_month_to);
    //       }
    //     }
    //   }
    // }
    // //mapping through  users data inorder to findout users id exists in salary history or not
    // //   users_data.map((e) => {

    // // })

    // // //console.log("Paid user datas: ", paid);
    // // //console.log("Unpaid user datas: ", unpaid);

    // // let isFound = salary_history_data.some((obj) => obj.user === user_id);

    // //   if (!isFound) {

    // //     let joining_date = e.official_details.date_of_join;
    // //     //console.log("Joining date : ", joining_date);

    // //     let joining_year = joining_date.split("-")[0];
    // //     let joining_month = joining_date.split("-")[1];

    // //     //console.log("Joining_year : ", joining_year);
    // //     //console.log("Joining month : ", joining_month);

    // //     unpaid.push({
    // //       user: e._id,
    // //       salary: salary,
    // //       addition : [],
    // //       deduction : [],
    // //       payment: [],
    // //       salary_year: salary_year,
    // //       salary_month : salary_month
    // //     });
    // //   }else {
    // //     //console.log("User id not found")
    // //   }
    // // });

    // //Save blank payment history to database
    // // let blank_salaries_data = await salaries.insertMany(blank_payment_history);

    // // if (blank_salaries_data) {
    // //   //console.log("Blank salary payment datas added to database");
    // // }

    // // let response_salary_histories = await salaries.find({salary_date : isoDate}).populate('user','personel_details.first_name personel_details.last_name ').skip(pageSize * (pageNumber - 1)).limit(pageSize);

    // // let total_pages = Math.ceil(count / pageSize);

    // // let data = {
    // //   count: count,
    // //   totalPages: total_pages,
    // //   currentPage: pageNumber,
    // //   datas: salary_history_data,
    // // };

    // // if (salary_history_data) {
    // //   let response = success_function({
    // //     status: 200,
    // //     data: data,
    // //     message: "Salary histories fetched successfully",
    // //   });

    // //   res.status(response.statusCode).send(response);
    // //   return;
    // // } else {
    // //   let response = success_function({
    // //     status: 404,
    // //     message: "No datas found",
    // //   });

    // //   res.status(response.statusCode).send(response);
    // //   return;
    // // }

    let total_pages = Math.ceil(count / pageSize);

    let data = {
      count: count,
      totalPages: total_pages,
      currentPage: pageNumber,
      datas: salary_history_data,
    };

    if (salary_history_data) {
      let response = success_function({
        status: 200,
        data: data,
        message: "Salary histories fetched successfully",
      });

      res.status(response.statusCode).send(response);
      return;
    } else {
      let response = success_function({
        status: 404,
        message: "No datas found",
      });

      res.status(response.statusCode).send(response);
      return;
    }

    // } else {
    //   let response = error_function({
    //     status: 404,
    //     message: "Requested user not found",
    //   });
    //   res.status(response.statusCode).send(response);
    //   return;
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

exports.runPayroll = async function (req, res) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader ? authHeader.split(" ")[1] : null;
    let decoded = jwt.decode(token);

    let user = await users.findOne({ $and: [{ _id: decoded.user_id }, { deleted: { $ne: true } }] });

    // if (!token) {
    //   let response = error_function({
    //     status: 400,
    //     message: "Token is required",
    //   });
    //   res.status(response.statusCode).send(response);
    //   return;
    // }

    // const user_id = req.body.user_id;
    // const paid_amount = req.body.paid_amount;

    //Gets array of objects, objects include  user_id, paid_amount, total_salary
    const payrolls_data = req.body.payrolls_data; //Sends data of the

    // const remaining_payments = req.body.remaining_payments;

    // //console.log("Payrolls data : ", payrolls_data);
    // //console.log("Payrolls data length : ", payrolls_data.length);

    let info = [];
    let doc_updated = 0;
    let doc_upserted = 0;
    let checkSavedOrUpdated = [];

    if (payrolls_data.length > 0) {
      let payroll_history = await Promise.all(
        payrolls_data.map(async (e) => {
          let salary_history_data = {
            organization: user.organization
          };

          let payment = [];

          let payment_info = {};

          if (e.user_id) {
            salary_history_data.user = e.user_id;
          } else {
            // let response = error_function({
            //   status: 400,
            //   data: e.user_id,
            //   message: "User_id is required",
            // });
            // res.status(response.statusCode).send(response);

            throw new Error("User_id is required");
          }

          if (e.salary) {
            salary_history_data.salary = Number(e.salary);
          } else {
            // let response = error_function({
            //   status: 400,
            //   data: e.user_id,
            //   message: "Salary is required",
            // });
            // res.status(response.statusCode).send(response);

            throw new Error(`Salary is required for user id:${e.user_id}`);
          }

          //console.log("Addition : ......", e.addition);
          // if (e.addition) {

          //   // salary_history_data.addition = Number(e.addition);
          //   // salary_history_data.addition = e.addition;
          //   let addition_data = [];

          //   e.addition.map((e) => {
          //     if(e.new == "true") {
          //       addition_data.push({"label" : e.label,"amount" : e.amount});
          //     }
          //   })
          //   //console.log("Addition data : ", addition_data);

          //   if(addition_data.length > 0) {

          //     //console.log("Reached here.....Addition datas found");
          //     // salary_history_data.addition = [...addition, ...addition_data];

          //     let existing_addition_histories = await

          //     // salary_history_data.$push = {addition : {$each : [addition_data]}}
          //     //console.log("History data from addition : ", salary_history_data);
          //   }

          //   // else {
          //   //   //console.log("Reached here...");

          //   //   salary_history_data.addition = [...addition];
          //   // }

          //   // salary_history_data.$push = {addition : {$each} }
          // } else {
          //   // let response = error_function({
          //   //   status: 400,
          //   //   data: e.user_id,
          //   //   message: "Addition is required",
          //   // });
          //   // res.status(response.statusCode).send(response);

          //   // throw new Error("Addition is required");

          //   //console.log("Addition not found...");
          // }

          // if (e.deduction) {
          //   // salary_history_data.deduction = Number(e.deduction);
          //   salary_history_data.deduction = e.deduction;

          //   let deduction_data = [];

          //   e.deduction.map((e) => {
          //     if(e.new == "true") {
          //       deduction_data.push({"label" : e.label, "amount" : e.amount});
          //     }
          //   })

          //   if(deduction_data.length > 0) {
          //     salary_history_data.deduction = [...deduction, ...deduction_data]
          //   }else {
          //     salary_history_data.deduction = [...deduction];
          //   }

          // } else {
          //   // let response = error_function({
          //   //   status: 400,
          //   //   data: e.user_id,
          //   //   message: "Deduction is required",
          //   // });
          //   // res.status(response.statusCode).send(response);

          //   // throw new Error("Deduction is required");
          //   //console.log("Deduction not found...");
          // }

          // let total = Number(e.salary) + Number(e.addition) - Number(e.deduction);

          // if (e.total) {
          //   if (Number(e.total) !== Number(total)) {
          //     // res
          //     //   .status(400)
          //     //   .send({ data: e.user_id, message: "Incorrect total value" });
          //     throw new Error("Incorrect total value");
          //   } else {
          //     salary_history_data.total = Number(total);
          //   }
          // } else {
          //   // let response = error_function({
          //   //   status: 400,
          //   //   data: e.user_id,
          //   //   message: "Total is required",
          //   // });
          //   // res.status(response.statusCode).send(response);
          //   throw new Error("Total is required");
          // }

          if (e.salary_year) {
            salary_history_data.salary_year = Number(e.salary_year);
          } else {
            // let response = error_function({
            //   status: 400,
            //   data: e.user_id,
            //   message: "Salary year is required",
            // });
            // res.status(response.statusCode).send(response);

            throw new Error(`Salary year is required for user:${e.user_id}`);
          }

          if (e.salary_month) {
            salary_history_data.salary_month = Number(e.salary_month);
          } else {
            // let response = error_function({
            //   status: 400,
            //   data: e.user_id,
            //   message: "Salary month is required",
            // });
            // res.status(response.statusCode).send(response);

            throw new Error(`Salary month is required for user:${e.user_id}`);
          }

          if (e.paid_amount) {
            // payment.push({"paid_amount" : Number(e.paid_amount), "paid_date" : dayjs().format()})
            // let payment = {$push : {payment : {"paid_amount" : Number(e.paid_amount), "paid_date" : dayjs().format()}}};
            let payment = {
              paid_amount: Number(e.paid_amount),
              paid_date: dayjs().format(),
            };

            salary_history_data.$push = { payment: payment };
          } else {
            // let response = error_function({
            //   status: 400,
            //   data: e.user_id,
            //   message: "Paid amount is required",
            // });
            // res.status(response.statusCode).send(response);

            throw new Error("Paid amount is required");
          }

          //Checking if currently paid amount is greater than current total or not
          // if (Number(e.paid_amount) > Number(e.total)) {
          //   // let response = error_function({
          //   //   status: 400,
          //   //   data: e.user_id,
          //   //   message: "Paid amount greater than total amount",
          //   // });
          //   // res.status(response.statusCode).send(response);

          //   throw new Error("Paid amount greater than total amount");
          // }

          //Validations
          if (e.date_of_join) {
            // let isValid = dayjs(e.date_of_join).isValid();
            // if(isValid) {

            //   let parsed_date = dayjs(e.date_of_join);
            // }else {
            //   let response = error_function({"status" : 400, "message" : "Joining date is invalid"});
            //   res.status(response.statusCode).send(response);
            // }
            // let user_join_date = await users.findOne({_id : e.user_id}).official_details.date_of_join;

            let date_of_join = (
              await users.findOne(
                { _id: e.user_id },
                "official_details.date_of_join"
              )
            ).official_details.date_of_join;
            //console.log("Date of join from database : ", date_of_join);

            if (e.date_of_join !== date_of_join) {
              throw new Error(
                `Incorrect date of join for user id:${e.user_id}`
              );
            }

            let month_of_join = dayjs(e.date_of_join).month();
            //console.log("Month of join : ", month_of_join);

            let year_of_join = dayjs(e.date_of_join).year();
            //console.log("Year of join : ", year_of_join);

            let salary_date = dayjs(e.salary_year+"-"+e.salary_month+"-"+dayjs(e.date_of_join).date()).format("YYYY-MM-DD");
            //console.log(salary_date)

            if (dayjs(e.date_of_join).isSameOrBefore(salary_date)) {
              //console.log("salary_history_data : ", salary_history_data);

              //Checking if history exist or not based on a filter

              let filter = {
                $and: [
                  { user: e.user_id },
                  { salary_year: e.salary_year },
                  { salary_month: e.salary_month },
                ],
              };
              let countDocuments = await salary_history.countDocuments(filter);
              //console.log("Documents needs to be updated : ", countDocuments);
              payment_info.user_id = e.user_id;
              payment_info.countDocuments = countDocuments;

              //according to count predict if need upsert or update
              if (Number(countDocuments) > 0) {
                payment_info.need_update = "true";
                payment_info.need_upsert = "false";
              } else {
                payment_info.need_update = "false";
                payment_info.need_upsert = "true";
              }

              // let save_payment_history = await salary_history.findOneAndUpdate(filter, salary_history_data, { new: true,upsert : true, rawResult : true});

              //console.log("Filter : ", filter);
              let isFound = await salary_history.findOne(filter);

              //console.log("isFound : ", isFound);

              if (isFound) {
                let salary = isFound.salary;

                //console.log("Documents found and need update...");
                //console.log("Salary from history : ", salary);

                //Calculating total_paid salary from history
                let total_paid_salary = 0;

                let payment = isFound.payment;
                //console.log("Payment array from history : ", payment);

                // let history_total = isFound.total;

                payment.map((e) => {
                  total_paid_salary = total_paid_salary + Number(e.paid_amount);
                });

                //console.log("Total paid salary : ", total_paid_salary);

                // if(Number(e.paid_amount) >= total_paid_salary) {
                //   let response = error_function({"status" : 400, data: e.user_id, "message" : ""});
                //   res.status(response.statusCode).send(response);
                // }

                let history_addition = isFound.addition;
                let history_deduction = isFound.deduction;

                if (e.addition) {
                  // salary_history_data.addition = Number(e.addition);
                  // salary_history_data.addition = e.addition;
                  let addition_data = [];

                  e.addition.map((e) => {
                    if (e.new == "true") {
                      addition_data.push({
                        label: e.label,
                        amount: e.amount,
                        date: dayjs().format(),
                      });
                    }
                  });
                  //console.log("Addition data : ", addition_data);

                  if (addition_data.length > 0) {
                    //console.log("Reached here.....Addition datas found");
                    salary_history_data.addition = [
                      ...history_addition,
                      ...addition_data,
                    ];

                    // salary_history_data.$push = {addition : {$each : [addition_data]}}
                    
                  } else {
                    //console.log("Reached here...");

                    salary_history_data.addition = [...history_addition];
                  }

                  

                  // salary_history_data.$push = {addition : {$each} }
                } else {
                  // let response = error_function({
                  //   status: 400,
                  //   data: e.user_id,
                  //   message: "Addition is required",
                  // });
                  // res.status(response.statusCode).send(response);

                  // throw new Error("Addition is required");

                  //console.log("Addition not found...");
                }

                if (e.deduction) {
                  // salary_history_data.deduction = Number(e.deduction);
                  salary_history_data.deduction = e.deduction;

                  let deduction_data = [];

                  e.deduction.map((e) => {
                    if (e.new == "true") {
                      deduction_data.push({
                        label: e.label,
                        amount: e.amount,
                        date: dayjs().format(),
                      });
                    }
                  });

                  if (deduction_data.length > 0) {
                    salary_history_data.deduction = [
                      ...history_deduction,
                      ...deduction_data,
                    ];
                  } else {
                    salary_history_data.deduction = [...history_deduction];
                  }
                } else {
                  // let response = error_function({
                  //   status: 400,
                  //   data: e.user_id,
                  //   message: "Deduction is required",
                  // });
                  // res.status(response.statusCode).send(response);

                  // throw new Error("Deduction is required");
                  //console.log("Deduction not found...");
                }

                let history_total_addition = 0;
                let history_total_deduction = 0;

                if (history_addition.length > 0) {
                  history_addition.map((e) => {
                    history_total_addition =
                      history_total_addition + Number(e.amount);
                  });
                }

                if (history_deduction.length > 0) {
                  history_deduction.map((e) => {
                    history_total_deduction =
                      history_total_deduction + Number(e.amount);
                  });
                }

                let history_total =
                  Number(salary) +
                  Number(history_total_addition) -
                  Number(history_total_deduction);
                

                //Checking if salary is fully paid or not
                if (
                  // total_paid_salary >= Number(salary) ||
                  total_paid_salary >= Number(history_total)
                ) {
                  // let response = error_function({
                  //   status: 400,
                  //   data: e.user_id,
                  //   message: "Salary already paid",
                  // });
                  // res.status(response.statusCode).send(response);

                  throw new Error(
                    `Salary already paid for user id:${e.user_id}`
                  );
                }

                //Checking if addition from client matches history or not
                // if(Number(e.addition) !== Number(isFound.addition)) {
                //   // let response = error_function({
                //   //   status: 400,
                //   //   data: e.user_id,
                //   //   message: "Incorrect addition amount",
                //   // });
                //   // res.status(response.statusCode).send(response);

                //   throw new Error("Incorrect addition amount");
                // }

                //Checking if deduction from client matches history or not
                // if(Number(e.deduction) !== Number(isFound.deduction)) {
                //   // let response = error_function({
                //   //   status: 400,
                //   //   data: e.user_id,
                //   //   message: "Incorrect deduction amount",
                //   // });
                //   // res.status(response.statusCode).send(response);

                //   throw new Error("Incorrect deduction amount");
                // }

                //checking if total from client matches history or not
                // if(Number(e.total) !== Number(isFound.total)) {
                //   // let response = error_function({
                //   //   status: 400,
                //   //   data: e.user_id,
                //   //   message: "Incorrect total amount",
                //   // });
                //   // res.status(response.statusCode).send(response);

                //   throw new Error("Incorrect total amount");
                // }
                //Checking if currently paid amount greater than history salary or history total
                if (
                  // Number(e.paid_amount) >= Number(salary) ||
                  Number(e.paid_amount) >= Number(history_total)
                ) {
                  // let response = error_function({
                  //   status: 400,
                  //   data: e.user_id,
                  //   message: "Paid amount too high",
                  // });
                  // res.status(response.statusCode).send(response);

                  throw new Error("Paid amount too high");
                }

                //Checking if the salary in history matched from front-end

                if (Number(salary) !== Number(e.salary)) {
                  // let response = error_function({
                  //   status: 400,
                  //   data: e.user_id,
                  //   message: "Incorrect salary",
                  // });
                  // res.status(response.statusCode).send(response);

                  throw new Error("Incorrect salary");
                } else {
                  
                  let save_payment_history = await salary_history.updateOne(
                    filter,
                    salary_history_data
                  );

                  if (
                    save_payment_history.matchedCount ===
                      save_payment_history.modifiedCount &&
                    save_payment_history.acknowledged
                  ) {
                    checkSavedOrUpdated.push("true");

                    doc_updated = doc_updated + 1;
                    payment_info.created = "false";
                    payment_info.updated = "true";
                  } else {
                    checkSavedOrUpdated.push("false");
                  }
                }
              } else {
                //Calculating salary from users model
                let user = await users.findOne({ _id: e.user_id });
                let total_salary = Number(user.salary);

                // let total_salary = 0;

                // salary.map((e) => {
                //   total_salary = total_salary + Number(e.value);
                // });

                // //console.log("Reached Here ...");
                //console.log("No document found and need to insert one....");
                //console.log("total_salary : ", total_salary);

                if (e.addition) {
                  // salary_history_data.addition = Number(e.addition);
                  // salary_history_data.addition = e.addition;
                  let addition_data = [];

                  e.addition.map((e) => {
                    if (e.new == "true") {
                      addition_data.push({
                        label: e.label,
                        amount: e.amount,
                        date: dayjs().format(),
                      });
                    }
                  });
                  //console.log("Addition data : ", addition_data);

                  if (addition_data.length > 0) {
                    //console.log("Reached here.....Addition datas found");
                    // salary_history_data.addition = [...history_addition, ...addition_data];

                    salary_history_data.addition = addition_data;

                    // salary_history_data.$push = {addition : {$each : [addition_data]}}
                    
                  } else {
                    //console.log("Reached here...");

                    salary_history_data.addition = [];
                  }

                  

                  // salary_history_data.$push = {addition : {$each} }
                } else {
                  // let response = error_function({
                  //   status: 400,
                  //   data: e.user_id,
                  //   message: "Addition is required",
                  // });
                  // res.status(response.statusCode).send(response);

                  // throw new Error("Addition is required");

                  //console.log("Addition not found...");
                }

                if (e.deduction) {
                  // salary_history_data.deduction = Number(e.deduction);
                  salary_history_data.deduction = e.deduction;

                  let deduction_data = [];

                  e.deduction.map((e) => {
                    if (e.new == "true") {
                      deduction_data.push({
                        label: e.label,
                        amount: e.amount,
                        date: dayjs().format(),
                      });
                    }
                  });

                  if (deduction_data.length > 0) {
                    salary_history_data.deduction = deduction_data;
                  } else {
                    salary_history_data.deduction = [];
                  }
                } else {
                  // let response = error_function({
                  //   status: 400,
                  //   data: e.user_id,
                  //   message: "Deduction is required",
                  // });
                  // res.status(response.statusCode).send(response);

                  // throw new Error("Deduction is required");
                  //console.log("Deduction not found...");
                }

                //Checking if value from client equals total_salary or not
                if (total_salary == Number(e.salary)) {
                  salary_history_data.payment =
                    salary_history_data.$push.payment;
                  delete salary_history_data.$push;
                  

                  // let save_payment_history = await salary_history.create(salary_history_data);
                  let save_payment_history = await new salary_history(
                    salary_history_data
                  );

                  let saved_history = await save_payment_history.save();

                  if (saved_history) {
                    checkSavedOrUpdated.push("true");

                    doc_upserted = doc_upserted + 1;
                    payment_info.created = "true";
                    payment_info.updated = "false";
                  } else {
                    checkSavedOrUpdated.push("false");
                  }
                } else {
                  // let response = error_function({
                  //   status: 400,
                  //   data: e.user_id,
                  //   message: "Incorrect salary",
                  // });
                  // res.status(response.statusCode).send(response);

                  throw new Error(`Incorrect salary for user id:${e.user_id}`);
                }
              }

              // if (save_payment_history.lastErrorObject.updatedExisting) {
              //   doc_updated = doc_updated + 1;
              //   payment_info.updated = "true";
              //   payment_info.upserted = "false";
              // } else {
              //   doc_upserted = doc_upserted + 1;
              //   payment_info.updated = "false";
              //   payment_info.upserted = "true";
              // }

              info.push(payment_info);

              return salary_history_data;
            } else {
              // let response = error_function({
              //   status: 400,
              //   data: e.user_id,
              //   message: "User not eligible for salary",
              // });
              // res.status(response.statusCode).send(response);
              //console.log(e)
              throw new Error("User not eligible for salary");
            }
          } else {
            // let response = error_function({
            //   status: 400,
            //   data: e.user_id,
            //   message: "Joining date is required",
            // });
            // res.status(response.statusCode).send(response);

            throw new Error("Joining date is required");
          }

          // salary_history_data.addition = e.addition;
          // salary_history_data.deduction = e.deduction;
          // salary_history_data.total = total;
          // salary_history_data.salary_year = e.salary_year;
          // salary_history_data.salary_month = e.salary_month;
        })
      );

      let data = {
        updated_transactions: doc_updated,
        new_transactions: doc_upserted,
        transaction_datas: info,
        payrolls_data: payroll_history,
      };

      // //console.log("Payroll History : ", payroll_history);
      //       //console.log("Transaction datas : ", data);
      // const savePayments = await salary_history.updateMany({$and : [{user : user_id}]})

      let flag;

      checkSavedOrUpdated.map((e) => {
        if (e == "false") {
          flag = 0;
        }
      });

      //console.log("Flag : ", flag);

      if (flag == 0) {
        let response = error_function({
          status: 400,
          message: "Transaction failures found",
        });
        res.status(response.statusCode).send(response);
        return;
      } else {
        let response = success_function({
          status: 200,
          data: data,
          message: "Payments successful",
        });
        res.status(response.statusCode).send(response);
        return;
      }
    } else {
      let response = error_function({ status: 204, message: "No payments" });
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

exports.salaryListView = async function (req, res) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader ? authHeader.split(" ")[1] : null;

    // if (!token) {
    //   let response = error_function({
    //     status: 400,
    //     message: "Token is required",
    //   });
    //   res.status(response.statusCode).send(response);
    // }

    let user_id = req.query.user_id;
    let salary_id = req.query.salary_id;

    //console.log("User id : ", user_id);

    let salary_history_data = await salary_history
      .find({ user: user_id })
      .populate(
        "user",
        "personel_details.first_name personel_details.last_name official_details.job_title salary"
      );

    if (salary_history_data) {
      let response = success_function({
        status: 200,
        data: salary_history_data,
        message: "Salary details fetched successfully",
      });
      res.status(response.statusCode).send(response);
      return;
    } else {
      let response = error_function({
        status: 404,
        message: "Salary history not found",
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

exports.fetchSalaryTemplate = async function (req, res) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader ? authHeader.split(" ")[1] : null;

    let decoded = jwt.decode(token);

    let salary_template_ids = req.query.salary_template_ids;
    let ids;
    let filters = [];

    if (salary_template_ids) {
      ids = salary_template_ids.split(",");

      if (ids) {
        filters.push({ _id: { $in: ids } });
      }
    }

    //Finding organization_id of request user of user_type organization
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
    } else {
      //console.log("User is admin");
    }

    //Avoiding deleted user
    filters.push({ deleted: { $ne: true } });

    //console.log("Filters : ", filters);
    let salary_template_data = await salary_template.find(
      filters.length > 0 ? { $and: filters } : null,
      "-createdAt -updatedAt -__v"
    );

    if (salary_template) {
      let response = success_function({
        status: 200,
        data: salary_template_data,
        message: "Salary template fetched successfully",
      });
      res.status(response.statusCode).send(response);
      return;
    } else {
      let response = error_function({ status: 400, message: "No datas found" });
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

exports.newSalaryTemplate = async function (req, res) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader ? authHeader.split(" ")[1] : null;
    let decoded = jwt.decode(token);

    let template_data = req.body.template_data;

    let salary_template_data = {};

    //Finding organization_id of request user of user_type organization
    //Getting organization_id and user_type of the login user
    let user = await users
      .findOne({ _id: decoded.user_id })
      .populate("user_type");
    let user_type = user.user_type.user_type;
    let organization_id = user.organization;

    for (let i = 0; i < template_data.length; i++) {
      if (!template_data[i].label) {
        let response = error_function({
          status: 400,
          data: template_data[i],
          message: "Label is required",
        });
        res.status(response.statusCode).send(response);
        return;
      }

      if (!template_data[i].percentage) {
        let response = error_function({
          status: 400,
          data: template_data[i],
          message: "Percentage is required",
        });
        res.status(response.statusCode).send(response);
        return;
      }
    }

    salary_template_data.organization = organization_id;
    salary_template_data.added_by = decoded.user_id;
    salary_template_data.salary_template = template_data;

    //console.log("Salary_template : ", salary_template_data);
    let saveTemplate = new salary_template(salary_template_data);
    let templateSaved = saveTemplate.save();

    if (templateSaved) {
      //console.log("saveTemplate : ", saveTemplate);
      let response = success_function({
        status: 201,
        data: saveTemplate,
        message: "Salary template created successfully",
      });
      res.status(response.statusCode).send(response);
      return;
    } else {
      let response = error_function({
        status: 400,
        message: "Salary template not created",
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

exports.updateSalaryTemplate = async function (req, res) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader ? authHeader.split(" ")[1] : null;
    let decoded = jwt.decode(token);

    let salary_template_ids = req.body.salary_template_ids;
    let template_data = req.body.template_data;
    let salary_template_data = {};

    if (!salary_template_ids || salary_template_ids.length < 1) {
      let response = error_function({
        status: 400,
        message: "Template ids is required",
      });
      res.status(response.statusCode).send(response);
      return;
    }

    for (let i = 0; i < template_data.length; i++) {
      if (!template_data[i].label) {
        let response = error_function({
          status: 400,
          data: template_data[i],
          message: "Label is required",
        });
        res.status(response.statusCode).send(response);
        return;
      }

      if (!template_data[i].percentage) {
        let response = error_function({
          status: 400,
          data: template_data[i],
          message: "Percentage is required",
        });
        res.status(response.statusCode).send(response);
        return;
      }

      // if(!template_data[i].added_by) {
      //   let response = error_function({
      //     status: 400,
      //     data: template_data[i],
      //     message: "Percentage is required",
      //   });
      //   res.status(response.statusCode).send(response);
      //   return;
      // }
    }

    // let updateTemplate = await salary_template.findOneAndUpdate(
    //   { _id: template_id },
    //   { salary_template: template_data },
    //   { new: true, rawResult: true }
    // );

    salary_template_data.last_updated_by = decoded.user_id;
    salary_template_data.salary_template = template_data;

    //console.log("Salary template data : ", salary_template_data);

    const updateDocuments = salary_template_ids.map((id) => ({
      updateOne: {
        filter: { $and: [{ _id: id }, { deleted: { $ne: true } }] },
        update: salary_template_data,
      },
    }));

    let updated_documents = await salary_template.bulkWrite(updateDocuments);

    if (
      updated_documents &&
      Number(updated_documents.matchedCount) ===
        Number(salary_template_ids.length) &&
      Number(updated_documents.modifiedCount) ===
        Number(salary_template_ids.length)
    ) {
      let response = success_function({
        status: 201,
        data: updated_documents,
        message: "Salary template updated successfully",
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

exports.deleteSalaryTemplate = async function (req, res) {
  try {
    const authHeader = req.headers["authorization"];
    let token = authHeader ? authHeader.split(" ")[1] : null;

    let target_datas = req.body.target_datas; // Should be an array
    let deleted_datas = 0;

    // let deleted_data = await salary_template.deleteMany({
    //   _id: { $in: target_datas },
    // });
    // let deleted_count = deleted_data.deletedCount;

    //

    for (let i = 0; i < target_datas.length; i++) {
      let target_id = target_datas[i];

      let target_data = await salary_template.findOne({
        $and: [{ _id: target_id }, { deleted: { $ne: true } }],
      });

      //console.log("Target data : ", target_data);

      if (target_data) {
        let delete_data = await target_data.delete();

        let save_delete = await delete_data.save();

        if (save_delete) {
          deleted_datas = deleted_datas + 1;
        }
      }

      if (Number(target_datas.length) === Number(deleted_datas)) {
        let response = success_function({
          status: 200,
          message: "Salary templates deleted successfully",
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

exports.salaryListing = async function (req, res) {
  try {
    const authHeader = req.headers["authorization"];
    let token = authHeader ? authHeader.split(" ")[1] : null;
    const decoded = jwt.decode(token);

    let salary_year = Number(req.query.salary_year);
    let salary_month = Number(req.query.salary_month);

    let page = Number(req.query.page); // Current page number
    let pageSize = Number(req.query.pageSize); // Number of items per page

    // //console.log("Page : ", page);
    // //console.log("pageSize : ", pageSize);

    let user = await users
      .findOne({ _id: decoded.user_id })
      .populate("user_type");
    let user_type = user.user_type.user_type;
    let organization_id = user.organization;
    // //console.log("Login user : ", user);
    // //console.log("User Type : ", user_type);
    // //console.log("Organization id : ", organization_id);
    //Selects the user id's already present in the salary_history of that particular year and month
    // let salary_users = await salary_history.distinct("user", {$and: [{salary_month}, {salary_year}]});
    let salary_users = await salary_history.distinct("user", {
      $and: [
        { salary_month: Number(salary_month) },
        { salary_year: Number(salary_year) },
        { organization: organization_id },
      ],
    });

    let user_id = new mongoose.Types.ObjectId(decoded.user_id);

    salary_users.push(user_id);

    // let results = await users.aggregate([

    //   {
    //     $match: {
    //       $and: [
    //         { _id: { $nin: salary_users } },
    //         {
    //           $expr: {
    //             $or: [
    //               {
    //                 $lt: [
    //                   { $year: { $dateFromString: { dateString: "$official_details.date_of_join" } } },
    //                   salary_year,
    //                 ],
    //               },
    //               {
    //                 $and: [
    //                   {
    //                     $eq: [
    //                       { $year: { $dateFromString: { dateString: "$official_details.date_of_join" } } },
    //                       salary_year,
    //                     ],
    //                   },
    //                   {
    //                     $lte: [
    //                       { $month: { $dateFromString: { dateString: "$official_details.date_of_join" } } },
    //                       salary_month,
    //                     ],
    //                   },
    //                 ],
    //               },
    //             ],
    //           },
    //         },
    //       ],
    //     },
    //   },

    //   { $project: { personel_details: 1, official_details : 1} },
    //   {
    //     $unionWith: {
    //       coll: "salary_histories",
    //       pipeline: [{$match: {$and : [{salary_year : {$eq : salary_year}},{salary_month : {$eq : salary_month}}]}},{
    //         $lookup: {
    //           from: "users", // Replace with the actual collection name for users
    //           localField: "user",
    //           foreignField: "_id",
    //           as: "user",
    //         },
    //       },
    //       {
    //         $project: {
    //           user: {
    //             $let: {
    //               vars: {
    //                 userObj: { $arrayElemAt: ["$user", 0] },
    //               },
    //               in: {
    //                 _id: "$$userObj._id",
    //                 personel_details: "$$userObj.personel_details",
    //                 official_details : "$$userObj.official_details"
    //                 // Add other necessary fields from the user object
    //               },
    //             },
    //           },
    //           salary: 1,
    //           salary_year: 1,
    //           salary_month: 1,
    //           addition : 1,
    //           deduction : 1,
    //           payment : 1
    //         },
    //       },
    //       { $skip: (page - 1) * pageSize }, // Calculate number of documents to skip
    //     { $limit: pageSize }, // Limit the number of documents per page
    //     ],
    //     },
    //   },

    //   // {
    //   //   $facet: {
    //   //     data: [
    //   //       { $skip: (page - 1) * pageSize },
    //   //       { $limit: pageSize },
    //   //     ],
    //   //     metadata: [
    //   //       { $count: "totalItems" },
    //   //       {
    //   //         $addFields: {
    //   //           totalPages: {
    //   //             $ceil: { $divide: ["$totalItems", pageSize] },
    //   //           },
    //   //           currentPage: page,
    //   //         },
    //   //       },
    //   //     ],
    //   //   },
    //   // }

    //   {
    //     $facet: {
    //       data: [
    //         { $skip: (page - 1) * pageSize },
    //         { $limit: pageSize },
    //       ],
    //       metadata: [
    //         { $count: "totalItems" },
    //         {
    //           $addFields: {
    //             totalPages: {
    //               $ceil: { $divide: ["$totalItems", pageSize] },
    //             },
    //             currentPage: page,
    //           },
    //         },
    //       ],
    //     },
    //   }

    // ]);

    let results = await users.aggregate([
      // {
      //   $match: {
      //     _id: { $ne: user_id } // Exclude decoded.user_id from the match
      //   }
      // },
      {
        $match: {
          $and: [
            { _id: { $nin: salary_users } },
            { organization: organization_id },
            {
              $expr: {
                $or: [
                  {
                    $lt: [
                      {
                        $year: {
                          $dateFromString: {
                            dateString: "$official_details.date_of_join",
                          },
                        },
                      },
                      salary_year,
                    ],
                  },
                  {
                    $and: [
                      {
                        $eq: [
                          {
                            $year: {
                              $dateFromString: {
                                dateString: "$official_details.date_of_join",
                              },
                            },
                          },
                          salary_year,
                        ],
                      },
                      {
                        $lte: [
                          {
                            $month: {
                              $dateFromString: {
                                dateString: "$official_details.date_of_join",
                              },
                            },
                          },
                          salary_month,
                        ],
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
      },
      {
        $project: {
          personel_details: 1,
          official_details: 1,
          salary: 1,
          organization: 1,
          email: 1,
          date_of_join: 1,
        },
      },
      {
        $unionWith: {
          coll: "salary_histories",
          pipeline: [
            {
              $match: {
                $and: [
                  { salary_year: { $eq: salary_year } },
                  { salary_month: { $eq: salary_month } },
                ],
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
              },
            },
            {
              $project: {
                user: {
                  $let: {
                    vars: {
                      userObj: { $arrayElemAt: ["$user", 0] },
                    },
                    in: {
                      _id: "$$userObj._id",
                      personel_details: "$$userObj.personel_details",
                      official_details: "$$userObj.official_details",
                      salary: "$$userObj.salary",
                      organization: "$$userObj.organization",
                      email: "$$userObj.email",
                      date_of_join: "$$userObj.date_of_join",
                    },
                  },
                },
                salary: 1,
                salary_year: 1,
                salary_month: 1,
                addition: 1,
                deduction: 1,
                payment: 1,
              },
            },
          ],
        },
      },
      {
        $facet: {
          data: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }],
          metadata: [
            { $group: { _id: null, totalItems: { $sum: 1 } } },
            {
              $project: {
                _id: 0,
                totalItems: 1,
                totalPages: {
                  $ceil: {
                    $divide: [{ $sum: "$totalItems" }, pageSize],
                  },
                },
                currentPage: page,
              },
            },
          ],
        },
      },
    ]);

    // Extracting the results from the 'data' and 'metadata' arrays

    let response = success_function({
      status: 200,
      data: results,
      message: "Salary history fetched successfully",
    });
    res.status(response.statusCode).send(response);
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

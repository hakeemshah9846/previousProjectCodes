const usersModel = require('../db/models/users');
const printPagesModel = require('../db/models/print_pages');
// const job_print_operators_model = require('../db/models/job_print_operator');
const job_print_colors_model = require('../db/models/print_pages_colors');
// const print_pages_printers_model = require('../db/models/print_pages_printer');
// const print_pages_paper_types_model = require('../db/models/print_pages_paper_type');
const print_pages_machines_model = require('../db/models/print_pages_machine');
const operatorsModel = require('../db/models/operators');
const printersModel = require('../db/models/printers');
const papersModel = require('../db/models/papers');
const jwt  = require('jsonwebtoken');
const printer_papers = require('../db/models/printer_papers');
const sequelize = require('../db/db-conn');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const print_pages_colors = require('../db/models/print_pages_colors');


exports.createNew = async function(token, job_id, job_paper_cost, job_print_cost, job_req_stappled, job_req_lamination, job_print_operator, job_print_color, print_sides, job_print_pages, print_pages_printer, job_print_quantity,  paper_type, job_req_paper_quantity, job_print_comment, job_print_total) {

    return new Promise(async (resolve, reject) => {
        try {
            
            const decoded = jwt.decode(token);
            const user = await usersModel.findByPk(decoded.user_id);
            console.log("Token : ", token);
  
            if(user) {
              
                if(job_id && job_paper_cost && job_print_cost && job_print_operator && job_req_lamination && job_req_stappled && job_print_color && print_sides && job_print_pages && print_pages_printer && job_print_quantity &&  paper_type && job_req_paper_quantity && job_print_comment  && job_print_total) {
                  
                  // let job_print_operator_id = (await operatorsModel.findOne({where : {operator_name : job_print_operator}, attributes : ['id'], raw : true})).id;
                  // console.log("job_print_operator_id : ", job_print_operator_id);
  
                  // let job_print_color_id = (await job_print_colors_model.findOne({where : {job_print_color : job_print_color}, attributes : ['id'], raw : true})).id;
                  // console.log("job_print_color_id : ", job_print_color_id);
  
                  // let print_pages_printer_id = (await printersModel.findOne({where : {name : print_pages_printer}, attributes : ['id'], raw : true})).id;
                  // console.log("print_pages_printer_id : ", print_pages_printer_id);
  
                  // let paper_type_id = (await papersModel.findOne({where : {paper_name : paper_type}, attributes : ['id'], raw : true})).id;
                  // console.log("paper_type_id : ", paper_type_id);
  
                    // let print_pages_machine_id = (await print_pages_machines_model.findOne({where : {machine : print_pages_machine}, attributes : ['id'], raw : true})).id;
                    // console.log("print_pages_machine_id : ", print_pages_machine_id);
  
  
  
  
                    let new_instance = {
                        dev_flag : true,
                        job_id : job_id, // (id) sent from req body
                        job_print_operator_id : job_print_operator, // Dropdown (id)
                        job_print_color_id : job_print_color, // Dropdown (id)
                        print_sides : print_sides, // Single or Double
                        job_print_pages : job_print_pages,
                        // print_pages_printer_id : print_pages_printer_id, // Dropdown (id)
                        job_print_quantity : job_print_quantity,
                        paper_type_id : paper_type, // Dropdown (id)
                        job_req_paper_quantity : job_req_paper_quantity, 
                        job_print_comment : job_print_comment,
                        print_pages_machine : print_pages_printer, //Dropdown (id)
                        job_print_total : job_print_total,
                        job_print_cost : job_print_cost,
                        job_req_lamination : job_req_lamination,
                        job_req_stappled : job_req_stappled,
                        job_paper_cost : job_paper_cost
                    }
  
                    console.log("New Instance : ", new_instance);
  
                    //Saving to database
                    let newInstance = await printPagesModel.create(new_instance);
                    let saved = newInstance.save();

                    if(saved) {

                      resolve({"status" : 200, data : new_instance ,"message" : "New instance created for print pages section"});

                    }else {
                      reject({"status" : 400, "message" : "Cannot save"});

                    }
  
  
  
                }else {
                    reject({"status" : 400, "message" : "Datas not sufficient"});
                }
            }else {
              reject({"status" : 400, "message" : "Requested user not found"});
  
            }
  
        } catch (error) {
          reject({
            status: 400,
            message: error
              ? error.message
                ? error.message
                : error
              : "Something went wrong",
          });
        }
    })
  }


  exports.printPagesEdit = async function(token, print_page_id, job_id, job_paper_cost, job_print_cost, job_req_stappled, job_req_lamination, job_print_operator, job_print_color, print_sides, job_print_pages, print_pages_printer, job_print_quantity,  paper_type, job_req_paper_quantity, job_print_comment, job_print_total) {

    return new Promise(async (resolve, reject) => {
        try {
            
            const decoded = jwt.decode(token);
            const user = await usersModel.findByPk(decoded.user_id);
            console.log("Token : ", token);
  
            if(user) {
              
                if(print_page_id && job_id && job_paper_cost && job_print_cost && job_print_operator && job_req_lamination && job_req_stappled && job_print_color && print_sides && job_print_pages && print_pages_printer && job_print_quantity &&  paper_type && job_req_paper_quantity && job_print_comment  && job_print_total) {
                  
                  // let job_print_operator_id = (await operatorsModel.findOne({where : {operator_name : job_print_operator}, attributes : ['id'], raw : true})).id;
                  // console.log("job_print_operator_id : ", job_print_operator_id);
  
                  // let job_print_color_id = (await job_print_colors_model.findOne({where : {job_print_color : job_print_color}, attributes : ['id'], raw : true})).id;
                  // console.log("job_print_color_id : ", job_print_color_id);
  
                  // let print_pages_printer_id = (await printersModel.findOne({where : {name : print_pages_printer}, attributes : ['id'], raw : true})).id;
                  // console.log("print_pages_printer_id : ", print_pages_printer_id);
  
                  // let paper_type_id = (await papersModel.findOne({where : {paper_name : paper_type}, attributes : ['id'], raw : true})).id;
                  // console.log("paper_type_id : ", paper_type_id);
  
                    // let print_pages_machine_id = (await print_pages_machines_model.findOne({where : {machine : print_pages_machine}, attributes : ['id'], raw : true})).id;
                    // console.log("print_pages_machine_id : ", print_pages_machine_id);
  
  
  
  
                    let updated_instance = {
                        dev_flag : true,
                        job_id : job_id, // (id) sent from req body
                        job_print_operator_id : job_print_operator, // Dropdown (id)
                        job_print_color_id : job_print_color, // Dropdown (id)
                        print_sides : print_sides, // Single or Double
                        job_print_pages : job_print_pages,
                        // print_pages_printer_id : print_pages_printer_id, // Dropdown (id)
                        job_print_quantity : job_print_quantity,
                        paper_type_id : paper_type, // Dropdown (id)
                        job_req_paper_quantity : job_req_paper_quantity, 
                        job_print_comment : job_print_comment,
                        print_pages_machine : print_pages_printer, //Dropdown (id)
                        job_print_total : job_print_total,
                        job_print_cost : job_print_cost,
                        job_req_lamination : job_req_lamination,
                        job_req_stappled : job_req_stappled,
                        job_paper_cost : job_paper_cost
                    }
  
                    console.log("Updated Instance : ", updated_instance);
  
                    //Saving to database
                    let print_page_instance = await printPagesModel.findOne({where : {id : print_page_id}});

                    if(print_page_instance) {
                    
                    
                      if (print_page_instance.dev_flag == true) {
                        let jobId = print_page_instance.job_id;
                        console.log("jobId : ", jobId);
                        console.log("job_id : ", job_id);
  
                        if (jobId == job_id) {
                          let update = await print_page_instance.update(
                            updated_instance
                          );
                          let updated = update.save();
  
                          if (updated) {
                            resolve({
                              status: 200,
                              data: update,
                              message: "Update successful",
                            });
                          } else {
                            reject({
                              status: 400,
                              message: "Cannot update",
                            });
                          }
                        } else {
                          reject({
                            status: 400,
                            message:
                              "Wrong job_id",
                          });
                        }
                      } else {
                        reject({ status: 400, message: "Cannot update production datas during development and testing" });
                      }
  
                    }else {
  
                      reject({"status" : 400, "message" : "Cannot find print pages details from database"});
  
  
                    }
  
  
  
                }else {
                    reject({"status" : 400, "message" : "Datas not sufficient"});
                }
            }else {
              reject({"status" : 400, "message" : "Requested user not found"});
  
            }
  
        } catch (error) {
          reject({
            status: 400,
            message: error
              ? error.message
                ? error.message
                : error
              : "Something went wrong",
          });
        }
    })
  }


exports.fetchAllPrintPagesOperators = async function (token) {
    return new Promise(async (resolve, reject) => {
      try {
        const decoded = jwt.decode(token);
        const user = await usersModel.findByPk(decoded.user_id);
  
        if(user){

          let job_print_operators = (await operatorsModel.findAll({attributes : ['id','operator_name','operator_type']}));
          console.log("job_print_operators : ", job_print_operators);
  
          let data = job_print_operators.map((e) => {
            let operatorsDAta = {};
            operatorsDAta.id = e.id;
            operatorsDAta.operator_name = e.operator_name;
            operatorsDAta.operator_type = e.operator_type;
            return operatorsDAta;
          })

          resolve({"status" : 200, "data" : data, "message" : "Job print operators fetched successfully"});
        }else {
          reject({"status" : 400, "message" : "Requested user not found"});
        }
      } catch (error) {
  
        reject({
          status: 400,
          message: error
            ? error.message
              ? error.message
              : error
            : "Something went wrong",
        });
        
      }
    })
  }


  exports.fetchAllPrintPagesColors = async function (token) {
    return new Promise(async (resolve, reject) => {
      try {
        const decoded = jwt.decode(token);
        const user = await usersModel.findByPk(decoded.user_id);
  
        if(user){

          let job_print_colors = (await job_print_colors_model.findAll({attributes : ['id','job_print_color']}));
          console.log("job_print_colors : ", job_print_colors);
  
          let data = job_print_colors.map((e) => {
            let colors = {};
            colors.id = e.id;
            colors.value = e.job_print_color;
            return colors;
          })

          resolve({"status" : 200, "data" : data, "message" : "Job print colors fetched successfully"});
        }else {
          reject({"status" : 400, "message" : "Requested user not found"});
        }
      } catch (error) {
  
        reject({
          status: 400,
          message: error
            ? error.message
              ? error.message
              : error
            : "Something went wrong",
        });
        
      }
    })
  }


  exports.fetchAllPrintPagesPrinters = async function (token,color_id) {
    return new Promise(async (resolve, reject) => {
      try {
        const decoded = jwt.decode(token);
        const user = await usersModel.findByPk(decoded.user_id);
  
        if(user){

          let where = {};
          console.log("Color_id : ", color_id);
          if(color_id) {

            const color = (await print_pages_colors.findOne({where : {id : color_id}, attributes : ['job_print_color']})).getDataValue('job_print_color');

            where.color_type = color;
          }

          console.log("Where : ",where);
          let printers = (await printersModel.findAll({where,attributes : ['id','name','cost','status','color_type'],raw : true}));
          console.log("printers : ", printers);
          resolve({"status" : 200, "data" : printers, "message" : "Printers fetched successfully"});
  
          // let data = printers.map((e) => {
          //   let printersData = {};
          //   printersData.id = e.id;
          //   printersData.name = e.name;
          //   printersData.status = e.status;
          //   printersData.color_type = e.color_type;
          //   printersData.cost = e.cost;
          //   printersData.paper_support = e.paper_support;
          //   return printersData;
          // })

          // let printer_papers_data = await printer_papers.findAll({include : [{model : printersModel , as : "printer", attributes : ['name']}, {model : papersModel, as : 'paper', attributes : ['paper_name']}], attributes : {exclude :['createdAt','updatedAt']}})


          
          // const myValueQuery = 'SELECT DISTINCT printer_id FROM printer_papers';

          // sequelize.query(myValueQuery, {
          //   type: Sequelize.QueryTypes.SELECT
          // }).then(async (results) => {

          //   console.log("Results : ", results);

          //   let printer_paper_datas = await Promise.all(results.map(async(e)=> {
          //     console.log("Printer_id from map function : ", e.printer_id);

          //     //Fetching prnters data from printers model for corresponding printer_id
          //     let printers_data = await printersModel.findOne({where : {id : e.printer_id}, attributes : ['id','name'],raw : true});

          //     //Fetching papers details using relations from printer_papers table for corresponding printer_id
          //     let papers_data = await printer_papers.findAll({
          //       where: { printer_id: e.printer_id },
          //       include: [
          //         { model: papersModel, attributes: ['id',"paper_name"] },
          //       ],
          //       raw: true,
          //       attributes: { exclude: ["createdAt", "updatedAt",'id','paper_id','printer_id'] },
          //     });

          //     printers_data.paper_type = papers_data;
          //     // console.log("Data from map function : ", data);
          //     return printers_data;
          //   }));

          //   console.log("Printers data: ", printer_paper_datas);

          //   if(printer_paper_datas) {

          //     resolve({"status" : 200, "data" : printer_paper_datas, "message" : "Printers fetched successfully"});
          //   }else {
          //     reject({"status" : 400, "message" : "Cannot get printer paper datas"});

          //   }
          // });

        }else {
          reject({"status" : 400, "message" : "Requested user not found"});
        }
      } catch (error) {
  
        reject({
          status: 400,
          message: error
            ? error.message
              ? error.message
              : error
            : "Something went wrong",
        });
        
      }
    })
  }


  exports.fetchAllPrintPagesPaperTypes = async function (token,printer_id) {
    return new Promise(async (resolve, reject) => {
      try {
        const decoded = jwt.decode(token);
        const user = await usersModel.findByPk(decoded.user_id);
        console.log("Printer_id : ",printer_id);
  
        if(user){

          let where = {};
          if(printer_id) {
            let printerId = parseInt(printer_id);
            let paper_id_datas = await printer_papers.findAll({
              where: { printer_id: printerId },
              attributes: ["paper_id"],
              raw: true,
            });

            let paper_ids = paper_id_datas.map((e) => {
              return e.paper_id;
            });

            console.log("paper_id_datas : ", paper_id_datas);
            console.log("paper ids : ", paper_ids);
            where = {id: {[Op.in]: paper_ids}}
          }

          let paperTypes = (await papersModel.findAll({where,attributes : ['id','paper_name','paper_unitcost']}));
          // console.log("paperTypes : ", paperTypes);
  
          let data = paperTypes.map((e) => {
            let papersData = {};
            papersData.id = e.id;
            papersData.paper_name = e.paper_name;
            papersData.paper_size = e.paper_size;
            papersData.paper_weight = e.paper_weight;
            papersData.paper_unitcost = e.paper_unitcost;
            papersData.paper_type = e.paper_type;
            papersData.paper_dimension = e.paper_dimension;
            return papersData;
          })

          resolve({"status" : 200, "data" : data, "message" : "Paper types fetched successfully"});
        }else {
          reject({"status" : 400, "message" : "Requested user not found"});
        }
      } catch (error) {
  
        reject({
          status: 400,
          message: error
            ? error.message
              ? error.message
              : error
            : "Something went wrong",
        });
        
      }
    })
  }

  exports.fetchAllPrintPagesMachines = async function (token) {
    return new Promise(async (resolve, reject) => {
      try {
        const decoded = jwt.decode(token);
        const user = await usersModel.findByPk(decoded.user_id);
  
        if(user){

          let machines = (await print_pages_machines_model.findAll({attributes : ['machine']}));
          console.log("machines : ", machines);
  
          let data = machines.map((e) => {
            return e.machine;
          })

          resolve({"status" : 200, "data" : data, "message" : "Print pages machines fetched successfully"});
        }else {
          reject({"status" : 400, "message" : "Requested user not found"});
        }
      } catch (error) {
  
        reject({
          status: 400,
          message: error
            ? error.message
              ? error.message
              : error
            : "Something went wrong",
        });
        
      }
    })
  }
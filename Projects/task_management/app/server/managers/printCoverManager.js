const usersModel = require('../db/models/users');
const printCoversModel = require('../db/models/print_cover');
const operatorsModel = require('../db/models/operators');
const printCoverColorsModel = require('../db/models/print_cover_color');
const printCoverStatusModel = require('../db/models/print_cover_status');
const printersModel = require('../db/models/printers');
const printCoverPaperTypesModel = require('../db/models/print_cover_paper_type');
const printCoverSidesModel = require('../db/models/print_cover_sides');
const printCoverMachinesModel = require('../db/models/print_cover_machine');
const papersModel = require('../db/models/papers');
const materialsModel = require('../db/models/materials');
// const printCoverMaterialsModel = require('../db/models/print_cover_material');
const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');
const job_profile = require('../db/models/job_profile');
const printer_papers = require('../db/models/printer_papers');
const sequelize = require('../db/db-conn');
const Sequelize = require('sequelize');


exports.createNew = async function(token, job_id, print_cover_operator, print_cover_color, print_cover_status, print_cover_printer, print_cover_paper_type, print_cover_side, require_lamination, print_cover_quantity, print_cover_material) {

  return new Promise(async (resolve, reject) => {
      try {
          
          const decoded = jwt.decode(token);
          const user = await usersModel.findByPk(decoded.user_id);
          console.log("Token : ", token);

          if(user) {
            
              if(job_id && print_cover_operator && print_cover_color && print_cover_status && print_cover_printer && print_cover_paper_type && print_cover_side && require_lamination && print_cover_quantity && print_cover_material) {
                
                // let print_cover_operator_id = (await operatorsModel.findOne({where : {operator_name : print_cover_operator}, attributes : ['id'], raw : true})).id;
                // console.log("print_cover_operator_id : ", print_cover_operator_id);

                // let print_cover_color_id = (await printCoverColorsModel.findOne({where : {print_cover_color : print_cover_color}, attributes : ['id'], raw : true})).id;
                // console.log("print_cover_color_id : ", print_cover_color_id);

                // let print_cover_status_id = (await printCoverStatusModel.findOne({where : {status : print_cover_status}, attributes : ['id'], raw : true})).id;
                // console.log("print_cover_status_id : ", print_cover_status_id);

                // let print_cover_printer_id = (await printersModel.findOne({where : {name : print_cover_printer}, attributes : ['id'], raw : true})).id;
                // console.log("print_cover_printer_id : ", print_cover_printer_id);

                  // let print_cover_paper_type_id = (await papersModel.findOne({where : {paper_name : print_cover_paper_type}, attributes : ['id'], raw : true})).id;
                  // console.log("print_cover_paper_type_id : ", print_cover_paper_type_id);

                  // let print_cover_side_id = (await printCoverSidesModel.findOne({where : {print_cover_side : print_cover_side}, attributes : ['id'], raw : true})).id;
                  // console.log("print_cover_side_id : ", print_cover_side_id);

                  //Print cover machine details not found in database
                  // let print_cover_machine_id = (await printCoverMachinesModel.findOne({where : {print_cover_machine : print_cover_machine}, attributes : ['id'], raw : true})).id;
                  // console.log("print_cover_machine_id : ", print_cover_machine_id);

                  // let print_cover_material_id = (await materialsModel.findOne({where : {name : print_cover_material}, attributes : ['id'], raw : true})).id;
                  // console.log("print_cover_material_id : ", print_cover_material_id);


                  let new_instance = {
                      dev_flag : true,
                      job_id : job_id, // (id) sent from req body
                      print_cover_operator_id : print_cover_operator, // Dropdown (id)
                      print_cover_color_id : print_cover_color, // Dropdown (id)
                      print_cover_status_id : print_cover_status, // Dropdown (id)
                      // print_cover_printer_id : print_cover_printer_id, // Dropdown (id)
                      print_cover_paper_type_id : print_cover_paper_type, // Dropdown (id)
                      print_cover_sides : print_cover_side, // Dropdown (id) {updated {1,2}}
                      require_lamination : require_lamination, // Yes or No
                      print_cover_quantity : print_cover_quantity,
                      print_cover_machine_id : print_cover_printer, //Dropdown (id)
                      print_cover_material_id : print_cover_material,
                      request_date : dayjs().format()
                    }

                  console.log("New Instance : ", new_instance);

                  //Saving to database
                  let newInstance = await printCoversModel.create(new_instance);
                  let saved = newInstance.save();

                  if(saved) {

                    resolve({"status" : 200,data : newInstance, "message" : "New instance created for print covers section"});
                  }else {
                    reject({"status" : 400, "message" : "Cannot save to database"});
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



exports.printCoverEdit = async function(token, print_cover_id, job_id, print_cover_operator, print_cover_color, print_cover_status, print_cover_printer, print_cover_paper_type, print_cover_side, require_lamination, print_cover_quantity, print_cover_material) {

  return new Promise(async (resolve, reject) => {
      try {
          
          const decoded = jwt.decode(token);
          const user = await usersModel.findByPk(decoded.user_id);
          console.log("Token : ", token);

          if(user) {
            
              if(print_cover_id && job_id && print_cover_operator && print_cover_color && print_cover_status && print_cover_printer && print_cover_paper_type && print_cover_side && require_lamination && print_cover_quantity && print_cover_material) {
                
                // let print_cover_operator_id = (await operatorsModel.findOne({where : {operator_name : print_cover_operator}, attributes : ['id'], raw : true})).id;
                // console.log("print_cover_operator_id : ", print_cover_operator_id);

                // let print_cover_color_id = (await printCoverColorsModel.findOne({where : {print_cover_color : print_cover_color}, attributes : ['id'], raw : true})).id;
                // console.log("print_cover_color_id : ", print_cover_color_id);

                // let print_cover_status_id = (await printCoverStatusModel.findOne({where : {status : print_cover_status}, attributes : ['id'], raw : true})).id;
                // console.log("print_cover_status_id : ", print_cover_status_id);

                // let print_cover_printer_id = (await printersModel.findOne({where : {name : print_cover_printer}, attributes : ['id'], raw : true})).id;
                // console.log("print_cover_printer_id : ", print_cover_printer_id);

                  // let print_cover_paper_type_id = (await papersModel.findOne({where : {paper_name : print_cover_paper_type}, attributes : ['id'], raw : true})).id;
                  // console.log("print_cover_paper_type_id : ", print_cover_paper_type_id);

                  // let print_cover_side_id = (await printCoverSidesModel.findOne({where : {print_cover_side : print_cover_side}, attributes : ['id'], raw : true})).id;
                  // console.log("print_cover_side_id : ", print_cover_side_id);

                  //Print cover machine details not found in database
                  // let print_cover_machine_id = (await printCoverMachinesModel.findOne({where : {print_cover_machine : print_cover_machine}, attributes : ['id'], raw : true})).id;
                  // console.log("print_cover_machine_id : ", print_cover_machine_id);

                  // let print_cover_material_id = (await materialsModel.findOne({where : {name : print_cover_material}, attributes : ['id'], raw : true})).id;
                  // console.log("print_cover_material_id : ", print_cover_material_id);


                  let updated_instance = {
                      dev_flag : true,
                      job_id : job_id, // (id) sent from req body
                      print_cover_operator_id : print_cover_operator, // Dropdown (id)
                      print_cover_color_id : print_cover_color, // Dropdown (id)
                      print_cover_status_id : print_cover_status, // Dropdown (id)
                      // print_cover_printer_id : print_cover_printer_id, // Dropdown (id)
                      print_cover_paper_type_id : print_cover_paper_type, // Dropdown (id)
                      print_cover_sides : print_cover_side, // Dropdown (id)
                      require_lamination : require_lamination, // Yes or No
                      print_cover_quantity : print_cover_quantity,
                      print_cover_machine_id : print_cover_printer, //Dropdown (id)
                      print_cover_material_id : print_cover_material,
                      request_date : dayjs().format()
                    }

                  console.log("Updated Instance : ", updated_instance);

                  //Saving to database
                  let print_cover_instance = await printCoversModel.findOne({where : {id : print_cover_id}});

                  if(print_cover_instance) {
                    
                    
                    if (print_cover_instance.dev_flag == true) {
                      let jobId = print_cover_instance.job_id;
                      console.log("jobId : ", jobId);
                      console.log("job_id : ", job_id);

                      if (jobId == job_id) {
                        let update = await print_cover_instance.update(
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

                    reject({"status" : 400, "message" : "Cannot find print cover details from database"});


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



exports.fetchAllPrintCoverOperators = async function (token) {
    return new Promise(async (resolve, reject) => {
      try {
        const decoded = jwt.decode(token);
        const user = await usersModel.findByPk(decoded.user_id);
  
        if(user){

          let print_cover_operators = (await operatorsModel.findAll({attributes : ['id','operator_name','operator_type']}));
          console.log("print_cover_operators : ", print_cover_operators);
  
          let data = print_cover_operators.map((e) => {
            operatorsData = {};
            operatorsData.id = e.id;
            operatorsData.operator_name = e.operator_name;
            operatorsData.operator_type = e.operator_type;
            return operatorsData;
          })

          resolve({"status" : 200, "data" : data, "message" : "Print cover operators fetched successfully"});
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


  exports.fetchAllPrintCoverColors = async function (token) {
    return new Promise(async (resolve, reject) => {
      try {
        const decoded = jwt.decode(token);
        const user = await usersModel.findByPk(decoded.user_id);
  
        if(user){

          let print_cover_colors = (await printCoverColorsModel.findAll({attributes : ['id','print_cover_color']}));
          console.log("print_cover_colors : ", print_cover_colors);
  
          let data = print_cover_colors.map((e) => {
            let colors = {};
            colors.id = e.id;
            colors.value = e.print_cover_color
            return colors;
          })

          resolve({"status" : 200, "data" : data, "message" : "Print cover colors fetched successfully"});
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


  exports.fetchAllPrintCoverStatus = async function (token) {
    return new Promise(async (resolve, reject) => {
      try {
        const decoded = jwt.decode(token);
        const user = await usersModel.findByPk(decoded.user_id);
  
        if(user){

          let print_cover_status = (await printCoverStatusModel.findAll({attributes : ['id','status']}));
          console.log("print_cover_status : ", print_cover_status);
  
          let data = print_cover_status.map((e) => {
            let status = {};
            status.id = e.id;
            status.value = e.status;
            return status;
          })

          resolve({"status" : 200, "data" : data, "message" : "Print statuses fetched successfully"});
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


  exports.fetchAllPrintCoverPrinters = async function (token) {
    return new Promise(async (resolve, reject) => {
      try {
        const decoded = jwt.decode(token);
        const user = await usersModel.findByPk(decoded.user_id);
  
        if(user){

          // let print_cover_printer = (await printersModel.findAll({attributes : ['id','name','status','color_type','cost','paper_support']}));
          // console.log("print_cover_printer : ", print_cover_printer);
  
          // let data = print_cover_printer.map((e) => {
          //   let printerData = {};
          //   printerData.id = e.id;
          //   printerData.name = e.name;
          //   printerData.status = e.status;
          //   printerData.color_type = e.color_type;
          //   printerData.cost = e.cost;
          //   printerData.paper_support = e.paper_support;
          //   return printerData;
          // })

          //Fetching from printer_papars model
          // let data = await printer_papers.findAll({
          //   include: [
          //     {
          //       model: printersModel,
          //       where: { status: "active" },
          //       attributes: ["name"],
          //     },
          //     { model: papersModel, attributes: ["paper_name"] },
          //   ],
          //   attributes: { exclude: ["createdAt", "updatedAt"] },
          // });

          const myValueQuery = 'SELECT DISTINCT printer_id FROM printer_papers';

          sequelize.query(myValueQuery, {
            type: Sequelize.QueryTypes.SELECT
          }).then(async (results) => {

            console.log("Results : ", results);

            let printer_paper_datas = await Promise.all(results.map(async(e)=> {
              console.log("Printer_id from map function : ", e.printer_id);

              //Fetching prnters data from printers model for corresponding printer_id
              let printers_data = await printersModel.findOne({where : {id : e.printer_id}, attributes : ['id','name'],raw : true});

              //Fetching papers details using relations from printer_papers table for corresponding printer_id
              let papers_data = await printer_papers.findAll({
                where: { printer_id: e.printer_id },
                include: [
                  { model: papersModel, attributes: ['id',"paper_name"] },
                ],
                raw: true,
                attributes: { exclude: ["createdAt", "updatedAt",'id','paper_id','printer_id'] },
              });

              printers_data.paper_type = papers_data;
              // console.log("Data from map function : ", data);
              return printers_data;
            }));

            console.log("Printers data: ", printer_paper_datas);

            if(printer_paper_datas) {

              resolve({"status" : 200, "data" : printer_paper_datas, "message" : "Printers fetched successfully"});
            }else {
              reject({"status" : 400, "message" : "Cannot get printer paper datas"});

            }
          });


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


  exports.fetchAllPrintCoverPaperTypes = async function (token) {
    return new Promise(async (resolve, reject) => {
      try {
        const decoded = jwt.decode(token);
        const user = await usersModel.findByPk(decoded.user_id);
  
        if(user){

          let print_cover_paper_type = (await papersModel.findAll({attributes : ['id','paper_name','paper_size','paper_weight','paper_unitcost','paper_type','paper_dimension',]}));
          console.log("print_cover_paper_type : ", print_cover_paper_type);
  
          let data = print_cover_paper_type.map((e) => {
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

  exports.fetchAllPrintCoverSides = async function (token) {
    return new Promise(async (resolve, reject) => {
      try {
        const decoded = jwt.decode(token);
        const user = await usersModel.findByPk(decoded.user_id);
  
        if(user){

          let print_cover_sides = (await printCoverSidesModel.findAll({attributes : ['print_cover_side']}));
          console.log("print_cover_sides : ", print_cover_sides);
  
          let data = print_cover_sides.map((e) => {
            return e.print_cover_side;
          })

          resolve({"status" : 200, "data" : data, "message" : "Print cover sides fetched successfully"});
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


  exports.fetchAllPrintCoverMachines = async function (token) {
    return new Promise(async (resolve, reject) => {
      try {
        const decoded = jwt.decode(token);
        const user = await usersModel.findByPk(decoded.user_id);
  
        if(user){

          let print_cover_machines = (await printCoverMachinesModel.findAll({attributes : ['print_cover_machine']}));
          console.log("print_cover_machines : ", print_cover_machines);
  
          let data = print_cover_machines.map((e) => {
            // let printersData = {};
            // printersData.id = e.id;
            // printersData.name = e.name;
            // printersData.status = e.status;
            // printersData.color_type = e.color_type;
            // printersData.cost = e.cost;
            // printersData.paper_support = e.paper_support;
            return e.print_cover_machine;
          })

          resolve({"status" : 200, "data" : data, "message" : "Print cover machines fetched successfully"});
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


  exports.fetchAllPrintCoverMaterials = async function (token) {
    return new Promise(async (resolve, reject) => {
      try {
        const decoded = jwt.decode(token);
        const user = await usersModel.findByPk(decoded.user_id);
  
        if(user){

          let print_cover_materials = (await materialsModel.findAll({attributes : ['id','name','type','cost']}));
          console.log("print_cover_materials : ", print_cover_materials);
  
          let data = print_cover_materials.map((e) => {
            let materialsData = {};
            materialsData.id = e.id;
            materialsData.name = e.name;
            materialsData.type = e.type;
            materialsData.cost = e.cost;
            return materialsData;
          })

          resolve({"status" : 200, "data" : data, "message" : "Print cover materials fetched successfully"});
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



  exports.fetchSinglePrintCoverDetails = async function (token, print_cover_id) {
    return new Promise(async (resolve, reject) => {
      try {
        const decoded = jwt.decode(token);
        const user = await usersModel.findByPk(decoded.user_id);
  
        if(user){

          let print_cover_details = await printCoversModel.findOne({where : {id : print_cover_id},include : [{model : printCoverStatusModel , as : "print_cover_status", attributes : ['status']},{model : printCoverColorsModel, as : "print_cover_color", attributes : ['print_cover_color']}],raw : true, attributes : {exclude : ['createdAt','updatedAt']}});
          console.log("print_cover_detail : ", print_cover_details);

          if(print_cover_details) {

            //Fetching print_cover operator details
            if(print_cover_details.print_cover_operator_id !== '' && print_cover_details.print_cover_operator_id !== 0) {

              let print_cover_operator_id = Number(print_cover_details.print_cover_operator_id);
              console.log("print_cover_operator_id : ", print_cover_operator_id);
              console.log("Typeof(print_cover_operator_id) : ", typeof(print_cover_operator_id));

              let print_cover_operator = await operatorsModel.findOne({where : {id : print_cover_operator_id}});

              if(print_cover_operator !== null) {
                let operator = print_cover_operator.getDataValue('operator_name');
                console.log("Print Cover Operator : ", operator);
                print_cover_details.print_cover_operator = operator;
              }else {
                print_cover_details.print_cover_operator = null;
              }
            }else {

              print_cover_details.print_cover_operator = "Invalid id";


            }

            //Fetching print_cover material details
            if(print_cover_details.print_cover_material_id !== '' && print_cover_details.print_cover_material_id !== 0) {

              let print_cover_material_id = Number(print_cover_details.print_cover_material_id);
              console.log("print_cover_material_id : ", print_cover_material_id);
              console.log("Typeof(print_cover_material_id) : ", typeof(print_cover_material_id));

              let print_cover_material = await materialsModel.findOne({where : {id : print_cover_material_id}});

              if(print_cover_material !== null) {
                let material = print_cover_material.getDataValue('name');
                console.log("Print Cover material : ", material);
                print_cover_details.print_cover_material = material;
              }else {
                print_cover_details.print_cover_material = null;
              }
            }else {

              print_cover_details.print_cover_material = "Invalid id";


            }


            //Fetching print_cover_machine(printer) details
            if(print_cover_details.print_cover_machine_id !== '' && print_cover_details.print_cover_machine_id !== 0) {

              let print_cover_machine_id = Number(print_cover_details.print_cover_machine_id);
              console.log("print_cover_machine_id : ", print_cover_machine_id);
              console.log("Typeof(print_cover_machine_id) : ", typeof(print_cover_machine_id));

              let print_cover_machine = await printersModel.findOne({where : {id : print_cover_machine_id}});

              if(print_cover_machine !== null) {
                let machine = print_cover_machine.getDataValue('name');
                console.log("Print Cover machine : ", machine);
                print_cover_details.print_cover_printer_machine = machine;
              }else {
                print_cover_details.print_cover_printer_machine = null;
              }
            }else {

              print_cover_details.print_cover_printer_machine = "Invalid id";


            }

            //Fetching print_cover_paper_type details
            if(print_cover_details.print_cover_paper_type_id !== '' && print_cover_details.print_cover_paper_type_id !== 0) {

              let print_cover_paper_type_id = Number(print_cover_details.print_cover_paper_type_id);
              console.log("print_cover_paper_type_id : ", print_cover_paper_type_id);
              console.log("Typeof(print_cover_paper_type_id) : ", typeof(print_cover_paper_type_id));

              let print_cover_paper_type = await papersModel.findOne({where : {id : print_cover_paper_type_id}});

              if(print_cover_paper_type !== null) {
                let paper = print_cover_paper_type.getDataValue('paper_name');
                console.log("Print Cover print_cover_paper_type : ", paper);
                print_cover_details.print_cover_paper_type = paper;
              }else {
                print_cover_details.print_cover_paper_type = null;
              }
            }else {

              print_cover_details.print_cover_paper_type = "Invalid id";


            }

            //Fetching print_cover_sides details
            // if(print_cover_details.print_cover_sides !== '' && print_cover_details.print_cover_sides !== 0) {

            //   let print_cover_sides_id = Number(print_cover_details.print_cover_sides);
            //   console.log("print_cover_sides_id : ", print_cover_sides_id);
            //   console.log("Typeof(print_cover_sides_id) : ", typeof(print_cover_sides_id));

            //   let print_cover_sides = await printCoverSidesModel.findOne({where : {id : print_cover_sides_id}});

            //   if(print_cover_sides !== null) {
            //     let sides = print_cover_sides.getDataValue('print_cover_side');
            //     console.log("print_cover_side : ", sides);
            //     print_cover_details.print_cover_sides = sides;
            //   }else {
            //     print_cover_details.print_cover_sides = null;
            //   }
            // }else {

            //   print_cover_details.print_cover_sides = "Invalid id";


            // }



            console.log("print_cover_details : ", print_cover_details);



            resolve({"status" : 200, "data" : print_cover_details, "message" : "Print cover fetched successfully"});
            
          }else {

            reject({"status" : 400, "message" : "Print cover details not found"});

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
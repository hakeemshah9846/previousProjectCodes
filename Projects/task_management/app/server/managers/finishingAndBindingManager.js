const usersModel = require('../db/models/users');
const operatorsModel = require('../db/models/operators');
const bindingTypesModel = require('../db/models/binding_types');
const bindingStatusModel = require('../db/models/binding_status');
// const bindingMaterialsModel = require('../db/models/binding_materials');
const materialsModel = require('../db/models/materials');
const bindingUnitCostsModel = require('../db/models/binding_unit_costs');
const finishingAndBindingModel = require('../db/models/finishing_and_bindings');
const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');



exports.createNew = async function(token, job_id, binding_operator, binding_type, binding_status, binding_page_count, binding_quantity, require_perforation, binding_material, unit_cost) {

  return new Promise(async (resolve, reject) => {
      try {
          
          const decoded = jwt.decode(token);
          const user = await usersModel.findByPk(decoded.user_id);
          console.log("Token : ", token);

          if(user) {
            
              if(job_id && binding_operator && binding_type && binding_status && binding_page_count && binding_quantity && require_perforation && binding_material && unit_cost) {
                
                // let binding_operator_id = (await operatorsModel.findOne({where : {operator_name : binding_operator}, attributes : ['id'], raw : true})).id;
                // console.log("binding_operator_id : ", binding_operator_id);

                // let binding_type_id = (await bindingTypesModel.findOne({where : {binding_type : binding_type}, attributes : ['id'], raw : true})).id;
                // console.log("binding_type_id : ", binding_type_id);

                // let binding_status_id = (await bindingStatusModel.findOne({where : {status : binding_status}, attributes : ['id'], raw : true})).id;
                // console.log("binding_status_id : ", binding_status_id);

                // let material_id = (await MaterialsModel.findOne({where : {material : material}, attributes : ['id'], raw : true})).id;
                // console.log("material_id : ", material_id);

                  // let binding_material_id = (await materialsModel.findOne({where : {name : binding_material}, attributes : ['id'], raw : true})).id;
                  // console.log("binding_material_id : ", binding_material_id);

                  // let unit_cost_id = (await bindingUnitCostsModel.findOne({where : {unit_cost : unit_cost}, attributes : ['id'], raw : true})).id;
                  // console.log("unit_cost_id : ", unit_cost_id);



                  let new_instance = {
                      dev_flag : true,
                      job_id : job_id, // (id) sent from req body
                      binding_operator_id : binding_operator, // Dropdown (id)
                      binding_type_id : binding_type, // Dropdown (id)
                      binding_status_id : binding_status, // Dropdown (id)
                      // material_id : material_id, // Dropdown (id)
                      binding_page_count : binding_page_count,
                      binding_quantity : binding_quantity,
                      require_perforation : require_perforation, // Yes or No
                      material_id : binding_material, // Dropdown (id)
                      unit_cost : unit_cost, // Dropdown (id)
                      request_date : dayjs().format()
                  }

                  console.log("New Instance : ", new_instance);

                  //Saving to database
                  let newInstance = await finishingAndBindingModel.create(new_instance);
                 let newInstanceSaved = newInstance.save();

                 if(newInstanceSaved) {

                   resolve({"status" : 200, data : newInstance, "message" : "New instance created for finishing and binding section"});

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


exports.bindingEdit = async function(token,binding_id, job_id, binding_operator, binding_type, binding_status, binding_page_count, binding_quantity, require_perforation, binding_material, unit_cost) {

  return new Promise(async (resolve, reject) => {
      try {
          
          const decoded = jwt.decode(token);
          const user = await usersModel.findByPk(decoded.user_id);
          console.log("Token : ", token);

          if(user) {
            
              if(binding_id && job_id && binding_operator && binding_type && binding_status && binding_page_count && binding_quantity && require_perforation && binding_material && unit_cost) {
                
                // let binding_operator_id = (await operatorsModel.findOne({where : {operator_name : binding_operator}, attributes : ['id'], raw : true})).id;
                // console.log("binding_operator_id : ", binding_operator_id);

                // let binding_type_id = (await bindingTypesModel.findOne({where : {binding_type : binding_type}, attributes : ['id'], raw : true})).id;
                // console.log("binding_type_id : ", binding_type_id);

                // let binding_status_id = (await bindingStatusModel.findOne({where : {status : binding_status}, attributes : ['id'], raw : true})).id;
                // console.log("binding_status_id : ", binding_status_id);

                // let material_id = (await MaterialsModel.findOne({where : {material : material}, attributes : ['id'], raw : true})).id;
                // console.log("material_id : ", material_id);

                  // let binding_material_id = (await materialsModel.findOne({where : {name : binding_material}, attributes : ['id'], raw : true})).id;
                  // console.log("binding_material_id : ", binding_material_id);

                  // let unit_cost_id = (await bindingUnitCostsModel.findOne({where : {unit_cost : unit_cost}, attributes : ['id'], raw : true})).id;
                  // console.log("unit_cost_id : ", unit_cost_id);



                  let updated_instance = {
                      dev_flag : true,
                      job_id : job_id, // (id) sent from req body
                      binding_operator_id : binding_operator, // Dropdown (id)
                      binding_type_id : binding_type, // Dropdown (id)
                      binding_status_id : binding_status, // Dropdown (id)
                      // material_id : material_id, // Dropdown (id)
                      binding_page_count : binding_page_count,
                      binding_quantity : binding_quantity,
                      require_perforation : require_perforation, // Yes or No
                      material_id : binding_material, // Dropdown (id)
                      unit_cost : unit_cost, // Dropdown (id)
                      request_date : dayjs().format()
                  }

                  console.log("Updated Instance : ", updated_instance);

                  //Saving to database
                  let binding_update_instance = await finishingAndBindingModel.findOne({where : {id : binding_id}});
                  if(binding_update_instance) {

                    if (binding_update_instance.dev_flag == true) {

                      let jobId = binding_update_instance.job_id;
                      console.log("jobId : ", jobId);
                      console.log("job_id : ", job_id);
                      if(jobId == job_id) {

                        let update = await binding_update_instance.update(
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
                          reject({ status: 400, message: "Cannot update" });
                        }

                      }else {
                        reject({"status" : 400, "message" : "Wrong job_id"});

                      }
                      
                    }else {
                      reject({"status" : 400, "message" : "Cannot update production datas during development and testing"});

                    }
                  }else {

                    reject({"status" : 400, "message" : "Cannot find binding details from database"});


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

exports.fetchAllBindingOperators = async function (token) {
    return new Promise(async (resolve, reject) => {
      try {
        const decoded = jwt.decode(token);
        const user = await usersModel.findByPk(decoded.user_id);
  
        if(user){

          let bindingOperators = (await operatorsModel.findAll({attributes : ['id','operator_name','operator_type']}));
          console.log("Binding_operators : ", bindingOperators);
  
          let data = bindingOperators.map((e) => {

            let operatorsData = {};
            operatorsData.id = e.id;
            operatorsData.operator_name = e.operator_name;
            operatorsData.operator_type = e.operator_type;
            return operatorsData;
          })
          resolve({"status" : 200, "data" : data, "message" : "Binding operators fetched successfully"});
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
  

  exports.fetchAllBindingTypes = async function (token) {
    return new Promise(async (resolve, reject) => {
      try {
        const decoded = jwt.decode(token);
        const user = await usersModel.findByPk(decoded.user_id);
  
        if(user){

          let bindingTypes = (await bindingTypesModel.findAll({attributes : ['id','binding_type']}));
          console.log("Binding_types : ", bindingTypes);
  
          let data = bindingTypes.map((e) => {
            let binding_types = {};
            binding_types.id = e.id;
            binding_types.value = e.binding_type;
            return binding_types;
          })

          resolve({"status" : 200, "data" : data, "message" : "Binding types fetched successfully"});
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
  

  exports.fetchAllBindingStatus = async function (token) {
    return new Promise(async (resolve, reject) => {
      try {
        const decoded = jwt.decode(token);
        const user = await usersModel.findByPk(decoded.user_id);
  
        if(user){

          let bindingStatus = (await bindingStatusModel.findAll({attributes : ['id','status']}));
          console.log("Binding_status : ", bindingStatus);
  
          let data = bindingStatus.map((e) => {
            let binding_status = {};
            binding_status.id = e.id;
            binding_status.value = e.status
            return binding_status;
          })

          resolve({"status" : 200, "data" : data, "message" : "Binding status fetched successfully"});
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

  exports.fetchAllBindingMaterials = async function (token) {
    return new Promise(async (resolve, reject) => {
      try {
        const decoded = jwt.decode(token);
        const user = await usersModel.findByPk(decoded.user_id);
  
        if(user){

          let bindingMaterials = (await materialsModel.findAll({attributes : ['id','name','type']}));
          console.log("Binding_material : ", bindingMaterials);
  
          let data = bindingMaterials.map((e) => {
            materialsData = {};
            materialsData.id = e.id;
            materialsData.name = e.name;
            materialsData.type = e.type;
            return materialsData;
          })

          resolve({"status" : 200, "data" : data, "message" : "Binding materials fetched successfully"});
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


  exports.fetchAllMaterials = async function (token) {
    return new Promise(async (resolve, reject) => {
      try {
        const decoded = jwt.decode(token);
        const user = await usersModel.findByPk(decoded.user_id);
  
        if(user){

          let materials = (await materialsModel.findAll({attributes : ['id','name','type']}));
          console.log("material : ", materials);
  
          let data = materials.map((e) => {

            let materialsData = {};
            materialsData.id = e.id;
            materialsData.name = e.name;
            materialsData.type = e.type;
            return materialsData;
          })

          resolve({"status" : 200, "data" : data, "message" : "Materials fetched successfully"});
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


  exports.fetchAllBindingUnitCosts = async function (token) {
    return new Promise(async (resolve, reject) => {
      try {
        const decoded = jwt.decode(token);
        const user = await usersModel.findByPk(decoded.user_id);
  
        if(user){

          let costs = (await bindingUnitCostsModel.findAll({attributes : ['unit_cost']}));
          console.log("Costs : ", costs);
  
          let data = costs.map((e) => {
            return e.unit_cost;
          })

          resolve({"status" : 200, "data" : data, "message" : "Unit costs fetched successfully"});
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



  exports.fetchSingleBindingDetails = async function (token, binding_id) {
    return new Promise(async (resolve, reject) => {
      try {
        const decoded = jwt.decode(token);
        const user = await usersModel.findByPk(decoded.user_id);
  
        if(user){

          let binding_details = (await finishingAndBindingModel.findOne({where : {id : binding_id},include : [{model : bindingTypesModel, as : "binding_type", attributes:['binding_type']},{model : bindingStatusModel, as : "binding_status", attributes:['status']},],attributes: { exclude: ["createdAt", "updatedAt"] },raw : true}));
          console.log("binding_details : ", binding_details);
  
          if(binding_details) {

          
          //Fetching operator details  
          if(binding_details.binding_operator_id !== '' && binding_details.binding_operator_id !== 0)     {


            let operator_id = Number(binding_details.binding_operator_id);
            console.log("Typeof(operator_id) : ", typeof(operator_id));
            let binding_operator = (await operatorsModel.findOne({where : {id : operator_id}}));
            if(binding_operator !== null) {
              let operator = binding_operator.getDataValue('operator_name');
              console.log("Binding_operator : ",operator);
               binding_details.binding_operator = operator;
            }else {
              binding_details.binding_operator = null;
            }
          }   else {
            binding_details.binding_operator = "Invalid id";
          }  
            // binding_details.setDataValue({'binding_operator': binding_operator});
            console.log("Binding Details : ", binding_details);
          

          //Fetching matarial details
          // if(binding_details.material_id == '' || binding_details.material_id == 0) {
          //   reject({"status" : 400, "message" : "Invalid material id"});

          // }else {
            
          // }
          if(binding_details.material_id !== '' && binding_details.material_id !== 0)     {

          let material_id = Number(binding_details.material_id);
          console.log("Typeof(material_id) : ", typeof(material_id));
          let material = (await materialsModel.findOne({where : {id : material_id}}));
          if(material !== null) {

            let binding_material = material.getDataValue('name');
            console.log("binding_material : ",binding_material);
            binding_details.binding_material = binding_material;
          }else {
            binding_details.binding_material = null;
          }
          
        }else {
          binding_details.binding_material = "Invalid id";
        }
        
        resolve({"status" : 200, "data" : binding_details, "message" : " Binding details fetched successfully"});
      }else {

        reject({"status" : 400, "message" : "Binding details not found"});

      }
          console.log("Binding Details : ", binding_details);


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
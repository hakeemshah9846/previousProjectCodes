const usersModel = require('../db/models/users');
const userRoleConnector = require('../db/models/user_roles_connection');
const userRoles = require('../db/models/user_roles');
const operatorsModel = require('../db/models/operators');
const jobsModel = require('../db/models/job_profile');
const entitiesModel = require('../db/models/entities');
const departmentsModel = require('../db/models/departments');
const sectionsModel = require('../db/models/sections');
const deliveryModesModel = require('../db/models/delivery_modes');
const documentModesModel = require('../db/models/document_modes'); 
const documentTypesModel = require('../db/models/document_types');
const clientsModel = require('../db/models/request_profile');
const jobTypesModel = require('../db/models/job_types');
const jobStatusModel = require('../db/models/job_status');
const requestProfileModel = require('../db/models/request_profile');
const campusModel = require('../db/models/campus');
const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');
const job_status = require('../db/models/job_status');
const { where, Op } = require('sequelize');
const finishing_and_bindings = require('../db/models/finishing_and_bindings');
const binding_types = require('../db/models/binding_types');
const binding_status = require('../db/models/binding_status');
const opetatorsModel = require('../db/models/operators');
const materialsModel = require('../db/models/materials');
const printCoverModel = require('../db/models/print_cover');
const print_cover_status = require('../db/models/print_cover_status');
const print_cover_colors = require('../db/models/print_cover_color');
const printers = require('../db/models/printers');
const print_pages = require('../db/models/print_pages');
const print_pages_colors = require('../db/models/print_pages_colors');
const papers = require('../db/models/papers');
const {Sequelize} = require('sequelize');
const sequelize = require('../db/db-conn');
const e = require('express');

exports.createJob = async function(token, job_type, job_status,  job_title,requested_by, requested_by_entity, requested_by_department, requested_by_section, job_req_comment, confidentiality, require_sample, require_edits, document_type, document_name, document_mode, req_delivery_date, delivery_mode, deliver_to, deliver_to_entity, deliver_to_department, deliver_to_section, require_cover, require_finishing) {

    return new Promise(async (resolve, reject) => {
        try {
            
            const decoded = jwt.decode(token);
            const user = await usersModel.findByPk(decoded.user_id);
            console.log("Token : ", token);

            //document_modes is always empty

            if(user) {
                if(job_type && job_status && job_title && requested_by && requested_by_entity && requested_by_department && requested_by_section && job_req_comment && confidentiality && require_sample && require_edits && document_name && req_delivery_date && delivery_mode && deliver_to && deliver_to_entity && deliver_to_department && deliver_to_section && require_cover && require_finishing || document_mode || document_type) {
                  
                  // let job_status_id = (await jobStatusModel.findOne({where : {status : job_status}, attributes : ['id'], raw : true})).id;
                  // console.log("job_status_id : ", job_status_id);

                  //Entity/School is from campuses tabe
                  // let requested_by_entity_id = (await campusModel.findOne({where : {campus : requested_by_entity}, attributes : ['id'], raw : true})).id;
                  // console.log("requested_by_entity_id : ", requested_by_entity_id);

                  // let requested_by_department_id = (await departmentsModel.findOne({where : {department : requested_by_department}, attributes : ['id'], raw : true})).id;
                  // console.log("requested_by_department_id : ", requested_by_department_id);

                  // let requested_by_section_id = (await sectionsModel.findOne({where : {section : requested_by_section}, attributes : ['id'], raw : true})).id;
                  // console.log("requested_by_section_id : ", requested_by_section_id);

                    //Entity/School is from campuses tabe
                    // let deliver_to_entity_id = (await campusModel.findOne({where : {campus : deliver_to_entity}, attributes : ['id'], raw : true})).id;
                    // console.log("deliver_to_entity_id : ", deliver_to_entity_id);

                    // let deliver_to_department_id = (await departmentsModel.findOne({where : {department : deliver_to_department}, attributes : ['id'], raw : true})).id;
                    // console.log("deliver_to_department_id : ", deliver_to_department_id);

                    // let deliver_to_section_id = (await sectionsModel.findOne({where : { section : deliver_to_section}, attributes : ['id'], raw : true})).id;
                    // console.log("deliver_to_section_id : ", deliver_to_section_id);

                    // let delivery_modes_id = (await deliveryModesModel.findOne({where : { delivery_mode : delivery_mode}, attributes : ['id'], raw : true})).id;
                    // console.log("delivery_modes_id : ", delivery_modes_id);

                    // let document_modes_id = (await documentModesModel.findOne({where : { document_mode : document_mode}, attributes : ['id'], raw : true})).id;
                    // console.log("document_modes_id : ", document_modes_id);

                    // let document_types_id = (await documentTypesModel.findOne({where : { document_type : document_type}, attributes : ['id'], raw : true})).id;
                    // console.log("document_types_id : ", document_types_id);

                    // requested_by in UI image
                    // let requested_by_client_id = (await requestProfileModel.findOne({where : { name : requested_by}, attributes : ['id'], raw : true})).id;
                    // console.log("requested_by_client_id : ", requested_by_client_id);

                    // let job_type_id = (await jobTypesModel.findOne({where : { job_type : job_type}, attributes : ['id'], raw : true})).id;
                    // console.log("job_type_id : ", job_type_id);

                    // deliver_to in UI image
                    // let deliver_to_client_id = (await requestProfileModel.findOne({where : { name : deliver_to}, attributes : ['id'], raw : true})).id;
                    // console.log("deliver_to_client_id : ", deliver_to_client_id);

  


                    let new_job = {
                        dev_flag :true,
                        job_title : job_title,
                        requested_by_id : requested_by, // Dropdown (id)
                        requested_by_entity_id : requested_by_entity, // Dropdown (id)
                        requested_by_department_id : requested_by_department, // Dropdown (id)
                        requested_by_section_id : requested_by_section, // Dropdown (id)
                        job_type_id : job_type, // Dropdown (id)
                        job_req_comment : job_req_comment,
                        document_type_id : document_type, // Dropdown (id)
                        document_name : document_name,
                        document_mode_id : document_mode, // Dropdown (id)
                        requested_delivery_date : req_delivery_date,
                        job_requested_on : dayjs().format(),
                        job_status_id : job_status, // Dropdown (id)
                        confidentiality : confidentiality, // Yes or No
                        require_sample : require_sample, // Yes or No
                        require_edits : require_edits, // Yes or No
                        delivery_mode_id : delivery_mode, // Dropdown (id)
                        deliver_to_id : deliver_to, // Dropdown (id)
                        deliver_to_entity_id : deliver_to_entity, // Dropdown (id)
                        deliver_to_department_id : deliver_to_department, // Dropdown (id)
                        deliver_to_section_id : deliver_to_section , // Dropdown (id)
                        require_cover : require_cover, // Yes or No and redirects to print_cover page
                        require_finishing_and_binding : require_finishing //Yes or No and redirects to finishing and binding page
                    }

                    console.log("New Job : ", new_job);

                    //Saving to database
                    let newJob = await jobsModel.create(new_job);
                    let newJobSaved = newJob.save();

                    if(newJobSaved){

                      resolve({"status" : 200, "data" : newJob, "message" : "New job created successfully"});
                    }else {

                      reject({"status" : 400, "message" : "Job not saved"});


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


exports.fetchAllEntities = async function (token) {
    return new Promise(async (resolve, reject) => {
      try {
        const decoded = jwt.decode(token);
        const user = await usersModel.findByPk(decoded.user_id);
  
        if(user){
          let entities = (await campusModel.findAll({attributes : ['campus','id']}));
          console.log("Entities : ", entities);
  
          let data = entities.map((e) => {
            let campus = {};
            campus.id = e.id;
            campus.value = e.campus
            return campus;
          })
          resolve({"status" : 200, "data" : data, "message" : "Entities fetched successfully"});
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
  

  exports.fetchAllDeliveryModes = async function (token) {
    return new Promise(async (resolve, reject) => {
        try {
            const decoded = jwt.decode(token);
            const user = usersModel.findByPk(decoded.user_id);

            if(user) {
                let deliveryModes = await deliveryModesModel.findAll({attributes : ['id','delivery_mode']});
                console.log("Delivery Modes : ", deliveryModes);

                let data = deliveryModes.map((e) => {
                  let delivery_modes = {};
                  delivery_modes.id = e.id;
                  delivery_modes.value = e.delivery_mode;
                  return delivery_modes;
                });

                resolve({"status" : 200, "data" : data, "message" : "Delivery modes fetched successfully"});
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


  exports.fetchAllDocumentModes = async function(token) {

    return new Promise(async (resolve, reject) =>{

      try {
        
        const decoded = jwt.decode(token);
  
        const user = usersModel.findByPk(decoded.user_id);
        
        if(user) {
  
          let documentModes = await documentModesModel.findAll({attributes : ['id','document_mode']});
          let data = documentModes.map((e) => {
            let document_modes = {};
            document_modes.id = e.id;
            document_modes.value = e.document_mode;
            return document_modes;
          });
  
          resolve({"status" : 200, "data" : data, "message" : "Document modes fetched successfully"});
  
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



  
  exports.fetchAllDocumentTypes = async function(token) {

    return new Promise(async (resolve, reject) =>{

      try {
        
        const decoded = jwt.decode(token);
  
        const user = usersModel.findByPk(decoded.user_id);
        
        if(user) {
  
          let documentTypes = await documentTypesModel.findAll({attributes : ['id','document_type']});
          let data = documentTypes.map((e) => {
            let document_types = {};
            document_types.id = e.id;
            document_types.value = e.document_type;
            return document_types;
          });
  
          resolve({"status" : 200, "data" : data, "message" : "Document types fetched successfully"});
  
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


  exports.fetchAllClients = async function(token, page, pageSize,keyword) {

    return new Promise(async (resolve, reject) =>{

      try {
        
        const decoded = jwt.decode(token);
  
        const user = usersModel.findByPk(decoded.user_id);
        
        if(user) {

          const offset = (page - 1) * pageSize;

          let where = {};
          if (keyword) {
            where = {
              [Op.or]: [
                {
                  name: {
                    [Op.like]: `%${keyword}%`,
                  },
                },
                {
                  email: {
                    [Op.like]: `%${keyword}%`,
                  },
                },
                {
                  contact_no: {
                    [Op.like]: `%${keyword}%`,
                  },
                },
              ],
            };
          }

  
          let {count, rows }= await requestProfileModel.findAndCountAll({where,attributes : ['name','id','department_id','campus_id','section_id','image'],offset,limit : pageSize ,order : [['id','DESC']]});

          const totalPages = Math.ceil(count / pageSize);

          let data = await Promise.all(rows.map(async (e) => {

            let department_id = e.department_id;
            console.log("Department_id", department_id);
            let department = (
              await departmentsModel.findOne({ where: { id: department_id } })
            ).getDataValue("department");

            let campus_id = e.campus_id;
            let campus = (
              await campusModel.findOne({ where: { id: campus_id } })
            ).getDataValue("campus");

            let section_id = e.section_id;
            let section = (
              await sectionsModel.findOne({ where: { id: section_id } })
            ).getDataValue("section");

            let fields = {
              id: e.id,
              name: e.name,
              department: department,
              department_id : e.department_id,
              campus: campus,
              campus_id : e.campus_id,
              section: section,
              section_id : e.section_id,
              image : e.image
            };

            console.log("Fields : ", fields);

            return fields;
          }));

          console.log("Data : ", data);
  
          resolve({"status" : 200, "data" : data, "message" : "Request Profiles fetched successfully",meta: {
            count,
            totalPages,
            currentPage: page,
            pageSize,
          },});
  
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




  exports.fetchSingleClient = async function(token,client_id) {

    return new Promise(async (resolve, reject) =>{

      try {
        
        const decoded = jwt.decode(token);
  
        const user = usersModel.findByPk(decoded.user_id);
        
        if(user) {
  
          let client_details = await requestProfileModel.findOne({where : {id : client_id},attributes : ['name','id','department_id','campus_id','section_id','email','contact_no','image']});


          // let data = await Promise.all(clients.map(async (e) => {

            let department_id = client_details.department_id;
            console.log("Department_id", department_id);
            let department = (
              await departmentsModel.findOne({ where: { id: department_id } })
            ).getDataValue("department");

            let campus_id = client_details.campus_id;
            let campus = (
              await campusModel.findOne({ where: { id: campus_id } })
            ).getDataValue("campus");

            let section_id = client_details.section_id;
            let section = (
              await sectionsModel.findOne({ where: { id: section_id } })
            ).getDataValue("section")
            let fields = {
              id: client_details.id,
              name: client_details.name,
              email : client_details.email,
              contact_no : client_details.contact_no,
              department: department,
              department_id : department_id,
              campus: campus,
              campus_id : campus_id,
              section: section,
              section_id : section_id,
              image : client_details.image
            };

            console.log("Fields : ", fields);

            // return fields;
          // }));

          // console.log("Data : ", data);
  
          resolve({"status" : 200, "data" : fields, "message" : "Request Profiles fetched successfully"});
  
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




  exports.fetchAllJobTypes = async function(token) {

    return new Promise(async (resolve, reject) =>{

      try {
        
        const decoded = jwt.decode(token);
  
        const user = usersModel.findByPk(decoded.user_id);
        
        if(user) {
  
          let jobTypes = await jobTypesModel.findAll({attributes : ['id','job_type']});
          let data = jobTypes.map((e) => {
            let job_types = {};
            job_types.id = e.id;
            job_types.value = e.job_type
            return job_types;
          });
  
          resolve({"status" : 200, "data" : data, "message" : "Job types fetched successfully"});
  
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


  exports.fetchAllJobStatus = async function(token) {

    return new Promise(async (resolve, reject) =>{

      try {
        
        const decoded = jwt.decode(token);
  
        const user = usersModel.findByPk(decoded.user_id);
        
        if(user) {
  
          let jobStatus = await jobStatusModel.findAll({attributes : ['id','status']});
          let data = jobStatus.map((e) => {
            let job_status = {};
            job_status.id = e.id;
            job_status.value = e.status;
            return job_status;
          });
  
          resolve({"status" : 200, "data" : data, "message" : "Job status fetched successfully"});
  
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


  exports.editJob = async function(token,job_id, job_type, job_status,  job_title,requested_by, requested_by_entity, requested_by_department, requested_by_section, job_req_comment, confidentiality, require_sample, require_edits, document_type, document_name, document_mode, req_delivery_date, delivery_mode, deliver_to, deliver_to_entity, deliver_to_department, deliver_to_section, require_cover, require_finishing) {

    return new Promise(async (resolve, reject) => {
        try {
            
            const decoded = jwt.decode(token);
            const user = await usersModel.findByPk(decoded.user_id);
            console.log("Token : ", token);

            if(user) {
                if(job_id && job_type && job_status && requested_by && requested_by_entity && requested_by_department && requested_by_section && job_req_comment && confidentiality && require_sample && require_edits && document_name && req_delivery_date && delivery_mode && deliver_to && deliver_to_entity && deliver_to_department && deliver_to_section && require_cover && require_finishing || document_mode || document_type || job_title) {
                  
                  // let job_status_id = (await jobStatusModel.findOne({where : {status : job_status}, attributes : ['id'], raw : true})).id;
                  // console.log("job_status_id : ", job_status_id);

                  // //Entity/School is from campuses tabe
                  // let requested_by_entity_id = (await campusModel.findOne({where : {campus : requested_by_entity}, attributes : ['id'], raw : true})).id;
                  // console.log("requested_by_entity_id : ", requested_by_entity_id);

                  // let requested_by_department_id = (await departmentsModel.findOne({where : {department : requested_by_department}, attributes : ['id'], raw : true})).id;
                  // console.log("requested_by_department_id : ", requested_by_department_id);

                  // let requested_by_section_id = (await sectionsModel.findOne({where : {section : requested_by_section}, attributes : ['id'], raw : true})).id;
                  // console.log("requested_by_section_id : ", requested_by_section_id);

                  //   //Entity/School is from campuses tabe
                  //   let deliver_to_entity_id = (await campusModel.findOne({where : {campus : deliver_to_entity}, attributes : ['id'], raw : true})).id;
                  //   console.log("deliver_to_entity_id : ", deliver_to_entity_id);

                  //   let deliver_to_department_id = (await departmentsModel.findOne({where : {department : deliver_to_department}, attributes : ['id'], raw : true})).id;
                  //   console.log("deliver_to_department_id : ", deliver_to_department_id);

                  //   let deliver_to_section_id = (await sectionsModel.findOne({where : { section : deliver_to_section}, attributes : ['id'], raw : true})).id;
                  //   console.log("deliver_to_section_id : ", deliver_to_section_id);

                  //   let delivery_modes_id = (await deliveryModesModel.findOne({where : { delivery_mode : delivery_mode}, attributes : ['id'], raw : true})).id;
                  //   console.log("delivery_modes_id : ", delivery_modes_id);

                  //   let document_modes_id = (await documentModesModel.findOne({where : { document_mode : document_mode}, attributes : ['id'], raw : true})).id;
                  //   console.log("document_modes_id : ", document_modes_id);

                  //   let document_types_id = (await documentTypesModel.findOne({where : { document_type : document_type}, attributes : ['id'], raw : true})).id;
                  //   console.log("document_types_id : ", document_types_id);

                  //   // requested_by in UI image
                  //   let requested_by_client_id = (await requestProfileModel.findOne({where : { name : requested_by}, attributes : ['id'], raw : true})).id;
                  //   console.log("requested_by_client_id : ", requested_by_client_id);

                  //   let job_type_id = (await jobTypesModel.findOne({where : { job_type : job_type}, attributes : ['id'], raw : true})).id;
                  //   console.log("job_type_id : ", job_type_id);

                  //   // deliver_to in UI image
                  //   let deliver_to_client_id = (await requestProfileModel.findOne({where : { name : deliver_to}, attributes : ['id'], raw : true})).id;
                  //   console.log("deliver_to_client_id : ", deliver_to_client_id);



                    let updated_job = {
                      requested_by_id : requested_by, // Dropdown (id)
                      requested_by_entity_id : requested_by_entity, // Dropdown (id)
                      requested_by_department_id : requested_by_department, // Dropdown (id)
                      requested_by_section_id : requested_by_section, // Dropdown (id)
                      job_type_id : job_type, // Dropdown (id)
                      job_req_comment : job_req_comment,
                      document_type_id : document_type, // Dropdown (id)
                      document_name : document_name,
                      document_mode_id : document_mode, // Dropdown (id)
                      requested_delivery_date : req_delivery_date,
                      job_requested_on : dayjs().format(),
                      job_status_id : job_status, // Dropdown (id)
                      confidentiality : confidentiality, // Yes or No
                      require_sample : require_sample, // Yes or No
                      require_edits : require_edits, // Yes or No
                      delivery_mode_id : delivery_mode, // Dropdown (id)
                      deliver_to_id : deliver_to, // Dropdown (id)
                      deliver_to_entity_id : deliver_to_entity, // Dropdown (id)
                      deliver_to_department_id : deliver_to_department, // Dropdown (id)
                      deliver_to_section_id : deliver_to_section , // Dropdown (id)
                      require_cover : require_cover, // Yes or No and redirects to print_cover page
                      require_finishing_and_binding : require_finishing //Yes or No and redirects to finishing and binding page
                  }
                    console.log("updated_job : ", updated_job);

                    if(job_title) {

                      const title_count = await jobsModel.count({
                        where: {
                          job_title: job_title
                        }
                      });
                    
                      if (title_count > 0) {
                        reject({"status" : 400, "message" : "Job title not unique"});
                      }else {

                        updated_job['job_title'] = job_title;
                      }
                    }else {
                      console.log("No change in job_title....");
                    }
                    //Checking if dev_flag is true or not
                    //For development and testing purposes
                    
                      
                      let edit_job = await jobsModel.findOne({where : {id : job_id}});



                      if (edit_job) {
                        //Checking if for development or testing or not
                        let dev_flag = edit_job.getDataValue("dev_flag");

                        if (dev_flag == true) {
                          //Updating database
                          let updatedJob = await edit_job.update(updated_job);
                          let savedUpdate = updatedJob.save();

                          if (savedUpdate) {
                            resolve({
                              status: 200,
                              data: updatedJob,
                              message: "Job updated successfully",
                            });
                          } else {
                            reject({
                              status: 400,
                              message: "Cannot update job",
                            });
                          }
                        } else {
                          reject({
                            status: 400,
                            message:
                              "Cannot update production datas during development and testing",
                          });

                        }
                      }else {
                        reject({"status" : 400, "message" : "Cannot edit job"});

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


exports.fetchAllJobProfiles = async function(token,page,pageSize,keyword) {

  return new Promise(async (resolve, reject) =>{

    try {
      
      const decoded = jwt.decode(token);

      console.log("Token : " , token);
      console.log("User_id : ", decoded.user_id);

      // const user = usersModel.findByPk(decoded.user_id);
      
      // if(user) {

      const offset = (page - 1) * pageSize;

      console.log("Keyword :", keyword);
      console.log("TypeOf(Keyword) :", typeof(keyword));

    

      // let where = {};
      // if (keyword) {
      //   where = {
      //     job_title: {
      //       [Op.like]: `%${keyword}%`,
      //     },
      //   };
      // }
    

      let where = {};
      if (keyword) {
        where.job_title = {
            [Op.like]: `%${keyword}%`,
        };
      }
console.log("Where : ", where);


      

        const { count, rows } = await jobsModel.findAndCountAll({
          where,
          attributes: [
            "id",
            "job_id",
            "job_title",
            "requested_by_id",
            "requested_by_entity_id",
            "requested_by_department_id",
            "requested_by_section_id",
            "job_type_id",
            "job_req_comment",
            "document_type_id",
            "document_name",
            "document_mode_id",
            "requested_delivery_date",
            "job_req_for",
            "job_status_id",
            "confidentiality",
            "require_sample",
            "require_edits",
            "delivery_mode_id",
            "deliver_to_id",
            "deliver_to_entity_id",
            "deliver_to_department_id",
            "deliver_to_section_id",
            "deliver_to_location",
            "require_cover",
            "require_finishing_and_binding",
            "job_requested_on",
            "job_completed_on",
          ],
          offset,
          limit: pageSize,
          order: [["id", "DESC"]],
        });

//         const queryInterface = await jobsModel.sequelize.dialect.queryGenerator();

//         const sqlQuery =
//           queryInterface
//             .selectQuery(
//             jobsModel.job_profiles,
//             {
//               attributes: [
//                 "id",
//                 "job_id",
//                 "job_title",
//                 "requested_by_id",
//                 "requested_by_entity_id",
//                 "requested_by_department_id",
//                 "requested_by_section_id",
//                 "job_type_id",
//                 "job_req_comment",
//                 "document_type_id",
//                 "document_name",
//                 "document_mode_id",
//                 "requested_delivery_date",
//                 "job_req_for",
//                 "job_status_id",
//                 "confidentiality",
//                 "require_sample",
//                 "require_edits",
//                 "delivery_mode_id",
//                 "deliver_to_id",
//                 "deliver_to_entity_id",
//                 "deliver_to_department_id",
//                 "deliver_to_section_id",
//                 "deliver_to_location",
//                 "require_cover",
//                 "require_finishing_and_binding",
//                 "job_requested_on",
//                 "job_completed_on",
//               ],
//               where,
//               offset,
//               limit: pageSize,
//               order: [["id", "DESC"]],
//             }
//           );

// console.log(sqlQuery);


      console.log("Rows : ", rows);
      const totalPages = Math.ceil(count / pageSize);

        let data = await Promise.all(rows.map(async(e) => { 
          let jobsData = {};
          jobsData.id = e.id;
          // jobsData.job_id = e.job_id;
          jobsData.job_title = e.job_title;
          // jobsData.requested_client_id = e.requested_by_id;

          // console.log("Jobs_data befor fetching requested client profile : ", jobsData);
          // Fetching client details from request_profiles table
          let requested_client_profile = await clientsModel.findOne({
            where: { id: e.requested_by_id },
            include: [
              {
                model: departmentsModel,
                attributes: ["department"],
                as: "department",
              },
              {
                model: campusModel,
                as: "campus",
                attributes: ["campus"],
              },
              {
                model: sectionsModel,
                as: "section",
                attributes: ["section"],
              },
            ],
            raw: true,
            // attributes: { exclude: ["createdAt", "updatedAt"] },
            attributes : ['name'],
          });
          if(requested_client_profile == null) {

            jobsData.requested_client = "No client found";
          }else {

            // let requested_client_details = {};
            // requested_client_details.id = requested_client_profile.id;
            // requested_client_profile.name = requested_client_profile.name;
            // requested_client_details.email = requested_client_profile.email;
            // requested_client_details.contact_no = requested_client_profile.contact_no;
            jobsData.requested_client = requested_client_profile;

          }

          
          // //No entities to fetch

          // //Fetcing requested client department from departments table
          // jobsData.requested_by_department_id = e.requested_by_department_id;

          // if(e.requested_by_department_id == 0) {

          //   jobsData.requested_by_department = "No department found";
          // }else {

          //   let department_data = await departmentsModel.findOne({where : {id : e.requested_by_department_id}, attributes : ['department']});
          //   // console.log("Department_data : ", department_data);
          //   if(department_data == null) {
          //     jobsData.requested_by_department = "Nothing found";
          //   }else {
  
          //     jobsData.requested_by_department = department_data.department;
  
          //   }
          // }

          //Fetching requested client section from sections table
          // jobsData.requested_by_section_id = e.requested_by_section_id;

          // if(e.requested_by_section_id == 0) {

          //   jobsData.requested_by_section = null;
            
          // }else {


            
          //              //Fetching requested client section from sections table
            
          //                let section_data = await sectionsModel.findOne({where : {id : e.requested_by_section_id}, attributes : ['section']});
          //               //  console.log("Section_data : ", section_data);
            
          //                if(section_data == null) {
          //                 jobsData.requested_by_section = null;
          //                }else {
            
          //                  jobsData.requested_by_section = section_data.section;
          //                }
          // }
  




          //  //Fetching job type from job types table
          //  jobsData.job_type_id = e.job_type_id;

          //  let job_types_data = await jobTypesModel.findOne({where : {id : e.job_type_id}, attributes : ['job_type']});
          // //  console.log("job_types_data : ",job_types_data);
          //  if(job_types_data == null) {
          //   jobsData.job_type = "Nothing found"
          //  }
          //  jobsData.job_type = job_types_data.job_type;

           
          //  jobsData.job_req_comment = e.job_req_comment;

          //  //Fetching document type from document types table
          //  jobsData.document_type_id = e.document_type_id;

          //  let document_types_data = await documentTypesModel.findOne({where : {id : e.document_type_id}, attributes : ['document_type']});
          // //  console.log("document_types_data : ",document_types_data);

          //  if(document_types_data == null) {
          //   jobsData.document_type = "Nothing found";
          //  }else {

          //    jobsData.document_type = document_types_data.document_type;
          //  }




          //  jobsData.document_name = e.document_name;


          //  //Fetching document modes from document modes table
          //  jobsData.document_mode_id = e.document_mode_id;
          //  if(e.document_mode_id == 1) {
          //   jobsData.document_mode = "";
          //  }else {

          //    //Fetching document modes form document_modes table
          //    let document_modes_data = await documentModesModel.findOne({where : {id : e.document_mode_id}, attributes : ['document_mode']});
          //   //  console.log("document_modes_data : ",document_modes_data);
  
          //    if(document_modes_data == null) {
  
          //     jobsData.document_mode = "Nothing found";
  
          //    }else {
  
          //      jobsData.document_mode = document_modes_data.document_mode;
  
          //    }
          //  }



            jobsData.requested_delivery_date = e.requested_delivery_date;


          //   jobsData.job_req_for = e.job_req_for;

           //Fetching job_status data from job_statuses table
          //  jobsData.job_status_id = e.job_status_id;

            if(e.job_status_id == 4) {

              jobsData.job_status = "";

            }else {

              
                        //Fetching job_status from job_status table
                          let job_status_data = await jobStatusModel.findOne({where : {id : e.job_status_id}, attributes :['status']});
                          // console.log("job_status_data : ",job_status_data);
              
                          if(job_status_data == null) {
              
                            jobsData.status = null;
                          }else {
              
                            jobsData.status = job_status_data.status;
              
                          }
            }


          // jobsData.confidentiality = e.confidentiality;

          // // '','','','','deliver_to_entity_id','','','','','','',''

          // jobsData.require_sample = e.require_sample;

          // jobsData.require_edits = e.require_edits;


          //   //Fetching delivery modes data from delivery modes table
          //   jobsData.delivery_mode_id = e.delivery_mode_id;

          // if(e.delivery_mode_id == 8) {
          //   jobsData.delivery_mode = "";
          // }else {

          //   //Fetching delivery modes from delivery_modes table
          //   let deliver_modes_data = await deliveryModesModel.findOne({where : {id : e.delivery_mode_id}, attributes : ['delivery_mode']});
          //   // console.log("deliver_modes_data : ",deliver_modes_data);
  
          //   if(deliver_modes_data == null) {
  
          //     jobsData.delivery_mode = 'Nothing found';
          //   }else {
              
          //     jobsData.delivery_mode = deliver_modes_data.delivery_mode;
          //   }
          // }



          // //Fetching client details for delivery from request_profiles table
          // jobsData.deliver_to_client_id = e.deliver_to_id;

          // let deliver_to_client_profile = await clientsModel.findOne({where : {id : e.deliver_to_id},include : [{model : departmentsModel, as : "department", attributes : ["id",'department']},{model : campusModel, as : "campus",attributes : ["id",'campus']},{model : sectionsModel, as : "section", attributes : ["id",'section']}],raw:true, attributes: { exclude: ["createdAt", "updatedAt"] }});
          // if(deliver_to_client_profile == null) {

          //   jobsData.deliver_to_client = "No client found";
          // }else {

          //   let deliver_to_client_details = {};
          //   // deliver_to_client_details.id = deliver_to_client_profile.id;
          //   deliver_to_client_details.name = deliver_to_client_profile.name;
          //   // deliver_to_client_details.email = deliver_to_client_profile.email;
          //   // deliver_to_client_details.contact_no = deliver_to_client_profile.contact_no;
          //   jobsData.deliver_to_client = deliver_to_client_details;

          // }


          // //Fetching department for delivery
          // jobsData.deliver_to_department_id = e.deliver_to_department_id;

          // if(e.deliver_to_department_id == 32) {
          //   jobsData.deliver_to_department = "";
          // }else if(e.deliver_to_department_id == 15) {
          //   jobsData.deliver_to_department = "English";
          // }else {

          //   let deliver_to_department = await departmentsModel.findOne({where : {id :e.deliver_to_department_id }, attributes : ['department']});
          //   // console.log("deliver_to_department : ",deliver_to_department);
  
          //   if(deliver_to_department == null) {
  
          //     jobsData.deliver_to_department = "Nothing found";
          //   }else {
  
          //     jobsData.deliver_to_department = deliver_to_department.department;
  
          //   }
          // }


          // //Fetching section for delivery
          // jobsData.deliver_to_section_id = e.deliver_to_section_id;

          // if(e.deliver_to_section_id == 0) {

          //   jobsData.deliver_to_section = "No section found";

          // }else if (e.deliver_to_section_id == 18) {
          //   jobsData.deliver_to_section = "Principal Personal Assisstent";
          // }else {

          //   let deliver_to_section = await sectionsModel.findOne({where : {id : e.deliver_to_section_id},attributes : ['section']});
          //   // console.log("deliver_to_section : ",deliver_to_section);
  
          //   if(deliver_to_section == null) {
          //     jobsData.deliver_to_section = "Nothing found";
          //   }else {
  
          //     jobsData.deliver_to_section = deliver_to_section.section;
  
          //   }
          // }


          // jobsData.deliver_to_location = e.deliver_to_location;
          // jobsData.require_cover = e.require_cover;
          // jobsData.require_finishing_and_binding = e.require_finishing_and_binding;
          jobsData.job_requested_on = e.job_requested_on;
          jobsData.job_completed_on = e.job_completed_on;

          // // console.log(`Job_id : ${e.id} and jobsData : ${jobsData}`);

          // // console.log("Job_id : ",e.id,"   Jobs data after fetching request client profile : ", jobsData);


          //Fetching finishing and binding datas
          // let require_finishing_and_binding

          // let finishing_and_binding_data = await finishing_and_bindings.findOne(
          //   {
          //     where: { job_id: e.id },
          //     include: [
          //       {
          //         model: binding_types,
          //         as: "binding_type",
          //         attributes: ["id","binding_type"],
          //       },
          //       {
          //         model: binding_status,
          //         as: "binding_status",
          //         attributes: ["id","status"],
          //       },
          //     ],
          //     raw: true,
          //     // attributes: { exclude: ["createdAt", "updatedAt"] },
          //     attributes : ['id']
          //   }
          // );

          // console.log("Binding operator_id : ", finishing_and_binding_data.getDataValue('binding_operator_id') );
          
          //Getting corresponding data values for id fields
          // if(finishing_and_binding_data !== null) {
          //   console.log("Finishing and binding data : ", finishing_and_binding_data);
          //   console.log("Binding_operator_id : ", finishing_and_binding_data.binding_operator_id);
          //   //Fetching operator of finishing and binding table
          //   let operator = (await opetatorsModel.findOne({where : {id : finishing_and_binding_data.binding_operator_id}, attributes : ['operator_name']}));
          //   let operator_value;
          //   if(operator !== null) {
          //     operator_value = operator.getDataValue('operator_name');
          //   }else {
          //     operator_value = null;
          //   }
          //   finishing_and_binding_data.binding_operator = operator_value;

          //   //Fetching material from materials table by id from finishing and binding table
          //   let material = (await materialsModel.findOne({where : {id : finishing_and_binding_data.material_id},attributes : ['name']}));
          //   let material_value;
          //   if(material !== null) {
          //     material_value = material.getDataValue('name');
          //   }else {
          //     material_value = null;
          //   }
          //   finishing_and_binding_data.binding_material = material_value;


          // }

          // jobsData.finishingAndBinding = finishing_and_binding_data;


          // //Fetching print_cover datas
          // let print_cover_data = await printCoverModel.findOne({
          //   where: { job_id: e.id },
          //   include: [
          //     {
          //       model: print_cover_status,
          //       as: "print_cover_status",
          //       attributes: ["status"],
          //     },
          //     {
          //       model: print_cover_colors,
          //       as: "print_cover_color",
          //       attributes: ["print_cover_color"],
          //     },
          //   ],
          //   raw: true,
          //   // attributes: { exclude: ["createdAt", "updatedAt"] },
          //   attributes : ['id']
          // });

          // if(print_cover_data !== null) {

          //   //Fetching operator details from id saved in print cover table
          //   if(print_cover_data.print_cover_operator_id !== '') {

          //     let printCoverOperatorId = Number(print_cover_data.print_cover_operator_id);

          //     console.log("printCoverOperatorId : ", printCoverOperatorId);
          //     console.log("Type of (printCoverOperatorId) : ", typeof(printCoverOperatorId));

          //     let operator = (await opetatorsModel.findOne({where : {id : printCoverOperatorId}, attributes : ['operator_name']}));
          //     if(operator !== null) {

          //       let operator_value = operator.getDataValue('operator_name');
          //       print_cover_data.print_cover_operator = operator_value;   
          //     }else {
          //       print_cover_data.print_cover_operator = null;
          //     }
          //   }else {
          //     print_cover_data.print_cover_operator = "No operator found (id blank)";
          //   }
  
          //   //Fetching materials details from id saved in print cover table
          //   if(print_cover_data.print_cover_material_id !== ''){
          //     let printCoverMaterialId = Number(print_cover_data.print_cover_material_id);

          //     console.log("printCoverMaterialId : ", printCoverMaterialId);
          //     console.log("Type of (printCoverMaterialId) : ", typeof(printCoverMaterialId));


          //     let material = (await materialsModel.findOne({where : {id : printCoverMaterialId},attributes : ['name']}));
          //     if(material !== null) {

          //       let material_value = material.getDataValue('name');
          //       print_cover_data.print_cover_material = material_value;  
          //     }else {
          //       print_cover_data.print_cover_material = null;
          //     }
          //   }else {
          //     print_cover_data.print_cover_material = "No material found (id blank)";
          //   }



          //   //Fetching print_cover_machine details from printers table

          //   // console.log("print_cover_data.print_cover_machine_id : ", print_cover_data.print_cover_machine_id);

          //   if(print_cover_data.print_cover_machine_id !== ''){


          //     console.log("print_cover_data.print_cover_machine_id : ", print_cover_data.print_cover_machine_id);

          //     let printCoverMachineId = print_cover_data.print_cover_machine_id;


          //     if(isNaN(printCoverMachineId)) {

          //        printCoverMachineId = Number(print_cover_data.print_cover_machine_id);
          //     }else {

          //        printCoverMachineId = print_cover_data.print_cover_machine_id;


          //     }

          //     console.log("printCoverMachineId : ", printCoverMachineId);
          //     console.log("Type of (printCoverMachineId) : ", typeof(printCoverMachineId));


          //     let machine = (await printers.findOne({where : {id : printCoverMachineId},attributes : ['name']}));
          //     if(machine !== null) {

          //       let machine_value = machine.getDataValue('name');
          //       print_cover_data.print_cover_machine = machine_value;  
          //     }else {
          //       print_cover_data.print_cover_machine = null;
          //     }
          //   }else {
          //     print_cover_data.print_cover_machine = "No machines found (id blank)";
          //   }
          // }
          
          // jobsData.print_cover = print_cover_data;


          //Fetching print_pages datas from print_pages table

          // let print_pages_data = await print_pages.findOne({
          //   where: { job_id: e.id },
          //   include: [
          //     {
          //       model: print_pages_colors,
          //       as: "print_pages_color",
          //       attributes: ["job_print_color"],
          //     },
          //   ],
          //   raw: true,
          //   // attributes: { exclude: ["createdAt", "updatedAt"] },
          //   attributes : ['id']
          // });

          // if(print_pages_data !== null) {


            
          //             //Fetching print_pages machine details from printers table
            
          //             print_pages_data.print_pages_machine_id = print_pages_data.print_pages_machine;

          //             if(print_pages_data.print_pages_machine !== '' && print_pages_data.print_pages_machine !== 0){
          //               let printPagesMachineId = Number(print_pages_data.print_pages_machine);
            
          //               console.log("printPagesMachineId : ", printPagesMachineId);
          //               console.log("Type of (printPagesMachineId) : ", typeof(printPagesMachineId));
            
            
          //               let machine = (await printers.findOne({where : {id : printPagesMachineId},attributes : ['name']}));
          //               if(machine !== null) {
            
          //                 let machine_value = machine.getDataValue('name');
          //                 print_pages_data.print_pages_printer_machine = machine_value;  
          //               }else {
          //                 print_pages_data.print_pages_printer_machine = null;
          //               }
          //             }else {
          //               print_pages_data.print_pages_printer_machine = "No machine found (id blank or 0)";
          //             }

          //             //Fetching print_pages operator details from operators table

          //             if(print_pages_data.job_print_operator_id !== '' && print_pages_data.job_print_operator_id !== 0){
          //               let printPagesOperatorId = Number(print_pages_data.job_print_operator_id);
            
          //               console.log("printPagesOperatorId : ", printPagesOperatorId);
          //               console.log("Type of (printPagesOperatorId) : ", typeof(printPagesOperatorId));
            
            
          //               let operator = (await opetatorsModel.findOne({where : {id : printPagesOperatorId},attributes : ['operator_name']}));
          //               if(operator !== null) {
            
          //                 let operator_value = operator.getDataValue('operator_name');
          //                 print_pages_data.print_pages_operator = operator_value;  
          //               }else {
          //                 print_pages_data.print_pages_operator = null;
          //               }
          //             }else {
          //               print_pages_data.print_pages_operator = "No operator found (id blank or 0)";
          //             }

          //             //Fetching print_pages paper_type details from papers table

          //             if(print_pages_data.paper_type_id !== '' && print_pages_data.paper_type_id !== 0){
          //               let printPagesPaperTypeId = Number(print_pages_data.paper_type_id);
            
          //               console.log("printPagesPaperTypeId : ", printPagesPaperTypeId);
          //               console.log("Type of (printPagesPaperTypeId) : ", typeof(printPagesPaperTypeId));
            
            
          //               let paper = (await papers.findOne({where : {id : printPagesPaperTypeId},attributes : ['paper_name']}));
          //               if(paper !== null) {
            
          //                 let paper_value = paper.getDataValue('paper_name');
          //                 print_pages_data.print_pages_paper_type = paper_value;  
          //               }else {
          //                 print_pages_data.print_pages_paper_type = null;
          //               }
          //             }else {
          //               print_pages_data.print_pages_paper_type = "No paper type found (id blank or 0)";
          //             }
          // }



          // jobsData.print_pages = print_pages_data;
          
          return jobsData;
        
        }));

        console.log("data : ", data);



        // console.log("Finishing and Binding Data : ",  finishing_and_binding_data);

        resolve({"status" : 200, "data" : data, "message" : "Job profiles fetched successfully", meta: {
          count,
          totalPages,
          currentPage: page,
          pageSize,
        },});

      // }else {

      //   reject({"status" : 400, "message" : "Requested user not found"});
      // }

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





exports.fetchSingleJobProfiles = async function(token,job_id) {

  return new Promise(async (resolve, reject) =>{

    try {
      
      const decoded = jwt.decode(token);

      console.log("Token : " , token);
      console.log("User_id : ", decoded.user_id);

      // const user = usersModel.findByPk(decoded.user_id);
      
      // if(user) {

      // const offset = (page - 1) * pageSize;

      const job_details = await jobsModel.findOne({where : {id : job_id} ,attributes : ['id','job_id','job_title','requested_by_id','requested_by_entity_id','requested_by_department_id','requested_by_section_id','job_type_id','job_req_comment','document_type_id','document_name','document_mode_id','requested_delivery_date','job_req_for','job_status_id','confidentiality','require_sample','require_edits','delivery_mode_id','deliver_to_id','deliver_to_entity_id','deliver_to_department_id','deliver_to_section_id','deliver_to_location','require_cover','require_finishing_and_binding','job_requested_on','job_completed_on']});

      // const totalPages = Math.ceil(count / pageSize);

        // let data = await Promise.all(rows.map(async(e) => { 
          let jobsData = {};
          jobsData.id = job_details.id;
          jobsData.job_id = job_details.job_id;
          jobsData.job_title = job_details.job_title;

          // console.log("Jobs_data befor fetching requested client profile : ", jobsData);
          //Fetching client details from request_profiles table
          let requested_client_profile = await clientsModel.findOne({where : {id : job_details.requested_by_id},include : [{model : departmentsModel, as : "department", attributes : ['department']},{model : campusModel, as : "campus",attributes : ['campus']},{model : sectionsModel, as : "section", attributes : ['section']}],raw:true, attributes: { exclude: ["createdAt", "updatedAt"] }});
          if(requested_client_profile == null) {

            jobsData.requested_client = "No client found";
          }else {

            // let requested_client_details = {};
            // requested_client_details.id = requested_client_profile.id;
            // requested_client_details.name = requested_client_profile.name;
            // requested_client_details.email = requested_client_profile.email;
            // requested_client_details.contact_no = requested_client_profile.contact_no;
            jobsData.requested_client = requested_client_profile;

          }

          
          //No entities to fetch

          //Fetcing requested client department from departments table

          if(job_details.requested_by_department_id == 0) {

            jobsData.requested_by_department = "No department found";

          }else {

            let department_data = await departmentsModel.findOne({where : {id : job_details.requested_by_department_id}, attributes : ['department']});
            // console.log("Department_data : ", department_data);
            if(department_data == null) {
              jobsData.requested_by_department = "Nothing found";
            }else {
  
              jobsData.requested_by_department = department_data.department;
  
            }
          }


          if(job_details.requested_by_section_id == 0) {

            jobsData.requested_by_section = "No section found";
            
          }else {


            
                       //Fetching requested client section from sections table
            
                         let section_data = await sectionsModel.findOne({where : {id : job_details.requested_by_section_id}, attributes : ['section']});
                        //  console.log("Section_data : ", section_data);
            
                         if(section_data == null) {
                          jobsData.requested_by_section = "Nothing found";
                         }else {
            
                           jobsData.requested_by_section = section_data.section;
                         }
          }
  




           //Fetching job type from job types table
           let job_types_data = await jobTypesModel.findOne({where : {id : job_details.job_type_id}, attributes : ["id",'job_type']});
           jobsData.job_type_id = job_types_data.id;
          //  console.log("job_types_data : ",job_types_data);
           if(job_types_data == null) {
            jobsData.job_type = "Nothing found"
           }
           jobsData.job_type = job_types_data.job_type;

           
           jobsData.job_req_comment = job_details.job_req_comment;

           //Fetching document type from document types table
           let document_types_data = await documentTypesModel.findOne({where : {id : job_details.document_type_id}, attributes : ['document_type']});
          //  console.log("document_types_data : ",document_types_data);

           if(document_types_data == null) {
            jobsData.document_type = "Nothing found";
           }else {

             jobsData.document_type = document_types_data.document_type;
           }




           jobsData.document_name = job_details.document_name;



           if(job_details.document_mode_id == 1) {
            jobsData.document_mode = "";
           }else {

             //Fetching document modes form document_modes table
             let document_modes_data = await documentModesModel.findOne({where : {id : e.document_mode_id}, attributes : ['document_mode']});
            //  console.log("document_modes_data : ",document_modes_data);
  
             if(document_modes_data == null) {
  
              jobsData.document_mode = "Nothing found";
  
             }else {
  
               jobsData.document_mode = document_modes_data.document_mode;
  
             }
           }



            jobsData.requested_delivery_date = job_details.requested_delivery_date;


            jobsData.job_req_for = job_details.job_req_for;


            if(job_details.job_status_id == 4) {

              jobsData.job_status = "";

            }else {

              
                        //Fetching job_status from job_status table
                          let job_status_data = await jobStatusModel.findOne({where : {id : job_details.job_status_id}, attributes :["id",'status']});

                          jobsData.job_status_id = job_status_data.id;
                          // console.log("job_status_data : ",job_status_data);
              
                          if(job_status_data == null) {
              
                            jobsData.status = "Nothing found";
                          }else {
              
                            jobsData.status = job_status_data.status;
              
                          }
            }


          jobsData.confidentiality = job_details.confidentiality;

          // '','','','','deliver_to_entity_id','','','','','','',''

          jobsData.require_sample = job_details.require_sample;

          jobsData.require_edits = job_details.require_edits;



          if(job_details.delivery_mode_id == 8) {
            jobsData.delivery_mode = "";
          }else {

            //Fetching delivery modes from delivery_modes table
            let deliver_modes_data = await deliveryModesModel.findOne({where : {id : job_details.delivery_mode_id}, attributes : ['id','delivery_mode']});
            jobsData.delivery_mode_id = deliver_modes_data.id;
            // console.log("deliver_modes_data : ",deliver_modes_data);
  
            if(deliver_modes_data == null) {
  
              jobsData.delivery_mode = 'Nothing found';
            }else {
              
              jobsData.delivery_mode = deliver_modes_data.delivery_mode;
            }
          }



          //Fetching client details for delivery from request_profiles table
           //Fetching client details from request_profiles table
           let deliver_to_client_profile = await clientsModel.findOne({where : {id : job_details.deliver_to_id},include : [{model : departmentsModel, as : "department", attributes : ["id",'department']},{model : campusModel, as : "campus",attributes : ["id",'campus']},{model : sectionsModel, as : "section", attributes : ["id",'section']}],raw:true, attributes: { exclude: ["createdAt", "updatedAt"] }});
           if(deliver_to_client_profile == null) {
 
             jobsData.deliver_to_client = "No client found";
           }else {
 
             // let requested_client_details = {};
             // requested_client_details.id = requested_client_profile.id;
             // requested_client_details.name = requested_client_profile.name;
             // requested_client_details.email = requested_client_profile.email;
             // requested_client_details.contact_no = requested_client_profile.contact_no;
             jobsData.deliver_to_client = deliver_to_client_profile;
 
           }


          //Fetching department for delivery
          if(job_details.deliver_to_department_id == 32) {
            jobsData.deliver_to_department = "";
          }else if(job_details.deliver_to_department_id == 15) {
            jobsData.deliver_to_department = "English";
          }else {

            let deliver_to_department = await departmentsModel.findOne({where : {id :job_details.deliver_to_department_id }, attributes : ['department']});
            // console.log("deliver_to_department : ",deliver_to_department);
  
            if(deliver_to_department == null) {
  
              jobsData.deliver_to_department = "Nothing found";
            }else {
  
              jobsData.deliver_to_department = deliver_to_department.department;
  
            }
          }


          //Fetching section for delivery

          if(job_details.deliver_to_section_id == 0) {

            jobsData.deliver_to_section = "No section found";

          }else if (job_details.deliver_to_section_id == 18) {
            jobsData.deliver_to_section = "Principal Personal Assisstent";
          }else {

            let deliver_to_section = await sectionsModel.findOne({where : {id : job_details.deliver_to_section_id},attributes : ['section']});
            // console.log("deliver_to_section : ",deliver_to_section);
  
            if(deliver_to_section == null) {
              jobsData.deliver_to_section = "Nothing found";
            }else {
  
              jobsData.deliver_to_section = deliver_to_section.section;
  
            }
          }


          jobsData.deliver_to_location = job_details.deliver_to_location;
          jobsData.require_cover = job_details.require_cover;
          jobsData.require_finishing_and_binding = job_details.require_finishing_and_binding;
          jobsData.job_requested_on = job_details.job_requested_on;
          jobsData.job_completed_on = job_details.job_completed_on;

          // console.log(`Job_id : ${e.id} and jobsData : ${jobsData}`);

          // console.log("Job_id : ",e.id,"   Jobs data after fetching request client profile : ", jobsData);


          //Fetching finishing and binding datas
          // let require_finishing_and_binding

          let finishing_and_binding_data = await finishing_and_bindings.findOne(
            {
              where: { job_id: job_details.id },
              include: [
                {
                  model: binding_types,
                  as: "binding_type",
                  attributes: ["binding_type"],
                },
                {
                  model: binding_status,
                  as: "binding_status",
                  attributes: ["status"],
                },
              ],
              raw: true,
              attributes: { exclude: ["createdAt", "updatedAt"] },
            }
          );

          // console.log("Binding operator_id : ", finishing_and_binding_data.getDataValue('binding_operator_id') );
          
          //Getting corresponding data values for id fields
          if(finishing_and_binding_data !== null) {
            console.log("Finishing and binding data : ", finishing_and_binding_data);
            console.log("Binding_operator_id : ", finishing_and_binding_data.binding_operator_id);

            //Fetching operator of finishing and binding table
            let operator = (await opetatorsModel.findOne({where : {id : finishing_and_binding_data.binding_operator_id}, attributes : ['operator_name']}));
            let operator_value;
            if(operator !== null) {
              operator_value = operator.getDataValue('operator_name');
            }else {
              operator_value = null;
            }
            finishing_and_binding_data.binding_operator = operator_value;

            //Fetching material from materials table by id from finishing and binding table
            let material = (await materialsModel.findOne({where : {id : finishing_and_binding_data.material_id},attributes : ['name']}));
            let material_value;
            if(material !== null) {
              material_value = material.getDataValue('name');
            }else {
              material_value = null;
            }
            finishing_and_binding_data.binding_material = material_value;


          }

          jobsData.finishingAndBinding = finishing_and_binding_data;


          //Fetching print_cover datas
          let print_cover_data = await printCoverModel.findOne({where : {job_id : job_details.id},include : [{model : print_cover_status, as : 'print_cover_status', attributes : ['status'],},{model : print_cover_colors, as : "print_cover_color", attributes : ['print_cover_color']}],raw : true, attributes: { exclude: ["createdAt", "updatedAt"] },});

          if(print_cover_data !== null) {

            //Fetching operator details from id saved in print cover table
            if(print_cover_data.print_cover_operator_id !== '') {

              let printCoverOperatorId = Number(print_cover_data.print_cover_operator_id);

              console.log("printCoverOperatorId : ", printCoverOperatorId);
              console.log("Type of (printCoverOperatorId) : ", typeof(printCoverOperatorId));

              let operator = (await opetatorsModel.findOne({where : {id : printCoverOperatorId}, attributes : ['operator_name']}));
              if(operator !== null) {

                let operator_value = operator.getDataValue('operator_name');
                print_cover_data.print_cover_operator = operator_value;   
              }else {
                print_cover_data.print_cover_operator = null;
              }
            }else {
              print_cover_data.print_cover_operator = "No operator found (id blank)";
            }
  
            //Fetching materials details from id saved in print cover table
            if(print_cover_data.print_cover_material_id !== ''){
              let printCoverMaterialId = Number(print_cover_data.print_cover_material_id);

              console.log("printCoverMaterialId : ", printCoverMaterialId);
              console.log("Type of (printCoverMaterialId) : ", typeof(printCoverMaterialId));


              let material = (await materialsModel.findOne({where : {id : printCoverMaterialId},attributes : ['name']}));
              if(material !== null) {

                let material_value = material.getDataValue('name');
                print_cover_data.print_cover_material = material_value;  
              }else {
                print_cover_data.print_cover_material = null;
              }
            }else {
              print_cover_data.print_cover_material = "No material found (id blank)";
            }



            //Fetching print_cover_machine details from printers table

            // console.log("print_cover_data.print_cover_machine_id : ", print_cover_data.print_cover_machine_id);

            if(print_cover_data.print_cover_machine_id !== ''){


              console.log("print_cover_data.print_cover_machine_id : ", print_cover_data.print_cover_machine_id);

              let printCoverMachineId = print_cover_data.print_cover_machine_id;


              if(isNaN(printCoverMachineId)) {

                 printCoverMachineId = Number(print_cover_data.print_cover_machine_id);
              }else {

                 printCoverMachineId = print_cover_data.print_cover_machine_id;


              }

              console.log("printCoverMachineId : ", printCoverMachineId);
              console.log("Type of (printCoverMachineId) : ", typeof(printCoverMachineId));


              let machine = (await printers.findOne({where : {id : printCoverMachineId},attributes : ['name']}));
              if(machine !== null) {

                let machine_value = machine.getDataValue('name');
                print_cover_data.print_cover_machine = machine_value;  
              }else {
                print_cover_data.print_cover_machine = null;
              }
            }else {
              print_cover_data.print_cover_machine = "No machines found (id blank)";
            }
          }

          //Fetching print_cover_sides data from print cover sides table
        //   if(print_cover_data.print_cover_sides !== ''){


        //     console.log("print_cover_data.print_cover_machine_id : ", print_cover_data.print_cover_machine_id);

        //     let printCoverMachineId = print_cover_data.print_cover_machine_id;


        //     if(isNaN(printCoverMachineId)) {

        //        printCoverMachineId = Number(print_cover_data.print_cover_machine_id);
        //     }else {

        //        printCoverMachineId = print_cover_data.print_cover_machine_id;


        //     }

        //     console.log("printCoverMachineId : ", printCoverMachineId);
        //     console.log("Type of (printCoverMachineId) : ", typeof(printCoverMachineId));


        //     let machine = (await printers.findOne({where : {id : printCoverMachineId},attributes : ['name']}));
        //     if(machine !== null) {

        //       let machine_value = machine.getDataValue('name');
        //       print_cover_data.print_cover_machine = machine_value;  
        //     }else {
        //       print_cover_data.print_cover_machine = null;
        //     }
        //   }else {
        //     print_cover_data.print_cover_machine = "No machines found (id blank)";
        //   }
        // }

          
          jobsData.print_cover = print_cover_data;



          //Fetching print_pages datas from print_pages table

          let print_pages_data = await print_pages.findOne({where : {job_id : job_details.id},include : [{model : print_pages_colors, as : "print_pages_color", attributes:['job_print_color']}],raw : true, attributes: { exclude: ["createdAt", "updatedAt"] },});

          if(print_pages_data !== null) {


            
                      //Fetching print_pages machine details from printers table
            
                      if(print_pages_data.print_pages_machine !== '' && print_pages_data.print_pages_machine !== 0){
                        let printPagesMachineId = Number(print_pages_data.print_pages_machine);
            
                        console.log("printPagesMachineId : ", printPagesMachineId);
                        console.log("Type of (printPagesMachineId) : ", typeof(printPagesMachineId));
            
            
                        let machine = (await printers.findOne({where : {id : printPagesMachineId},attributes : ['name']}));
                        if(machine !== null) {
            
                          let machine_value = machine.getDataValue('name');
                          print_pages_data.print_pages_printer_machine = machine_value;  
                        }else {
                          print_pages_data.print_pages_printer_machine = null;
                        }
                      }else {
                        print_pages_data.print_pages_printer_machine = "No machine found (id blank or 0)";
                      }

                      //Fetching print_pages operator details from operators table

                      if(print_pages_data.job_print_operator_id !== '' && print_pages_data.job_print_operator_id !== 0){
                        let printPagesOperatorId = Number(print_pages_data.job_print_operator_id);
            
                        console.log("printPagesOperatorId : ", printPagesOperatorId);
                        console.log("Type of (printPagesOperatorId) : ", typeof(printPagesOperatorId));
            
            
                        let operator = (await opetatorsModel.findOne({where : {id : printPagesOperatorId},attributes : ['operator_name']}));
                        if(operator !== null) {
            
                          let operator_value = operator.getDataValue('operator_name');
                          print_pages_data.print_pages_operator = operator_value;  
                        }else {
                          print_pages_data.print_pages_operator = null;
                        }
                      }else {
                        print_pages_data.print_pages_operator = "No operator found (id blank or 0)";
                      }

                      //Fetching print_pages paper_type details from papers table

                      if(print_pages_data.paper_type_id !== '' && print_pages_data.paper_type_id !== 0){
                        let printPagesPaperTypeId = Number(print_pages_data.paper_type_id);
            
                        console.log("printPagesPaperTypeId : ", printPagesPaperTypeId);
                        console.log("Type of (printPagesPaperTypeId) : ", typeof(printPagesPaperTypeId));
            
            
                        let paper = (await papers.findOne({where : {id : printPagesPaperTypeId},attributes : ['paper_name']}));
                        if(paper !== null) {
            
                          let paper_value = paper.getDataValue('paper_name');
                          print_pages_data.print_pages_paper_type = paper_value;  
                        }else {
                          print_pages_data.print_pages_paper_type = null;
                        }
                      }else {
                        print_pages_data.print_pages_paper_type = "No paper type found (id blank or 0)";
                      }
          }



          jobsData.print_pages = print_pages_data;


          console.log("jobsData : ", jobsData);
        
        // }));

        // console.log("data : ", data);

        resolve({"status" : 200, "data" : jobsData, "message" : "Job profiles fetched successfully"});

      // }else {

      //   reject({"status" : 400, "message" : "Requested user not found"});
      // }

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


exports.deleteJob = async function (token, job_id) {
  return new Promise(async (resolve, reject) => {
    try {

      let decoded = jwt.decode(token);

      let user = await usersModel.findByPk(decoded.user_id);

      if (user) {
        let job = await jobsModel.findByPk(job_id);

        if(job.dev_flag == true) {

          jobDeleted = await job.destroy();

        }else {
          reject({ status: 404, message: "Cannot delete production datas during development and testing" });
        }

        if(jobDeleted) {

          resolve({ status: 200, message: "Job deleted" });
          
        }else {

          reject({ status: 404, message: "Cannot delete job" });

        }

      } else {
        reject({ status: 404, message: "Requested user not found" });
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
  });
};




exports.fetchOperatorJobDetails = async function (token,page,pageSize,keyword) {

  return new Promise(async (resolve, reject)=>{

    try {

      console.log("Token : ", token);
      
      const decoded = jwt.decode(token);
      const userId = decoded.user_id;
      console.log("Type : ", typeof(userId));
      console.log("User_id : ", userId);
      // let user_id = userId.Number;
      const user = await usersModel.findOne({where : {id : decoded.user_id}});
    
      if(user){

        console.log("If condition passed");
        console.log("isOperator : ", user.isOperator);
        console.log("User name : ", user.first_name, ' ', user.last_name);

        // console.log("Branch_id : ", admin_user.branch_id);
        // console.log("Branch type : ",typeof(admin_user.branch_id));
        // let branch_id = parseInt(admin_user.branch_id);
        // console.log("Branch_id type : ",typeof(branch_id));

        // let branchName = (await branchModel.findOne({where : {id : branch_id}})).branch;
        // console.log("branchName : ", branchName);
        // let sectionName = (await sectionModel.findOne({where : {id : admin_user.section_id}})).section;
        // console.log("sectionName : ", sectionName);

        // let departmentName = (await departmentModel.findOne({where : {id : admin_user.department_id}})).department;
        // console.log("departmentName : ", departmentName);

        //Fetching operator id of user
        // let user_details = (await userModel.findOne({where : {id : decoded.user_id},attributes : ['operator_id'], raw : true}));

        if(user.isOperator) {
          let operator_id = user.getDataValue("operator_id");
          console.log("operator_id : ", operator_id);

          // Fetching role
          let role_ids = await userRoleConnector.findAll({
            where: { user_id: decoded.user_id },
            attributes: ["role_id"],
          });
          let roles = await Promise.all(
            role_ids.map(async (e) => {
              let role = (
                await userRoles.findOne({
                  where: { id: e.role_id },
                  attributes: ["role"],
                })
              ).getDataValue("role");
              return role;
            })
          );

          console.log("Roles : ", roles);

          // let allJobs = {};

          // jobs
          //Fetching job id's of that specific operator from finishing and binding table

          let binding_job_id_datas = await finishing_and_bindings.findAll({
            where: { binding_operator_id: operator_id },
            raw: true,
            attributes: ["job_id"],
          });

          let binding_job_ids = binding_job_id_datas.map((e) => {
            return e.job_id;
          });

          console.log("Job_ids : ", binding_job_ids);

          //Fetching job id's of operator from print_cover table

          let print_cover_job_id_datas = await printCoverModel.findAll({
            where: { print_cover_operator_id: operator_id },
            raw: true,
            attributes: ["job_id"],
          });

          let print_cover_job_ids = print_cover_job_id_datas.map((e) => {
            return e.job_id;
          });

          console.log("Print cover job ids : ", print_cover_job_ids);

          //Fetching job id's of operator from print_pages table

          let print_pages_job_id_datas = await print_pages.findAll({
            where: { job_print_operator_id: operator_id },
            raw: true,
            attributes: ["job_id"],
          });

          let print_pages_job_ids = print_pages_job_id_datas.map((e) => {
            return e.job_id;
          });

          console.log("Print pages job ids : ", print_pages_job_ids);

          //Merging these three array of ids inorder to fetch all job details of that specific operator user

          const mergedArray = [];
          const duplicates = {};

          // loop through the first array and add each element to the new array if it is not already in the new array
          for (let i = 0; i < binding_job_ids.length; i++) {
            if (!mergedArray.includes(binding_job_ids[i])) {
              mergedArray.push(binding_job_ids[i]);
            }if (duplicates[binding_job_ids[i]] === undefined) {
              duplicates[binding_job_ids[i]] = 1;
            } else {
              duplicates[binding_job_ids[i]]++;
            }
          }

          // loop through the second array and add each element to the new array if it is not already in the new array
          for (let i = 0; i < print_cover_job_ids.length; i++) {
            if (!mergedArray.includes(print_cover_job_ids[i])) {
              mergedArray.push(print_cover_job_ids[i]);
            }else {
              if (duplicates[print_cover_job_ids[i]] === undefined) {
                duplicates[print_cover_job_ids[i]] = 1;
              } else {
                duplicates[print_cover_job_ids[i]]++;
              }
          }
        }

          // loop through the third array and add each element to the new array if it is not already in the new array
          for (let i = 0; i < print_pages_job_ids.length; i++) {
            if (!mergedArray.includes(print_pages_job_ids[i])) {
              mergedArray.push(print_pages_job_ids[i]);
            }else {
              if (duplicates[print_pages_job_ids[i]] === undefined) {
                duplicates[print_pages_job_ids[i]] = 1;
              } else {
                duplicates[print_pages_job_ids[i]]++;
              }
            }
          }

          //Sorting merged array to descending order inorder to display lastly created job in the first position
          mergedArray.sort((a, b) => b - a);

          // console.log("Sorted Merged array : ",mergedArray);
          // console.log("Duplicate Values:", duplicates);


          //Applying pagination to array items
          // const endIndex = startIndex + pageSize;
          // const items = mergedArray.slice(startIndex, endIndex);
          let count = mergedArray.length;
          const totalPages = Math.ceil(count / pageSize);
          const offset = (page - 1) * pageSize;


          if (keyword) {
            // let where = {};
            // where.job_title = {
            //     [Op.like]: `%${keyword}%`,
            // };


            // console.log("Where : ", where);

            console.log("Keyword : ",keyword);


            const job_details = await jobsModel.findAll({
              where : {[Op.and] : [{id: { [Op.in]: mergedArray }},{job_title:{[Op.like]: `%${keyword}%`}}]},
              attributes: [
                "id",
                "job_title",
                "requested_delivery_date",
                "job_status_id",
                "job_requested_on",
                "job_completed_on",
              ],
              offset,
              limit: pageSize,
              order: [["id", "DESC"]],
              raw: true,
            });


            console.log("Job details : ", job_details);


            let Jobs_data = await Promise.all(job_details.map(async (e) => {

            

              if (e.job_status_id == 4) {
                e.job_status = "";
              } else {
                //Fetching job_status from job_status table
                let job_status_data = await jobStatusModel.findOne({
                  where: { id: e.job_status_id },
                  attributes: ["id", "status"],
                });

                // jobsData.job_status_id = job_status_data.id;
                // console.log("job_status_data : ",job_status_data);

                if (job_status_data == null) {
                  e.status = "Nothing found";
                } else {
                  e.status = job_status_data.status;
                }

                delete e.job_status_id;



                //Finishing and binding data
                let finishing_and_binding_data =
                await finishing_and_bindings.findOne({
                  where: { [Op.and] : [{job_id: e.id },{binding_operator_id : operator_id}]},
                  // include: [
                  //   {
                  //     model: binding_types,
                  //     as: "binding_type",
                  //     attributes: ["binding_type"],
                  //   },
                  //   {
                  //     model: binding_status,
                  //     as: "binding_status",
                  //     attributes: ["status"],
                  //   },
                  // ],
                  raw: true,
                  // attributes: { exclude: ["createdAt", "updatedAt"] },
                  attributes : ['id']
                });
                e.finishingAndBinding = finishing_and_binding_data;


                //Fetching print_cover datas
                let print_cover_data = await printCoverModel.findOne({
                  where: { [Op.and]:[{job_id: e.id},{print_cover_operator_id : operator_id}] },
                  // include: [
                  //   {
                  //     model: print_cover_status,
                  //     as: "print_cover_status",
                  //     attributes: ["status"],
                  //   },
                  //   {
                  //     model: print_cover_colors,
                  //     as: "print_cover_color",
                  //     attributes: ["print_cover_color"],
                  //   },
                  // ],
                  raw: true,
                  // attributes: { exclude: ["createdAt", "updatedAt"] },
                  attributes : ['id']
                });

                e.print_cover = print_cover_data;



                 //Fetching print_pages datas from print_pages table
  
                 let print_pages_data = await print_pages.findOne({
                  where: { [Op.and]:[{job_id: e.id},{job_print_operator_id : operator_id}] },
                  // include: [
                  //   {
                  //     model: print_pages_colors,
                  //     as: "print_pages_color",
                  //     attributes: ["job_print_color"],
                  //   },
                  // ],
                  raw: true,
                  // attributes: { exclude: ["createdAt", "updatedAt"] },
                  attributes : ['id']
                });

                e.print_pages = print_pages_data;
  



                return e;

              }}));
            


            
          resolve({
            status: 200,
            data: Jobs_data,
            message: "User jobs fetched successfully",
            meta: {
              count,
              totalPages,
              currentPage: page,
              pageSize,
            },
          });








      
          }else {
            const job_details = await jobsModel.findAll({
              where : {id: { [Op.in]: mergedArray }},
              attributes: [
                "id",
                "job_title",
                "requested_delivery_date",
                "job_status_id",
                "job_requested_on",
                "job_completed_on",
              ],
              offset,
              limit: pageSize,
              order: [["id", "DESC"]],
              raw: true,
            });

            console.log("Job details : ", job_details);



            
            let Jobs_data = await Promise.all(job_details.map(async (e) => {

            

              if (e.job_status_id == 4) {
                e.job_status = "";
              } else {
                //Fetching job_status from job_status table
                let job_status_data = await jobStatusModel.findOne({
                  where: { id: e.job_status_id },
                  attributes: ["id", "status"],
                });

                // jobsData.job_status_id = job_status_data.id;
                // console.log("job_status_data : ",job_status_data);

                if (job_status_data == null) {
                  e.status = "Nothing found";
                } else {
                  e.status = job_status_data.status;
                }

                delete e.job_status_id;



                //Finishing and binding data
                let finishing_and_binding_data =
                await finishing_and_bindings.findOne({
                  where: { [Op.and] : [{job_id: e.id },{binding_operator_id : operator_id}]},
                  // include: [
                  //   {
                  //     model: binding_types,
                  //     as: "binding_type",
                  //     attributes: ["binding_type"],
                  //   },
                  //   {
                  //     model: binding_status,
                  //     as: "binding_status",
                  //     attributes: ["status"],
                  //   },
                  // ],
                  raw: true,
                  // attributes: { exclude: ["createdAt", "updatedAt"] },
                  attributes : ['id']
                });
                e.finishingAndBinding = finishing_and_binding_data;


                //Fetching print_cover datas
                let print_cover_data = await printCoverModel.findOne({
                  where: { [Op.and]:[{job_id: e.id},{print_cover_operator_id : operator_id}] },
                  // include: [
                  //   {
                  //     model: print_cover_status,
                  //     as: "print_cover_status",
                  //     attributes: ["status"],
                  //   },
                  //   {
                  //     model: print_cover_colors,
                  //     as: "print_cover_color",
                  //     attributes: ["print_cover_color"],
                  //   },
                  // ],
                  raw: true,
                  // attributes: { exclude: ["createdAt", "updatedAt"] },
                  attributes : ['id']
                });

                e.print_cover = print_cover_data;



                 //Fetching print_pages datas from print_pages table
  
                 let print_pages_data = await print_pages.findOne({
                  where: { [Op.and]:[{job_id: e.id},{job_print_operator_id : operator_id}] },
                  // include: [
                  //   {
                  //     model: print_pages_colors,
                  //     as: "print_pages_color",
                  //     attributes: ["job_print_color"],
                  //   },
                  // ],
                  raw: true,
                  // attributes: { exclude: ["createdAt", "updatedAt"] },
                  attributes : ['id']
                });

                e.print_pages = print_pages_data;
  



                return e;

              }}));


            
          resolve({
            status: 200,
            data: Jobs_data,
            message: "User jobs fetched successfully",
            meta: {
              count,
              totalPages,
              currentPage: page,
              pageSize,
            },
          });

          }

    
// console.log("Where : ",whereClause);

      



          console.log("Total jobs : ", mergedArray.length);
          // operator_jobs.push({total_jobs : mergedArray.length, operator_id : operator_id,meta: {
          //   count,
          //   totalPages,
          //   currentPage: page,
          //   pageSize,
          // }});
          // console.log("Operator_id : ", operator_id);
          // operator_jobs.unshift({operator_id : operator_id});


        }else {
          reject({"status" : 404, "message" : "User not an operator"});

        }
    
      }else {

        reject({"status" : 404, "message" : "No profile found"});
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






exports.fetchSingleOperatorJobDetails = async function(token,job_id) {

  return new Promise(async (resolve, reject) =>{

    try {
      
      const decoded = jwt.decode(token);

      console.log("Token : " , token);
      console.log("User_id : ", decoded.user_id);

      const user = await usersModel.findOne({where : {id : decoded.user_id}});

      let operator_id = user.getDataValue("operator_id");
      console.log("operator_id : ", operator_id);


      
      
      // if(user) {

      // const offset = (page - 1) * pageSize;

      const job_details = await jobsModel.findOne({where : {id : job_id} ,attributes : ['id','job_id','job_title','requested_by_id','requested_by_entity_id','requested_by_department_id','requested_by_section_id','job_type_id','job_req_comment','document_type_id','document_name','document_mode_id','requested_delivery_date','job_req_for','job_status_id','confidentiality','require_sample','require_edits','delivery_mode_id','deliver_to_id','deliver_to_entity_id','deliver_to_department_id','deliver_to_section_id','deliver_to_location','require_cover','require_finishing_and_binding','job_requested_on','job_completed_on']});

      // const totalPages = Math.ceil(count / pageSize);

        // let data = await Promise.all(rows.map(async(e) => { 
          let jobsData = {};
          jobsData.id = job_details.id;
          jobsData.job_id = job_details.job_id;
          jobsData.job_title = job_details.job_title;

          // console.log("Jobs_data befor fetching requested client profile : ", jobsData);
          //Fetching client details from request_profiles table
          let requested_client_profile = await clientsModel.findOne({where : {id : job_details.requested_by_id},include : [{model : departmentsModel, as : "department", attributes : ['department']},{model : campusModel, as : "campus",attributes : ['campus']},{model : sectionsModel, as : "section", attributes : ['section']}],raw:true, attributes: { exclude: ["createdAt", "updatedAt"] }});
          if(requested_client_profile == null) {

            jobsData.requested_client = "No client found";
          }else {

            // let requested_client_details = {};
            // requested_client_details.id = requested_client_profile.id;
            // requested_client_details.name = requested_client_profile.name;
            // requested_client_details.email = requested_client_profile.email;
            // requested_client_details.contact_no = requested_client_profile.contact_no;
            jobsData.requested_client = requested_client_profile;

          }

          
          //No entities to fetch

          //Fetcing requested client department from departments table

          if(job_details.requested_by_department_id == 0) {

            jobsData.requested_by_department = "No department found";

          }else {

            let department_data = await departmentsModel.findOne({where : {id : job_details.requested_by_department_id}, attributes : ['department']});
            // console.log("Department_data : ", department_data);
            if(department_data == null) {
              jobsData.requested_by_department = "Nothing found";
            }else {
  
              jobsData.requested_by_department = department_data.department;
  
            }
          }


          if(job_details.requested_by_section_id == 0) {

            jobsData.requested_by_section = "No section found";
            
          }else {


            
                       //Fetching requested client section from sections table
            
                         let section_data = await sectionsModel.findOne({where : {id : job_details.requested_by_section_id}, attributes : ['section']});
                        //  console.log("Section_data : ", section_data);
            
                         if(section_data == null) {
                          jobsData.requested_by_section = "Nothing found";
                         }else {
            
                           jobsData.requested_by_section = section_data.section;
                         }
          }
  




           //Fetching job type from job types table
           let job_types_data = await jobTypesModel.findOne({where : {id : job_details.job_type_id}, attributes : ["id",'job_type']});
           jobsData.job_type_id = job_types_data.id;
          //  console.log("job_types_data : ",job_types_data);
           if(job_types_data == null) {
            jobsData.job_type = "Nothing found"
           }
           jobsData.job_type = job_types_data.job_type;

           
           jobsData.job_req_comment = job_details.job_req_comment;

           //Fetching document type from document types table
           let document_types_data = await documentTypesModel.findOne({where : {id : job_details.document_type_id}, attributes : ['document_type']});
          //  console.log("document_types_data : ",document_types_data);

           if(document_types_data == null) {
            jobsData.document_type = "Nothing found";
           }else {

             jobsData.document_type = document_types_data.document_type;
           }




           jobsData.document_name = job_details.document_name;



           if(job_details.document_mode_id == 1) {
            jobsData.document_mode = "";
           }else {

             //Fetching document modes form document_modes table
             let document_modes_data = await documentModesModel.findOne({where : {id : e.document_mode_id}, attributes : ['document_mode']});
            //  console.log("document_modes_data : ",document_modes_data);
  
             if(document_modes_data == null) {
  
              jobsData.document_mode = "Nothing found";
  
             }else {
  
               jobsData.document_mode = document_modes_data.document_mode;
  
             }
           }



            jobsData.requested_delivery_date = job_details.requested_delivery_date;


            jobsData.job_req_for = job_details.job_req_for;


            if(job_details.job_status_id == 4) {

              jobsData.job_status = "";

            }else {

              
                        //Fetching job_status from job_status table
                          let job_status_data = await jobStatusModel.findOne({where : {id : job_details.job_status_id}, attributes :["id",'status']});

                          jobsData.job_status_id = job_status_data.id;
                          // console.log("job_status_data : ",job_status_data);
              
                          if(job_status_data == null) {
              
                            jobsData.status = "Nothing found";
                          }else {
              
                            jobsData.status = job_status_data.status;
              
                          }
            }


          jobsData.confidentiality = job_details.confidentiality;

          // '','','','','deliver_to_entity_id','','','','','','',''

          jobsData.require_sample = job_details.require_sample;

          jobsData.require_edits = job_details.require_edits;



          if(job_details.delivery_mode_id == 8) {
            jobsData.delivery_mode = "";
          }else {

            //Fetching delivery modes from delivery_modes table
            let deliver_modes_data = await deliveryModesModel.findOne({where : {id : job_details.delivery_mode_id}, attributes : ['id','delivery_mode']});
            jobsData.delivery_mode_id = deliver_modes_data.id;
            // console.log("deliver_modes_data : ",deliver_modes_data);
  
            if(deliver_modes_data == null) {
  
              jobsData.delivery_mode = 'Nothing found';
            }else {
              
              jobsData.delivery_mode = deliver_modes_data.delivery_mode;
            }
          }



          //Fetching client details for delivery from request_profiles table
           //Fetching client details from request_profiles table
           let deliver_to_client_profile = await clientsModel.findOne({where : {id : job_details.deliver_to_id},include : [{model : departmentsModel, as : "department", attributes : ["id",'department']},{model : campusModel, as : "campus",attributes : ["id",'campus']},{model : sectionsModel, as : "section", attributes : ["id",'section']}],raw:true, attributes: { exclude: ["createdAt", "updatedAt"] }});
           if(deliver_to_client_profile == null) {
 
             jobsData.deliver_to_client = "No client found";
           }else {
 
             // let requested_client_details = {};
             // requested_client_details.id = requested_client_profile.id;
             // requested_client_details.name = requested_client_profile.name;
             // requested_client_details.email = requested_client_profile.email;
             // requested_client_details.contact_no = requested_client_profile.contact_no;
             jobsData.deliver_to_client = deliver_to_client_profile;
 
           }


          //Fetching department for delivery
          if(job_details.deliver_to_department_id == 32) {
            jobsData.deliver_to_department = "";
          }else if(job_details.deliver_to_department_id == 15) {
            jobsData.deliver_to_department = "English";
          }else {

            let deliver_to_department = await departmentsModel.findOne({where : {id :job_details.deliver_to_department_id }, attributes : ['department']});
            // console.log("deliver_to_department : ",deliver_to_department);
  
            if(deliver_to_department == null) {
  
              jobsData.deliver_to_department = "Nothing found";
            }else {
  
              jobsData.deliver_to_department = deliver_to_department.department;
  
            }
          }


          //Fetching section for delivery

          if(job_details.deliver_to_section_id == 0) {

            jobsData.deliver_to_section = "No section found";

          }else if (job_details.deliver_to_section_id == 18) {
            jobsData.deliver_to_section = "Principal Personal Assisstent";
          }else {

            let deliver_to_section = await sectionsModel.findOne({where : {id : job_details.deliver_to_section_id},attributes : ['section']});
            // console.log("deliver_to_section : ",deliver_to_section);
  
            if(deliver_to_section == null) {
              jobsData.deliver_to_section = "Nothing found";
            }else {
  
              jobsData.deliver_to_section = deliver_to_section.section;
  
            }
          }


          jobsData.deliver_to_location = job_details.deliver_to_location;
          jobsData.require_cover = job_details.require_cover;
          jobsData.require_finishing_and_binding = job_details.require_finishing_and_binding;
          jobsData.job_requested_on = job_details.job_requested_on;
          jobsData.job_completed_on = job_details.job_completed_on;

          // console.log(`Job_id : ${e.id} and jobsData : ${jobsData}`);

          // console.log("Job_id : ",e.id,"   Jobs data after fetching request client profile : ", jobsData);


          //Fetching finishing and binding datas
          // let require_finishing_and_binding

          let finishing_and_binding_data = await finishing_and_bindings.findOne(
            {
              where: { [Op.and] : [{job_id: job_details.id },{binding_operator_id : operator_id}]},
              include: [
                {
                  model: binding_types,
                  as: "binding_type",
                  attributes: ["binding_type"],
                },
                {
                  model: binding_status,
                  as: "binding_status",
                  attributes: ["status"],
                },
              ],
              raw: true,
              attributes: { exclude: ["createdAt", "updatedAt"] },
            }
          );

          // console.log("Binding operator_id : ", finishing_and_binding_data.getDataValue('binding_operator_id') );
          
          //Getting corresponding data values for id fields
          if(finishing_and_binding_data !== null) {
            console.log("Finishing and binding data : ", finishing_and_binding_data);
            console.log("Binding_operator_id : ", finishing_and_binding_data.binding_operator_id);

            //Fetching operator of finishing and binding table
            let operator = (await opetatorsModel.findOne({where : {id : finishing_and_binding_data.binding_operator_id}, attributes : ['operator_name']}));
            let operator_value;
            if(operator !== null) {
              operator_value = operator.getDataValue('operator_name');
            }else {
              operator_value = null;
            }
            finishing_and_binding_data.binding_operator = operator_value;

            //Fetching material from materials table by id from finishing and binding table
            let material = (await materialsModel.findOne({where : {id : finishing_and_binding_data.material_id},attributes : ['name']}));
            let material_value;
            if(material !== null) {
              material_value = material.getDataValue('name');
            }else {
              material_value = null;
            }
            finishing_and_binding_data.binding_material = material_value;


          }

          jobsData.finishingAndBinding = finishing_and_binding_data;


          //Fetching print_cover datas
          let print_cover_data = await printCoverModel.findOne({ where: { [Op.and]:[{job_id: job_details.id},{print_cover_operator_id : operator_id}] },include : [{model : print_cover_status, as : 'print_cover_status', attributes : ['status'],},{model : print_cover_colors, as : "print_cover_color", attributes : ['print_cover_color']}],raw : true, attributes: { exclude: ["createdAt", "updatedAt"] },});

          if(print_cover_data !== null) {

            //Fetching operator details from id saved in print cover table
            if(print_cover_data.print_cover_operator_id !== '') {

              let printCoverOperatorId = Number(print_cover_data.print_cover_operator_id);

              console.log("printCoverOperatorId : ", printCoverOperatorId);
              console.log("Type of (printCoverOperatorId) : ", typeof(printCoverOperatorId));

              let operator = (await opetatorsModel.findOne({where : {id : printCoverOperatorId}, attributes : ['operator_name']}));
              if(operator !== null) {

                let operator_value = operator.getDataValue('operator_name');
                print_cover_data.print_cover_operator = operator_value;   
              }else {
                print_cover_data.print_cover_operator = null;
              }
            }else {
              print_cover_data.print_cover_operator = "No operator found (id blank)";
            }
  
            //Fetching materials details from id saved in print cover table
            if(print_cover_data.print_cover_material_id !== ''){
              let printCoverMaterialId = Number(print_cover_data.print_cover_material_id);

              console.log("printCoverMaterialId : ", printCoverMaterialId);
              console.log("Type of (printCoverMaterialId) : ", typeof(printCoverMaterialId));


              let material = (await materialsModel.findOne({where : {id : printCoverMaterialId},attributes : ['name']}));
              if(material !== null) {

                let material_value = material.getDataValue('name');
                print_cover_data.print_cover_material = material_value;  
              }else {
                print_cover_data.print_cover_material = null;
              }
            }else {
              print_cover_data.print_cover_material = "No material found (id blank)";
            }



            //Fetching print_cover_machine details from printers table

            // console.log("print_cover_data.print_cover_machine_id : ", print_cover_data.print_cover_machine_id);

            if(print_cover_data.print_cover_machine_id !== ''){


              console.log("print_cover_data.print_cover_machine_id : ", print_cover_data.print_cover_machine_id);

              let printCoverMachineId = print_cover_data.print_cover_machine_id;


              if(isNaN(printCoverMachineId)) {

                 printCoverMachineId = Number(print_cover_data.print_cover_machine_id);
              }else {

                 printCoverMachineId = print_cover_data.print_cover_machine_id;


              }

              console.log("printCoverMachineId : ", printCoverMachineId);
              console.log("Type of (printCoverMachineId) : ", typeof(printCoverMachineId));


              let machine = (await printers.findOne({where : {id : printCoverMachineId},attributes : ['name']}));
              if(machine !== null) {

                let machine_value = machine.getDataValue('name');
                print_cover_data.print_cover_machine = machine_value;  
              }else {
                print_cover_data.print_cover_machine = null;
              }
            }else {
              print_cover_data.print_cover_machine = "No machines found (id blank)";
            }
          }

          //Fetching print_cover_sides data from print cover sides table
        //   if(print_cover_data.print_cover_sides !== ''){


        //     console.log("print_cover_data.print_cover_machine_id : ", print_cover_data.print_cover_machine_id);

        //     let printCoverMachineId = print_cover_data.print_cover_machine_id;


        //     if(isNaN(printCoverMachineId)) {

        //        printCoverMachineId = Number(print_cover_data.print_cover_machine_id);
        //     }else {

        //        printCoverMachineId = print_cover_data.print_cover_machine_id;


        //     }

        //     console.log("printCoverMachineId : ", printCoverMachineId);
        //     console.log("Type of (printCoverMachineId) : ", typeof(printCoverMachineId));


        //     let machine = (await printers.findOne({where : {id : printCoverMachineId},attributes : ['name']}));
        //     if(machine !== null) {

        //       let machine_value = machine.getDataValue('name');
        //       print_cover_data.print_cover_machine = machine_value;  
        //     }else {
        //       print_cover_data.print_cover_machine = null;
        //     }
        //   }else {
        //     print_cover_data.print_cover_machine = "No machines found (id blank)";
        //   }
        // }

          
          jobsData.print_cover = print_cover_data;



          //Fetching print_pages datas from print_pages table

          let print_pages_data = await print_pages.findOne({where: { [Op.and]:[{job_id: job_details.id},{job_print_operator_id : operator_id}] },include : [{model : print_pages_colors, as : "print_pages_color", attributes:['job_print_color']}],raw : true, attributes: { exclude: ["createdAt", "updatedAt"] },});

          if(print_pages_data !== null) {


            
                      //Fetching print_pages machine details from printers table
            
                      if(print_pages_data.print_pages_machine !== '' && print_pages_data.print_pages_machine !== 0){
                        let printPagesMachineId = Number(print_pages_data.print_pages_machine);
            
                        console.log("printPagesMachineId : ", printPagesMachineId);
                        console.log("Type of (printPagesMachineId) : ", typeof(printPagesMachineId));
            
            
                        let machine = (await printers.findOne({where : {id : printPagesMachineId},attributes : ['name']}));
                        if(machine !== null) {
            
                          let machine_value = machine.getDataValue('name');
                          print_pages_data.print_pages_printer_machine = machine_value;  
                        }else {
                          print_pages_data.print_pages_printer_machine = null;
                        }
                      }else {
                        print_pages_data.print_pages_printer_machine = "No machine found (id blank or 0)";
                      }

                      //Fetching print_pages operator details from operators table

                      if(print_pages_data.job_print_operator_id !== '' && print_pages_data.job_print_operator_id !== 0){
                        let printPagesOperatorId = Number(print_pages_data.job_print_operator_id);
            
                        console.log("printPagesOperatorId : ", printPagesOperatorId);
                        console.log("Type of (printPagesOperatorId) : ", typeof(printPagesOperatorId));
            
            
                        let operator = (await opetatorsModel.findOne({where : {id : printPagesOperatorId},attributes : ['operator_name']}));
                        if(operator !== null) {
            
                          let operator_value = operator.getDataValue('operator_name');
                          print_pages_data.print_pages_operator = operator_value;  
                        }else {
                          print_pages_data.print_pages_operator = null;
                        }
                      }else {
                        print_pages_data.print_pages_operator = "No operator found (id blank or 0)";
                      }

                      //Fetching print_pages paper_type details from papers table

                      if(print_pages_data.paper_type_id !== '' && print_pages_data.paper_type_id !== 0){
                        let printPagesPaperTypeId = Number(print_pages_data.paper_type_id);
            
                        console.log("printPagesPaperTypeId : ", printPagesPaperTypeId);
                        console.log("Type of (printPagesPaperTypeId) : ", typeof(printPagesPaperTypeId));
            
            
                        let paper = (await papers.findOne({where : {id : printPagesPaperTypeId},attributes : ['paper_name']}));
                        if(paper !== null) {
            
                          let paper_value = paper.getDataValue('paper_name');
                          print_pages_data.print_pages_paper_type = paper_value;  
                        }else {
                          print_pages_data.print_pages_paper_type = null;
                        }
                      }else {
                        print_pages_data.print_pages_paper_type = "No paper type found (id blank or 0)";
                      }
          }



          jobsData.print_pages = print_pages_data;


          console.log("jobsData : ", jobsData);
        
        // }));

        // console.log("data : ", data);

        resolve({"status" : 200, "data" : jobsData, "message" : "Job profiles fetched successfully"});

      // }else {

      //   reject({"status" : 400, "message" : "Requested user not found"});
      // }

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









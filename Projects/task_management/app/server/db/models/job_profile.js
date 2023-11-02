const {Sequelize} = require('sequelize');

const sequelize = require('../db-conn');

const print_cover = require('./print_cover');
const users = require('./users');


const job_profile =  sequelize.define("job_profile",{

id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    dev_flag : {
        //Flag for testing and development
        type : Sequelize.BOOLEAN,
    },

    job_id : {
        //jobID
        type : Sequelize.INTEGER,
        allowNull : false,
        defaultValue : '0',
    },
    
    job_title : {
        //jobTitle
        type: Sequelize.STRING,
        allowNull : false,
        // unique : true,
        // defaultValue : '',
    },

    requested_by_id : {
        //jobReqBy {Replace with id}
        //from requestprofile table
        type: Sequelize.INTEGER,
        allowNull : false,
        defaultValue : '0',
    },

    requested_by_entity_id : {
        //From entities table
        type : Sequelize.INTEGER,
        allowNull : false,
        defaultValue : 0,
    },

    requested_by_department_id : {
        //From departments table
        type : Sequelize.INTEGER,
        allowNull : false,
        defaultValue : 0,
    },

    requested_by_section_id : {
        // From sections table
        type : Sequelize.INTEGER,
        allowNull : false,
        defaultValue : 0,
    },

    // requested_service_id : {
    //     //from services table
    //     type : Sequelize.INTEGER,
    //     // allowNull : false,
    // },

    job_type_id : {
        //jobType {Replace with id from job_types table}
        //From job_types table
        type : Sequelize.INTEGER,
        allowNull : false,
    },

    job_req_comment : {
        //jobReqComment
        type : Sequelize.TEXT,
        allowNull : false,
        // defaultValue : '',
    },

    document_type_id : {
        //jobDocType {Replace with id}
        //From document_types table
        type : Sequelize.INTEGER,
        allowNull : false,
        // defaultValue : '0',
    },

    document_name : {
        //jobDocName
        type : Sequelize.STRING,
        allowNull : false,
        // defaultValue : '',
    },

    
    document_mode_id : {
        //From document_modes table
        //jobDocMode
        type : Sequelize.INTEGER,
        allowNull : false,
        // defaultValue : '0',
    },

    
    requested_delivery_date : {
        //jobReqDeliveryDate
        type : Sequelize.STRING,
        allowNull : false,
        // defaultValue : sequelize.literal('0'),
    },

    job_req_for : {
        //jobReqFor
        type : Sequelize.INTEGER,
        allowNull : false,
        defaultValue : '0',
    },

    job_status_id : {
        //jobStatus
        //From job_statuses table
    type : Sequelize.INTEGER,
    allowNull : false,
    // defaultValue : '0',
    },

    confidentiality : {
        //jobConfidential {0,1}
    type : Sequelize.BOOLEAN,
    allowNull : false,
    // defaultValue : '0',
    },


    require_sample : {
        //jobReqSample {0,1}
    type : Sequelize.BOOLEAN,
    allowNull : false,
    // defaultValue : '0',
    },


    require_edits : {
        //jobReqEdit {0,1}
    type : Sequelize.BOOLEAN,
    allowNull : false,
    // defaultValue : '0',
    } ,


    delivery_mode_id : {
        //jobDeliveryMode {Replace with id}
        //From delivery_modes table
    type : Sequelize.INTEGER,
    allowNull : false,
    // defaultValue : '0',
    },


    deliver_to_id : {
        //jobDeliverTo
        //From requestprofile table
    type : Sequelize.INTEGER,
    allowNull : false,
    // defaultValue : '0',
    },


    deliver_to_entity_id : { 
    type : Sequelize.INTEGER,
    allowNull : false,
    defaultValue : '0',
    },


    // deliver_to_school : {
    // type : Sequelize.STRING,
    // // allowNull : false,
    // },


    deliver_to_department_id : {
        //jobDelDepartment {Replace with id from departments table}
        //from departments table
    type : Sequelize.INTEGER,
    allowNull : false,
    // defaultValue : '0',
    },


    deliver_to_section_id : {
        //from sections table
    type : Sequelize.INTEGER,
    allowNull : false,
    defaultValue : '0',
    },


    deliver_to_location : {
        //jobDelLocation
    type : Sequelize.STRING,
    allowNull : false,
    defaultValue : '',
    },

    require_cover : {
        //jobReqCover {0,1}
        type : Sequelize.BOOLEAN,
        allowNull : false,
        // defaultValue : '0',
    },

    require_finishing_and_binding : {
        //jobReqBinding {0,1}
        type : Sequelize.BOOLEAN,
        allowNull : false,
        // defaultValue : '0',
    },

    job_requested_on : {
        //jobReqDate
    type : Sequelize.STRING,
    allowNull : false,
    // defaultValue : sequelize.literal('0'),
    },

    job_completed_on : {
        //jobDoneDate
    type : Sequelize.STRING,
    allowNull : false,
    // defaultValue : sequelize.literal('0'),
    defaultValue : '0000-00-00 00:00:00',
    },

},
{
    paranoid : true,
},
// {
//     indexes: [
//       {
//         unique: true,
//         fields: ['job_title']
//       }
//     ]}
  );


  // Add the unique constraint to the existing table
// users.sync().then(() => {
//     return sequelize.query('ALTER TABLE users ADD UNIQUE INDEX unique_job_title (job_title)')
//   })
//   .then(() => {
//     console.log('Unique constraint added successfully');
//   })
//   .catch((err) => {
//     console.error('Error adding unique constraint', err);
//   });


// job_profile.hasMany(print_cover, { foreignKey: 'job_id' });

// print_cover.belongsTo(job_profile, { foreignKey: 'job_id' });

 job_profile.sync({ alter: true });

module.exports = job_profile



// const mongoose = require("mongoose");
// const mongoose_delete = require("mongoose-delete");

// const organizationSchema = new mongoose.Schema(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
//     name: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//       required: true,
//     },
//     contact_no: {
//       type: String,
//       required: true,
//     },
//     address: {
//       street: {
//         type: String,
//         required: true,
//       },
//       city: {
//         type: String,
//         required: true,
//       },
//       state: {
//         type: String,
//         required: true,
//       },
//       country: {
//         type: String,
//         required: true,
//       },
//       zipCode: {
//         type: String,
//         required: true,
//       },
//     },
//     website: {
//       type: String,
//       required: true,
//     },
//     founded_year: {
//       type: Number,
//       required: true,
//     },
//     industry: {
//       type: String,
//       required: true,
//     },

//     external_services : [{
//       service_id : {
//         type : mongoose.Schema.Types.ObjectId,
//         ref : "external_services"
//       },
//       status : String,
//     }],

//     zoho_client_id: String,
//     zoho_client_secret: String,
//     zoho_authorization_code: String,
//     zoho_redirect_uri: String,
//     zoho_zoid: String,
//     zoho_refresh_token: String,
//   },
//   {
//     timestamps: true,
//   }
// );

// // Defining the composite key index
// // organizationSchema.index(
// //   { name: 1, street: 1, city: 1, country: 1 },
// //   { unique: true }
// // );

// organizationSchema.plugin(
//   mongoose_delete,
//   { deletedAt: true },
//   { use$neOperator: false }
// );

// module.exports = mongoose.model("organizations", organizationSchema);


const mongoose = require("mongoose");
const mongoose_delete = require('mongoose-delete');

const organizationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    contact_no: {
      type: String,
      required: true,
    },
    address: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      zipCode: {
        type: String,
        required: true,
      },
    },
    website: {
      type: String,
      required: true,
    },
    founded_year: {
      type: Number,
      required: true,
    },
    industry: {
      type: String,
      required: true,
    },

    // external_services: [
    //   {
    //       type: mongoose.Schema.Types.ObjectId,
    //       ref: "external_services",
    //   },
    // ],

    external_services : [{
      service_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "external_services"
      },
      client_id : String,
      client_secret : String,
      authorization_code : String,
      redirect_uri : String,
      redirect_uri_zoid : String,
      redirect_uri_account : String
    }],
    zoho_zoid : String,
    zoho_account_refresh_token : String
  },
  {
    timestamps: true,
  }
);


// Defining the composite key index
// organizationSchema.index(
//   { name: 1, street: 1, city: 1, country: 1 },
//   { unique: true }
// );

organizationSchema.plugin(mongoose_delete, { deletedAt : true },{use$neOperator: false});

module.exports = mongoose.model("organizations", organizationSchema);



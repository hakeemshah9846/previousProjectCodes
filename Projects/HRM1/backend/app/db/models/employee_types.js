const mongoose = require("mongoose");
const mongoose_delete = require('mongoose-delete');

const employee_types = new mongoose.Schema(
  {
    organization : {type: mongoose.Schema.Types.ObjectId, ref: "organizations" },
    employee_type: "string",
  },
  {
    timestamps: true,
  }
);

employee_types.plugin(mongoose_delete, { deletedAt : true },{use$neOperator: false});

module.exports = mongoose.model("employee_types", employee_types);

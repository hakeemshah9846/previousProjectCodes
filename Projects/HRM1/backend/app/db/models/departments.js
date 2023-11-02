const mongoose = require("mongoose");
const mongoose_delete = require('mongoose-delete');

const departments = new mongoose.Schema(
  {
    organization : {type: mongoose.Schema.Types.ObjectId, ref: "organizations" },
    department: "string",
  },
  {
    timestamps: true,
  }
);

departments.plugin(mongoose_delete, { deletedAt : true },{use$neOperator: false});

module.exports = mongoose.model("departments", departments);

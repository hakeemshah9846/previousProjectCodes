const mongoose = require("mongoose");
const mongoose_delete = require('mongoose-delete');

const salary_template = new mongoose.Schema(
  {
    organization : {type: mongoose.Schema.Types.ObjectId, ref: "organizations" },
    salary_template: [{label : "string", percentage : "number"}],
    added_by : {type: mongoose.Schema.Types.ObjectId, ref: "users" },
    last_updated_by : {type: mongoose.Schema.Types.ObjectId, ref: "users" }
  },
  {
    timestamps: true,
  }
);

salary_template.plugin(mongoose_delete, { deletedAt : true },{use$neOperator: false});

module.exports = mongoose.model("salary_template", salary_template);


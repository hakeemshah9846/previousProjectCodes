const mongoose = require("mongoose");
const mongoose_delete = require('mongoose-delete');

const system_document_types = new mongoose.Schema(
  {
    document_type: "string",
  },
  {
    timestamps: true,
  }
);

system_document_types.plugin(mongoose_delete, { deletedAt : true },{use$neOperator: false});

module.exports = mongoose.model("system_document_types", system_document_types);

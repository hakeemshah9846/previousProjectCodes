const mongoose = require("mongoose");
const mongoose_delete = require('mongoose-delete');

const user_document_types = new mongoose.Schema(
  {
    organization : {type: mongoose.Schema.Types.ObjectId, ref: "organizations" },
    document_type: "string",
  },
  {
    timestamps: true,
  }
);

user_document_types.plugin(mongoose_delete, { deletedAt : true },{use$neOperator: false});

module.exports = mongoose.model("user_document_types", user_document_types);

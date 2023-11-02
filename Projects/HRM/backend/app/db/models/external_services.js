const mongoose = require("mongoose");
const mongoose_delete = require('mongoose-delete');

const external_services = new mongoose.Schema(
  {
    // organization : {type: mongoose.Schema.Types.ObjectId, ref: "organizations" },
    service: "string",
  },
  {
    timestamps: true,
  }
);

external_services.plugin(mongoose_delete, { deletedAt : true },{use$neOperator: false});

module.exports = mongoose.model("external_services", external_services);

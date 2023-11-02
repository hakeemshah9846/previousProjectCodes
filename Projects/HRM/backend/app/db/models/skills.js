const mongoose = require("mongoose");
const mongoose_delete = require('mongoose-delete');

const skills = new mongoose.Schema(
  {
    organization : {type: mongoose.Schema.Types.ObjectId, ref: "organizations" },
    skill: "string",
  },
  {
    timestamps: true,
  }
);

skills.plugin(mongoose_delete, { deletedAt : true },{use$neOperator: false});

module.exports = mongoose.model("skills", skills);

const mongoose = require("mongoose");

const salaryHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  salary: "number",
  addition: [{ label: "string", amount: "number", date: "string" }],
  deduction: [{ label: "string", amount: "number", date: "string" }],
  payment: [
    {
      paid_amount: "number",
      paid_date: "string",
    },
  ],
  salary_year: "number",
  salary_month: "number",
  organization: { type: mongoose.Schema.Types.ObjectId, ref: "organizations" }
});

module.exports = mongoose.model("salary_history", salaryHistorySchema);

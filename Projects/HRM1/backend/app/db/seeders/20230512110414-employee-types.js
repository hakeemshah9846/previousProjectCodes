"use strict";

module.exports = {
  up: (models, mongoose) => {
    // Add altering commands here.
    // Return a promise to correctly handle asynchronicity.

    // Example:
    return models.employee_types
      .insertMany([
        {
          _id: "645e1fcdb92bb17740482c2a",
          employee_type: "Permanent",
        },
        {
          id: "645e1fcdb92bb17740482c2b",
          employee_type: "on probation",
        },
        {
          _id: "645e1fcdb92bb17740482c2c",
          employee_type: "internship",
        },
        {
          _id: "645e1fcdb92bb17740482c2d",
          employee_type: "remote",
        },
        {
          _id: "645e1fcdb92bb17740482c2e",
          employee_type: "parttime",
        },
        {
          _id: "645e1fcdb92bb17740482c2f",
          employee_type: "notice period",
        },
        {
          _id: "645e1fcdb92bb17740482c30",
          employee_type: "inactive",
        },
        {
          _id: "645e1fcdb92bb17740482c31",
          employee_type: "terminated",
        },
        {
          _id: "645e1fcdb92bb17740482c32",
          employee_type: "resigned",
        },
        {
          _id: "645e1fcdb92bb17740482c33",
          employee_type: "onboarding",
        },
      ])
      .then((res) => {
        // Prints "1"
        console.log(res.insertedCount);
      });
  },

  down: (models, mongoose) => {
    // Add reverting commands here.
    // Return a promise to correctly handle asynchronicity.

    // Example:
    return models.employee_types
      .deleteMany({
        _id: {
          $in: [
            "645e1fcdb92bb17740482c2a",
            "645e1fcdb92bb17740482c2b",
            "645e1fcdb92bb17740482c2c",
            "645e1fcdb92bb17740482c2d",
            "645e1fcdb92bb17740482c2e",
            "645e1fcdb92bb17740482c2f",
            "645e1fcdb92bb17740482c30",
            "645e1fcdb92bb17740482c31",
            "645e1fcdb92bb17740482c32",
            "645e1fcdb92bb17740482c33",
          ],
        },
      })
      .then((res) => {
        // Prints "1"
        console.log(res.deletedCount);
      });
  },
};

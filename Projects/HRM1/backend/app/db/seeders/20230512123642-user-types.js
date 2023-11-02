"use strict";

module.exports = {
  up: (models, mongoose) => {
    // Add altering commands here.
    // Return a promise to correctly handle asynchronicity.

    // Example:
    return models.user_types
      .insertMany([
        {
          _id: "645e344f7483b6558146f843",
          user_type: "admin",
        },
        {
          _id: "645e34807483b6558146f844",
          user_type: "organization",
        },
        {
          _id: "645e348b7483b6558146f845",
          user_type: "manager",
        },
        {
          _id: "645e34977483b6558146f846",
          user_type: "employee",
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
    return models.user_types
      .deleteMany({
        _id: {
          $in: [
            "645e344f7483b6558146f843",
            "645e34807483b6558146f844",
            "645e348b7483b6558146f845",
            "645e34977483b6558146f846",
          ],
        },
      })
      .then((res) => {
        // Prints "1"
        console.log(res.deletedCount);
      });
  },
};

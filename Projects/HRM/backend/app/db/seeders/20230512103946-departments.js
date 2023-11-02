"use strict";

module.exports = {
  up: (models, mongoose) => {
    // Add altering commands here.
    // Return a promise to correctly handle asynchronicity.

    // Example:
    return models.departments
      .insertMany([
        {
          _id: "645e18097483b6558146f81e",
          department: "Development",
        },
        {
          _id: "645e182c7483b6558146f81f",
          department: "Operationals",
        },
        {
          _id: "645e183a7483b6558146f820",
          department: "Management",
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
    return models.departments
      .deleteMany({
        _id: {
          $in: [
            "645e18097483b6558146f81e",
            "645e182c7483b6558146f81f",
            "645e183a7483b6558146f820",
          ],
        },
      })
      .then((res) => {
        // Prints "1"
        console.log(res.deletedCount);
      });
  },
};

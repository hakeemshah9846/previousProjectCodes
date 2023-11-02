'use strict';

module.exports = {

  up: (models, mongoose) => {
    return models.system_document_types
      .insertMany([
        {
          _id: "64a7dba94a9127eeea8e083a",
          document_type: "Pay slip",
        },
        {
          _id: "64a7dbb74a9127eeea8e083b",
          document_type: "Relieving letter",
        },
        {
          _id: "64a7dbc04a9127eeea8e083c",
          document_type: "Experience letter",
        },
        {
          _id: "64a7dbcc4a9127eeea8e083d",
          document_type: "Form 16",
        },
        {
          _id: "64a7dbd84a9127eeea8e083e",
          document_type: "Salary certificate",
        },
  
      ])
      .then((res) => {
        // Prints "1"
        console.log(res.insertedCount);
      });
    
  },

  down: (models, mongoose) => {
    return models.system_document_types
      .deleteMany({
        _id: {
          $in: [
            "64a7dba94a9127eeea8e083a",
            "64a7dbb74a9127eeea8e083b",
            "64a7dbc04a9127eeea8e083c",
            "64a7dbcc4a9127eeea8e083d",
            "64a7dbd84a9127eeea8e083e",
          ],
        },
      })
      .then((res) => {
        // Prints "1"
        console.log(res.deletedCount);
      });
  }
};

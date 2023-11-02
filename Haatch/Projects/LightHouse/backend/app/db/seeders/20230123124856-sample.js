"use strict";

module.exports = {
  up: (models, mongoose) => {
    return (
      models.informations.create(
        {
          title: "sample",
          data: "assets/payment_platforms/sample/Оплата картой.pdf",
        },
      )
        .then((res) => {
          console.log(`Seeding Successful`);
        })
    );
  },

  down: (models, mongoose) => {
    return models.informations.deleteOne({title: "sample"}).then((res) => {
      console.log(`Rollback Successful`);
    });
  }
};

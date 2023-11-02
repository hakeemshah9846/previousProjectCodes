"use strict";

module.exports = {
  up: (models, mongoose) => {
    return (
      models.informations.create(
        {
          title: "privacy_policy",
          data: "assets/policies/Оплата картой.pdf",
        },
      )
        .then((res) => {
          console.log(`Seeding Successful`);
        })
    );
  },

  down: (models, mongoose) => {
    return models.informations.deleteOne({title: "privacy_policy"}).then((res) => {
      console.log(`Rollback Successful`);
    });
  }
};

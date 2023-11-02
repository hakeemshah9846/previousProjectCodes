"use strict";

module.exports = {
  up: (models, mongoose) => {
    return (
      models.user_levels.insertMany([
          {
            label: "Интендант 3 ранга",
            value: 5000,
          },
          {
            label: "Интендант 2 ранга",
            value: 10000,
          },
          {
            label: "Интендант 1 ранга",
            value: 20000,
          },
          {
            label: "Бригинтендант",
            value: 50000,
          },
          {
            label: "Дивинтендант",
            value: 100000,
          },
          {
            label: "Коринтендант",
            value: 200000,
          },
          {
            label: "Арминтендант",
            value: 500000,
          },
          {
            label: "Военный комиссар",
            value: 1000000,
          },
        ])
        .then((res) => {
          console.log(`Seeding Successful`);
        })
    );
  },

  down: (models, mongoose) => {
    return models.user_levels.deleteMany({}).then((res) => {
      console.log(`Rollback Successful`);
    });
  }
};

'use strict';

const { models } = require('mongoose');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    return models.organizations
    .insertMany([
      // {
      //   _id : "64997a93fae55e140da920ca",
      //   user : "64997a90fae55e140da920c7",
      //   name : "Haatch Interactive",
      //   email : "hi@haatch.in",
      //   contact_no : "0484 402 1155",
      //   address: {
      //     street: "Kunnumpuram",
      //     city: "Kakkanad",
      //     state:"Kerala",
      //     country: "India",
      //     zipCode: "682030",
      //   },
      //   website: "haatchinteractive.com/",
      //   founded_year: "2017",
      //   industry: "Information Technology"
      // },
      // {
      //   _id : "64997a93fae55e140da920ca",
      //   user : "64997a90fae55e140da920c7",
      //   name : "ABC Company",
      //   email : "abc@gmail.com",
      //   contact_no : "1234567890",
      //   address: {
      //     street: "New York",
      //     city: "New York",
      //     state:"Kerala",
      //     country: "India",
      //     zipCode: "682030",
      //   },
      //   website: "haatchinteractive.com/",
      //   founded_year: "2017",
      //   industry: "Information Technology"
      // }
    ])
  },

  async down (queryInterface, Sequelize) {
    return models.users
    .deleteMany({
      _id: {
        $in: [
          "64997a93fae55e140da920ca"
        ],
      },
    })
    .then((res) => {
      // Prints "1"
      console.log(res.deletedCount);
    });
  }
};

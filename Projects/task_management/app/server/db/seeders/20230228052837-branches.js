'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await queryInterface.bulkInsert(
      "branches",
      [
        {
          id: 1,
          branch: "Branch-1",
          createdAt : "2018-10-2",
          updatedAt : "2018-10-2"
        },
        {
          id: 2,
          branch: "Branch-2",
          createdAt : "2018-10-2",
          updatedAt : "2018-10-2"
        },
        {
          id: 3,
          branch: "Branch-3",
          createdAt : "2018-10-2",
          updatedAt : "2018-10-2"
        },
      ],
      {}
    );
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};

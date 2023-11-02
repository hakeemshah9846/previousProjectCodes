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
      "sections",
      [
        {
          id: 1,
          section: "Section-1",
          createdAt : "2018-10-2",
          updatedAt : "2018-10-2"
        },
        {
          id: 2,
          section: "Section-2",
          createdAt : "2018-10-2",
          updatedAt : "2018-10-2"
        },
        {
          id: 3,
          section: "Section-3",
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

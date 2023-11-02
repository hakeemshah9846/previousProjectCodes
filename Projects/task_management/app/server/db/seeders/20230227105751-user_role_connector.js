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
      "user_roles_connections",
      [
        {
          id : 1,
          user_id : 1,
          role_id : 1,
          createdAt : "2018-10-2",
          updatedAt : "2018-10-2"
          
        },
        {
          id : 2,
          user_id : 2,
          role_id : 2,
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

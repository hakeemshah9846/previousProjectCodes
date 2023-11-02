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
      "user_roles",
      [
        // {
        //   id : 1,
        //   role : "admin",
        //   createdAt : "2018-10-2",
        //   updatedAt : "2018-10-2"
          
        // },
        // {
        //   id : 2,
        //   role : "user",
        //   createdAt : "2018-10-2",
        //   updatedAt : "2018-10-2"
          
        // },

        {
          id : 3,
          role : "super_admin",
          createdAt : "2018-10-2",
          updatedAt : "2018-10-2"
          
        },

        {
          id : 4,
          role : "moderator",
          createdAt : "2018-10-2",
          updatedAt : "2018-10-2"
          
        },

        {
          id : 5,
          role : "editor",
          createdAt : "2018-10-2",
          updatedAt : "2018-10-2"
          
        },

        {
          id : 6,
          role : "guest",
          createdAt : "2018-10-2",
          updatedAt : "2018-10-2"
          
        },

        {
          id : 7,
          role : "support",
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

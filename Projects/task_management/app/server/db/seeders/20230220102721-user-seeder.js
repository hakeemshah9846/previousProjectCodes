"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
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
      "users",
      [
        {
          id : 1,
          first_name : 'James',
          last_name : 'Waters',
          email : 'james@gmail.com',
          image : "No Image",
          phone : '225-572-2376',
          department_id : 1,
          section_id : 1,
          branch_id : 1,
          password : '$2a$10$vKssVNL27gR1kGLHi56L7.zz0oYic4AoNfmFofsugpdzBjgS7OlIK', //Admin#123
          createdAt : "2018-10-2",
          updatedAt : "2018-10-2"
          
        },
        {
          id : 2,
          first_name : 'John',
          last_name : 'doe',
          email : 'johndoe@gmail.com',
          image : "No Image",
          phone : '225-572-2376',
          department_id : 2,
          section_id : 2,
          branch_id : 2,
          password : '$2a$10$9RMUt4Bv9gs.Sg/QD5phTuQKTay13TtmQ2ryvizJa3Eism4XDat5O', //Admin#1234
          createdAt : "2018-10-2",
          updatedAt : "2018-10-2"
          
        },
        {
          id : 3,
          first_name : 'Jane',
          last_name : 'Doe',
          email : 'janedoe@gmail.com',
          image : "No Image",
          phone : '225-572-2376',
          department_id : 3,
          section_id : 3,
          branch_id : 3,
          password : '$2a$10$dnzsYDbbIxxEJacxsIRUJOSZQiJ77/1jWpp6iH7pXUOkZVzOVktXC', //user1#123
          createdAt : "2018-10-2",
          updatedAt : "2018-10-2"
          
        },
        {
          id : 4,
          first_name : 'Mike',
          last_name : 'Walter',
          email : 'mikewalter@gmail.com',
          image : "No Image",
          phone : '225-572-2376',
          department_id : 4,
          section_id : 4,
          branch_id : 4,
          password : '$2a$10$0IsR2.h69rRJR0w.TY7ftOOguMfSmbs3uUfjHJzSE97IhpnOx3cnO', //user2#1234
          createdAt : "2018-10-2",
          updatedAt : "2018-10-2"
          
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};

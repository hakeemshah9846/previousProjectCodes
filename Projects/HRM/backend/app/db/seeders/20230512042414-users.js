"use strict";

module.exports = {
  up: (models, mongoose) => {
    // Add altering commands here.
    // Return a promise to correctly handle asynchronicity.
    //admin@haatch.in
    // Example:
    return models.users
      .insertMany([
        {
          _id: "645e3a777483b6558146f854",
          personel_details: {
            first_name: "John",
            last_name: "Doe",
            image: "uploads/users/user_image.jpg",
            gender: "Male",
            phone: "1234567890",
            personel_email: "john@gmail.com",
            emergency_contact: "1234567890",
            pan: "HC123",
            blood_group: "A+",
            dob: "25-10-1995",
          },

          official_details: {
 
            official_email: "johnofficial@gmail.com",

          },
          user_type : "645e34807483b6558146f844",
          organization : "649bd1298611e269447532ff",

          email: "johnofficial@gmail.com",
          password:
            "$2a$12$.27FyjJNZG1nv2zz9LBCweY4eryX.67NcqRp4wVW61P/FfQ2xCFgG", //Admin#123
          last_login: "12-05-2023",
          // password_token: "string",
          user_type: "645e344f7483b6558146f843",
        },

         

        // {
        //   _id: "645e3a777483b6558146f854",
        //   // organization : "64997a93fae55e140da920ca",
        //   personel_details: {
        //     first_name: "Vishnu",
        //     last_name: "P",
        //     // short_name: "Miky",
        //     image: "uploads/users/user_image.jpg",
        //     gender: "Male",
        //     phone: "1234567890",
        //     personel_email: "vishnu@gmail.com",
        //     emergency_contact: "9874563210",
        //     pan: "HC123",
        //     blood_group: "A+",
        //     dob: "25-10-1995",
        //   },

        //   email: "vishnuofficial@gmail.com",
        //   password:
        //     "$2a$12$.27FyjJNZG1nv2zz9LBCweY4eryX.67NcqRp4wVW61P/FfQ2xCFgG", //Admin#123
        //   last_login: "12-05-2023",
        //   // password_token: "string",
        //   user_type_id: "645e344f7483b6558146f843",
        // },


        // {
        //   _id: "645e3a987483b6558146f855",
        //   organization : "64997a93fae55e140da920ca",
        //   personel_details: {
        //     first_name: "James",
        //     last_name: "Doe",
        //     // short_name: "Michle",
        //     image: "uploads/users/user_image.jpg",
        //     gender: "Male",
        //     phone: "1234567890",
        //     personel_email: "james@gmail.com",
        //     emergency_contact: "9874563210",
        //     pan: "HC123",
        //     blood_group: "A+",
        //     dob: "15-12-1996",
        //   },

        //   contact_details: {
        //     current_address: {
        //       address: "2483 Boundary Street Jacksonville, FL 32202",
        //       country: "United States",
        //       state: "California",
        //       pincode: "32202",
        //     },

        //     permanent_address: {
        //       address: "2483 Boundary Street Jacksonville, FL 32202",
        //       country: "United States",
        //       state: "California",
        //       pincode: "32202",
        //     },
        //   },

        //   official_details: {
        //     employee_id: "1234",
        //     job_title: "Manager",
        //     department: "645e183a7483b6558146f820",
        //     employee_type: "645e1fcdb92bb17740482c2a",
        //     profile_status: "active",
        //     official_email: "jamesofficial@gmail.com",
        //     date_of_join: "2023-05-12",
        //     // profile_privacy: {
        //     //   private: false,
        //     //   public: true,
        //     // },
        //   },

        //   account_details: [
        //     {
        //       bank_name: "Goldman Sachs",
        //       account_no: "123456789",
        //       ifsc: "1234",
        //       branch_name: "New York",
        //       account_holder: "James Doe",
        //     },

        //     {
        //       bank_name: "JPMorgan Chase",
        //       account_no: "987456123",
        //       ifsc: "9874",
        //       branch_name: "New York",
        //       account_holder: "James Doe",
        //     },
        //   ],

        //   // salary: [
        //   //   {
        //   //     label: "Basic salary",
        //   //     value: "50000",
        //   //   },
        //   //   {
        //   //     label: "House rent allowance",
        //   //     value: "10000",
        //   //   },
        //   //   {
        //   //     label: "Conveyance",
        //   //     value: "5000",
        //   //   },
        //   //   {
        //   //     label: "Medical allowance",
        //   //     value: "5000",
        //   //   },
        //   // ],

        //   salary: "70000",

        //   skills: [
        //     "64817a0bb65a951b9d985444",
        //     "64817a28b65a951b9d985445",
        //     "64818789b65a951b9d985448",
        //     "648187a5b65a951b9d985449",
        //   ],

        //   email: "jamesofficial@gmail.com",
        //   password:
        //     "$2a$12$cxfuPWHObypHGtRzBm7QQeLpQK97jM4NgLrJTRzn8PGHG.JxdZfr2", //James#123
        //   last_login: "12-05-2023",
        //   // password_token: "string",
        //   user_type_id: "645e34807483b6558146f844",
        // },

        // {
        //   _id: "645e3aab7483b6558146f856",
        //   organization : "64997a93fae55e140da920ca",
        //   personel_details: {
        //     first_name: "Jane",
        //     last_name: "Doe",
        //     // short_name: "Rocky",
        //     image: "uploads/users/user_image.jpg",
        //     gender: "Male",
        //     phone: "1234567890",
        //     personel_email: "jane@gmail.com",
        //     emergency_contact: "9874563210",
        //     pan: "HC123",
        //     blood_group: "A+",
        //     dob: "15-8-2000",
        //   },

        //   contact_details: {
        //     current_address: {
        //       address: "2483 Boundary Street Jacksonville, FL 32202",
        //       country: "United States",
        //       state: "California",
        //       pincode: "32202",
        //     },

        //     permanent_address: {
        //       address: "2483 Boundary Street Jacksonville, FL 32202",
        //       country: "United States",
        //       state: "California",
        //       pincode: "32202",
        //     },
        //   },

        //   official_details: {
        //     employee_id: "1234",
        //     job_title: "Admin",
        //     department: "645e182c7483b6558146f81f",
        //     employee_type: "645e1fcdb92bb17740482c2d",
        //     profile_status: "active",
        //     official_email: "janeofficial@gmail.com",
        //     date_of_join: "2023-05-12",
        //     // profile_privacy: {
        //     //   private: false,
        //     //   public: true,
        //     // },
        //   },

        //   account_details: [
        //     {
        //       bank_name: "Goldman Sachs",
        //       account_no: "123456789",
        //       ifsc: "1234",
        //       branch_name: "New York",
        //       account_holder: "Jane Doe",
        //     },

        //     {
        //       bank_name: "JPMorgan Chase",
        //       account_no: "987456123",
        //       ifsc: "9874",
        //       branch_name: "New York",
        //       account_holder: "Jane Doe",
        //     },
        //   ],

        //   // salary: [
        //   //   {
        //   //     label: "Basic salary",
        //   //     value: "50000",
        //   //   },
        //   //   {
        //   //     label: "House rent allowance",
        //   //     value: "10000",
        //   //   },
        //   //   {
        //   //     label: "Conveyance",
        //   //     value: "5000",
        //   //   },
        //   //   {
        //   //     label: "Medical allowance",
        //   //     value: "5000",
        //   //   },
        //   // ],

        //   salary: "70000",

        //   skills: [
        //     "64817a0bb65a951b9d985444",
        //     "64817a28b65a951b9d985445",
        //     "64818789b65a951b9d985448",
        //     "648187a5b65a951b9d985449",
        //   ],

        //   email: "janeofficial@gmail.com",
        //   password:
        //     "$2a$12$HjMPUI45OAyePe/sw8Jt7ebM7cekQoSULQpik1sqrKnXYCDorQO9S", //Jane#123
        //   last_login: "12-05-2023",
        //   // password_token: "string",
        //   user_type_id: "645e348b7483b6558146f845",
        // },


        // //Adding new user
        // {
        //   _id: "649abd3858ba9e7f0682b171",
        //   organization : "64997a93fae55e140da920ca",
        //   personel_details: {
        //     first_name: "Karen ",
        //     last_name: "Murphy",
        //     // short_name: "Rocky",
        //     image: "uploads/users/user_image.jpg",
        //     gender: "Male",
        //     phone: "1234567890",
        //     personel_email: "karen@gmail.com",
        //     emergency_contact: "9874563210",
        //     pan: "HC123",
        //     blood_group: "A+",
        //     dob: "15-8-2000",
        //   },

        //   contact_details: {
        //     current_address: {
        //       address: "2483 Boundary Street Jacksonville, FL 32202",
        //       country: "United States",
        //       state: "California",
        //       pincode: "32202",
        //     },

        //     permanent_address: {
        //       address: "2483 Boundary Street Jacksonville, FL 32202",
        //       country: "United States",
        //       state: "California",
        //       pincode: "32202",
        //     },
        //   },

        //   official_details: {
        //     employee_id: "1234",
        //     job_title: "Admin",
        //     department: "645e182c7483b6558146f81f",
        //     employee_type: "645e1fcdb92bb17740482c2d",
        //     profile_status: "active",
        //     official_email: "janeofficial@gmail.com",
        //     date_of_join: "2023-05-12",
        //     // profile_privacy: {
        //     //   private: false,
        //     //   public: true,
        //     // },
        //   },

        //   account_details: [
        //     {
        //       bank_name: "Goldman Sachs",
        //       account_no: "123456789",
        //       ifsc: "1234",
        //       branch_name: "New York",
        //       account_holder: "Jane Doe",
        //     },

        //     {
        //       bank_name: "JPMorgan Chase",
        //       account_no: "987456123",
        //       ifsc: "9874",
        //       branch_name: "New York",
        //       account_holder: "Jane Doe",
        //     },
        //   ],

        //   // salary: [
        //   //   {
        //   //     label: "Basic salary",
        //   //     value: "50000",
        //   //   },
        //   //   {
        //   //     label: "House rent allowance",
        //   //     value: "10000",
        //   //   },
        //   //   {
        //   //     label: "Conveyance",
        //   //     value: "5000",
        //   //   },
        //   //   {
        //   //     label: "Medical allowance",
        //   //     value: "5000",
        //   //   },
        //   // ],

        //   salary: "70000",

        //   skills: [
        //     "64817a0bb65a951b9d985444",
        //     "64817a28b65a951b9d985445",
        //     "64818789b65a951b9d985448",
        //     "648187a5b65a951b9d985449",
        //   ],

        //   email: "janeofficial@gmail.com",
        //   password:
        //     "$2a$12$HjMPUI45OAyePe/sw8Jt7ebM7cekQoSULQpik1sqrKnXYCDorQO9S", //Jane#123
        //   last_login: "12-05-2023",
        //   // password_token: "string",
        //   user_type_id: "645e348b7483b6558146f845",
        // },
      ])
      .then((res) => {
        // Prints "1"
        console.log(res.insertedCount);
      });
  },

  down: (models, mongoose) => {
    // Add reverting commands here.
    // Return a promise to correctly handle asynchronicity.

    // Example:
    return models.users
      .deleteMany({
        _id: {
          $in: [
            "645e3a777483b6558146f854",
            "645e3a987483b6558146f855",
            "645e3aab7483b6558146f856",
          ],
        },
      })
      .then((res) => {
        // Prints "1"
        console.log(res.deletedCount);
      });
  },
};

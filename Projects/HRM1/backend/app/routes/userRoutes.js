const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const accessControl = require('../utils/access-control').accessControl;


const setAccessControl = (access_type) => {
    return (req, res, next) => {
        accessControl(access_type, req, res, next)
    }
};


router.get('/users',setAccessControl('1,2,3'),userController.fetchAll); //To ge all users including their details, access only allowed to admin, organization and manager
router.get('/users/profile',setAccessControl('1,2,3,4'),userController.fetchProfile); //Fetch profile of login user, set access to admin, organization, manager and employees
router.get('/users/:id',setAccessControl('1,2,3'),userController.fetchOne); //Api to fetch single user details, used for edit user details, access allowed to admin, organization and manager
router.post('/users',setAccessControl('2'), userController.addNewUser); //Api to add new user, access allowed to admin, organization and manager
router.put('/users/:user_id',setAccessControl('2'), userController.editUser);

//Skills api's
router.get('/skills', setAccessControl('2'), userController.fetchAllSkills);
router.get('/skills/:id',setAccessControl('2'),userController.fetchSingleSkill);
// router.post('/skills',setAccessControl('2'), userController.addNewSkills);
router.post('/skills',setAccessControl('2'), userController.addNewSkills1);
// router.put('/skills',setAccessControl('2'),userController.updateSkills);
router.put('/skills/:id',setAccessControl('2'),userController.updateSkills1);
// router.delete('/skills',setAccessControl('2'),userController.deleteSkills);
router.delete('/skills/:id',setAccessControl('2'),userController.deleteSkills1);

//Departments api's
router.get('/departments',setAccessControl('1,2'), userController.fetchAllDepartments);
router.get('/departments/:id',setAccessControl('2'),userController.fetchSingleDepartment);
router.post('/departments',setAccessControl('2'), userController.addNewDepartments);
router.put('/departments/:id',setAccessControl('2'),userController.updateDepartments);
router.delete('/departments/:id',setAccessControl('2'),userController.deleteDepartments);

//Employee types api's
router.get('/employee-types', setAccessControl('1,2'), userController.fetchAllEmployeeTypes);
router.get('/employee-types/:id',setAccessControl('2'),userController.fetchSingleEmployeeTypes);
router.post('/employee-types',setAccessControl('2'), userController.addNewEmployeeTypes);
router.put('/employee-types/:id',setAccessControl('2'),userController.updateEmployeeTypes);
router.delete('/employee-types/:id',setAccessControl('2'),userController.deleteEmployeeTypes);


module.exports = router;
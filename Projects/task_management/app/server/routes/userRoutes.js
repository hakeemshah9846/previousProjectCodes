const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
// const department = require('../db/models/department');
const section = require('../db/models/sections');
const accessControl = require('../utils/access-control').accessControl;

//only admin can
//create user
//delete user
//update user

const setAccessControl = (access_type) => {
    return (req, res, next) => {
        accessControl(access_type, req, res, next);
    }
};

router.post('/createuser',setAccessControl('1'), userController.createUser);// Admin creates a new user and mail is sent to the user's mail address, then user has to enter the details in mail to firstTimeLogin api
router.put('/profile/update', userController.updateProfile); // Update profile by the login user itself
router.put('/add-roles', userController.addRoles);


router.post('/add-request-profile', setAccessControl('1'), userController.addRequestProfile);

router.delete('/delete-profile/:target_id', setAccessControl('1'), userController.deleteProfile);
router.delete('/delete-request-profile/:target_id', setAccessControl('1'), userController.deleteRequestProfile);
router.delete('/delete-role/:role_id', setAccessControl('1'), userController.deleteRole);

// router.post("/upload-image", uploadImage.single("file"), uploadImageController.uploadFiles);
//Create api to reset password after login of users
router.post('/forgot-password', userController.forgotPasswordController);//For any users who can't login 
router.post('/reset-forgetten-password', userController.resetForgettedPassword);//After sending mail through forgot-password
router.post('/reset-password', userController.resetPasswordController);//For logged in users for just only to change the password

router.get('/fetch-all-profiles', userController.fetchAllProfiles );//Fetch all profiles (completed)(need search)(completed)
router.get('/fetch-single-profile', userController.fetchSingleProfile);//Fetch profile of a single user, usually used after login
router.get('/fetch-single-user-details/:id', userController.fetchSingleUserDetails);//Fetch profile of a single user, used by admin

router.get('/departments', setAccessControl('1'), userController.fetchAllDepartments);
router.get('/sections', setAccessControl('1'), userController.fetchAllSections);
router.get('/branches', setAccessControl('1'), userController.fetchAllBranches);
router.get('/fetch-all-roles', setAccessControl('1'), userController.fetchAllRoles);
router.get('/fetch-single-user-roles', setAccessControl('1'), userController.fetchAllRoles); // For edit or view user profiles by admin (incomplete)
router.put('/edit-user', setAccessControl('1'), userController.updateSingleUserDetails);// For updating user profiles by admin(incomplete) (roles saving not confirmed)
router.put('/edit-request-profile', setAccessControl('1'), userController.editRequestProfile);



module.exports = router;


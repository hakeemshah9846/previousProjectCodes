const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');
const accessControl = require('../utils/access-control').accessControl;

const setAccessControl = (access_type) => {
    return (req, res, next) => {
        accessControl(access_type, req, res, next);
    }
};

router.post('/login', setAccessControl('*'), authController.login); //Returns access token
router.post('/register', setAccessControl('*'), authController.register);
router.post('/register/otp', setAccessControl('*'), authController.verifyRegistrationOTP);
router.post('/logout', setAccessControl('1,2,3,4'), authController.logout);
router.post('/validate', setAccessControl('1,2,3,4'), authController.validate);
router.post('/forgot-password', setAccessControl('*'), authController.forgotPasswordController);
router.patch('/reset-password', setAccessControl('1,2,3,4'), authController.passwordResetController);

module.exports = router;
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const accessControl = require('../utils/access-control').accessControl;


const setAccessControl = (access_type) => {
    return (req, res, next) => {
        accessControl(access_type, req, res, next)
    }
};

router.get('/users', setAccessControl('*'), userController.fetchAll);
router.get('/users/inn', setAccessControl('1,2,3,4'), userController.fetchInn);
router.get('/users/profile', setAccessControl('1,2,3,4'), userController.fetchProfile);
router.put('/users/profile', setAccessControl('1,2,3,4'), userController.updateProfile);
router.get('/users/payments', setAccessControl('1,2,3,4'), userController.fetchPayments);
router.post('/users/payments', setAccessControl('1,2,3,4'), userController.addPayment);
router.get('/users/payments/:id', setAccessControl('1,2,3,4'), userController.fetchOnePayment);
router.put('/users/payments/:id', setAccessControl('1,2,3,4'), userController.updatePayment);
router.get('/users/otp', setAccessControl('1,2,3,4'), userController.generateOTP);
router.patch('/users/type/:id', setAccessControl('1'), userController.changeType);
router.get('/users/:id', setAccessControl('*'), userController.fetchOne);
router.get('/organization_users_count',setAccessControl('*'),userController.getOrganizationCount);


module.exports = router;
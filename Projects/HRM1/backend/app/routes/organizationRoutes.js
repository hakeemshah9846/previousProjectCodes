const express = require('express');
const router = express.Router();
const organizationsController = require('../controllers/organizationController');
const accessControl = require('../utils/access-control').accessControl;



const setAccessControl = (access_type) => {
    return (req, res, next) => {
        accessControl(access_type, req, res, next)
    }
};

router.get('/organization/:id',setAccessControl('1,2'), organizationsController.fetchSingleOrganization);
router.get('/organizations',setAccessControl('1'), organizationsController.fetchAllOrganizations);
router.post('/organizations',setAccessControl('1'), organizationsController.addNewOrganization);
router.put('/organizations/:organization_id',setAccessControl('1'), organizationsController.editOrganization);
router.delete('/organization/:id',setAccessControl('1'), organizationsController.deleteOrganization);


//External services api's
router.post('/external-services',setAccessControl('1'), organizationsController.addNewExternalService);
router.get('/external-services',setAccessControl('1,2'), organizationsController.fetchAllExternalServices);
router.get('/external-services/:id',setAccessControl('1'),organizationsController.fetchSingleExternalService);
router.put('/external-services/:id',setAccessControl('1'),organizationsController.updateExternalService);
router.delete('/external-services/:id',setAccessControl('1'),organizationsController.deleteExternalService);
router.patch('/external-services/organization/enable', setAccessControl('2'),organizationsController.enableExternalService);
router.patch('/external-services/organization/disable', setAccessControl('2'),organizationsController.disableExternalService);

//routes for zoho
router.get('/auth/zoho/account/zoid/callback/:organization_id',setAccessControl('*'), organizationsController.zohoCallBackZoid)
// router.get('/auth/zoho/account/create/callback/:organization_id',setAccessControl('*'), organizationsController.zohoCallBackCreate)

module.exports = router;

const express = require('express');
const router = express.Router();
const accessControl = require('../utils/access-control').accessControl;
const finishingAndBindingController = require('../controllers/finishingAndBindingController');


const setAccessControl = (access_type) => {
    return (req, res, next) => {
        accessControl(access_type, req, res, next);
    }
};

router.get('/binding-operators', setAccessControl('1'), finishingAndBindingController.fetchAllBindingOperators);
router.get('/binding-types', setAccessControl('1'), finishingAndBindingController.fetchAllBindingTypes);
router.get('/binding-status', setAccessControl('1'), finishingAndBindingController.fetchAllBindingStatus);
router.get('/binding-materials', setAccessControl('1'), finishingAndBindingController.fetchAllBindingMaterials);
router.get('/materials', setAccessControl('1'), finishingAndBindingController.fetchAllMaterials);
router.get('/binding-unit-costs', setAccessControl('1'), finishingAndBindingController.fetchAllBindingUnitCosts);
router.get('/fetch-single-binding-details/:binding_id', setAccessControl('1'), finishingAndBindingController.fetchSingleBindingDetails);




router.post('/finishing-and-binding', setAccessControl('1'), finishingAndBindingController.createNew);

router.put('/edit-finishing-and-binding', setAccessControl('1'), finishingAndBindingController.bindingEdit);


module.exports = router;
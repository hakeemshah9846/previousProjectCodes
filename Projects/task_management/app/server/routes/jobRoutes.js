const express = require('express');
const router = express.Router();
const accessControl = require('../utils/access-control').accessControl;
const jobsController = require('../controllers/jobsController');

const setAccessControl = (access_type) => {
    return (req, res, next) => {
        accessControl(access_type, req, res, next);
    }
};

router.get('/campuses', setAccessControl('1'), jobsController.fetchAllEntities); //For school/entities section in jobs ui image
router.get('/delivery-modes', setAccessControl('1'), jobsController.fetchAllDeliveryModes);
router.get('/document-modes', setAccessControl('1'), jobsController.fetchAllDocumentModes);
router.get('/document-types', setAccessControl('1'), jobsController.fetchAllDocumentTypes);
router.get('/request-profile', setAccessControl('1'), jobsController.fetchAllClients); // deliver to and requested by dropdown section in the UI images (Clients)(need search)(completed)
router.get('/fetch-single-request-profile/:client_id', setAccessControl('1'), jobsController.fetchSingleClient); // deliver to and requested by dropdown section in the UI images (Clients)

router.get('/job-types', setAccessControl('1'), jobsController.fetchAllJobTypes);
router.get('/job-status', setAccessControl('1'), jobsController.fetchAllJobStatus);
router.get('/job-profiles', setAccessControl('1,3'), jobsController.fetchAllJobProfiles); //(need search)(completed)
router.get('/fetch-single-job-details/:job_id', setAccessControl('1,3'), jobsController.fetchSingleJobProfiles);

router.get('/operator-job-details', jobsController.fetchOperatorJobDetails);//After user login , fetch the jobs assigned to the operator users(need search)
router.get('/fetch-single-operator-job-details/:job_id', jobsController.fetchSingleOperatorJobDetails);




router.post('/create-job', setAccessControl('1'), jobsController.createJob);

router.put('/edit-job', setAccessControl('1'), jobsController.editJob);

router.delete('/delete-job/:job_id', setAccessControl('1'), jobsController.deleteJob);


module.exports = router;
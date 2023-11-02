const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController.js');
const accessControl = require('../utils/access-control').accessControl;

const setAccessControl = (access_type) => {
    return (req, res, next) => {
        accessControl(access_type, req, res, next)
    }
};

router.get('/requests', setAccessControl('1,2,3,4'), requestController.fetchRequests);
router.post('/requests', setAccessControl('1,2,3,4'), requestController.addRequest);
router.get('/requests/:id', setAccessControl('1,2,3,4'), requestController.fetchOneRequest);
router.put('/requests/:id', setAccessControl('1,2,3,4'), requestController.updateRequest);
router.delete('/requests/:id', setAccessControl('1,2,3,4'), requestController.deleteRequest);
router.patch('/requests/accept/:id', setAccessControl('1,2'), requestController.acceptRequest);
router.patch('/requests/reject/:id', setAccessControl('1,2'), requestController.rejectRequest);

module.exports = router;
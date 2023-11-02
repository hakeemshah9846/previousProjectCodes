const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController.js');
const accessControl = require('../utils/access-control').accessControl;

const setAccessControl = (access_type) => {
    return (req, res, next) => {
        accessControl(access_type, req, res, next)
    }
};

router.get('/donations', setAccessControl('1,2,3,4'), donationController.fetchDonations);
router.get('/donations/:id', setAccessControl('*'), donationController.fetchDonation);
router.post('/donations/collections/:id', setAccessControl('*'), donationController.addDonation);

module.exports = router;
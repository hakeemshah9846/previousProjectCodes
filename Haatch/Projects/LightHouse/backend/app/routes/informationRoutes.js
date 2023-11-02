const express = require('express');
const router = express.Router();
const informationController = require('../controllers/informationController');
const accessControl = require('../utils/access-control').accessControl;

const setAccessControl = (access_type) => {
    return (req, res, next) => {
        accessControl(access_type, req, res, next)
    }
};

router.get('/informations/', setAccessControl('*'), informationController.fetchInformations);
module.exports = router;
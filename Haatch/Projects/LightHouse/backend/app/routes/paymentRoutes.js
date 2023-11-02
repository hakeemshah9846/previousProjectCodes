const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController.js');
const accessControl = require('../utils/access-control').accessControl;

const setAccessControl = (access_type) => {
    return (req, res, next) => {
        accessControl(access_type, req, res, next)
    }
};

router.get('/payment-platforms', setAccessControl('*'), paymentController.fetchAll);
router.get('/payment-platforms/:id', setAccessControl('*'), paymentController.fetchOne);
module.exports = router;
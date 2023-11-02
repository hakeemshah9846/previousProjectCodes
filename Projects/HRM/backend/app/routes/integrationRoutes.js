const express = require('express');
const router = express.Router();
const accessControl = require('../utils/access-control').accessControl;
const accessControl1 = require('../utils/integration-access-control').accessControl;
const integrationController = require('../controllers/integrationController');

const setAccessControl = (access_type) => {
    return (req, res, next) => {
        accessControl(access_type, req, res, next)
    }
};


const setAccessControl1 = (access_type) => {
    return (req, res, next) => {
        accessControl1(access_type, req, res, next)
    }
};

router.get('/integration/token', setAccessControl('2'), integrationController.generateToken);
router.post('/integration/user', setAccessControl1('2'), integrationController.createUser);
router.delete('/integration/token/:token',setAccessControl('2'),integrationController.revokeToken);

module.exports = router;

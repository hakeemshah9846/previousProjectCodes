const express = require('express');
const router = express.Router();
const userLevelController = require('../controllers/userLevelController.js');
const accessControl = require('../utils/access-control').accessControl;

const setAccessControl = (access_type) => {
    return (req, res, next) => {
        accessControl(access_type, req, res, next)
    }
};

router.get('/user-levels', setAccessControl('*'), userLevelController.fetchAll);
router.get('/user-levels/:id', setAccessControl('*'), userLevelController.fetchOne);



module.exports = router;
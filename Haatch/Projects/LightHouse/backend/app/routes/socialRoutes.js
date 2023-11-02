const express = require('express');
const router = express.Router();
const socialController = require('../controllers/socialController.js');
const accessControl = require('../utils/access-control').accessControl;

const setAccessControl = (access_type) => {
    return (req, res, next) => {
        accessControl(access_type, req, res, next)
    }
};

router.get('/social-medias', setAccessControl('1,2,3,4'), socialController.fetchAll);
router.get('/social-medias/:id', setAccessControl('1,2,3,4'), socialController.fetchOne);
module.exports = router;
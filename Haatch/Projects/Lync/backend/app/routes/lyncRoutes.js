const express = require('express');
const controller = require('../controllers/lyncController');
const revokedToken = require('../revoked-token').revokedToken;
const router = express.Router();

router.post('/lync/login',controller.loginController);
router.post('/lync/logout',controller.logoutController);
router.get('/lync/user',controller.getUserController);
router.get('/lync/groups/branch/:branch_id',revokedToken,controller.getGroupsController);
router.get('/lync/branches',revokedToken,controller.getBranchesController);
module.exports = router;
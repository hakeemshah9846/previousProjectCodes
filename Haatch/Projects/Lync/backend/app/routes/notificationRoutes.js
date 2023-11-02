const express = require('express');
const controller = require('../controllers/notificationController');
const revokedToken = require('../revoked-token').revokedToken;
const router = express.Router();


router.get('/notification/types',revokedToken,controller.getNotificationTypesController);
router.get('/response/types',revokedToken,controller.getResponseTypesController);
router.get('/notifications',revokedToken,controller.fetchNotificationController);
router.get('/notifications/search',revokedToken,controller.searchNotificationController);
router.get('/notifications/:notification_id',revokedToken,controller.fetchSingleNotificationController);
router.post('/notifications',revokedToken,controller.createNotificationController);
router.post('/notifications/files',revokedToken,controller.filesNotificationController);
router.put('/notifications/:notification_id',revokedToken,controller.updateNotificationController);
router.delete('/notifications/:notification_id',revokedToken,controller.deleteNotificationController);
router.get('/lync/notifications',controller.lyncFetchNotificationController);
router.get('/lync/responses/:notification_id',revokedToken,controller.lyncGetResponsesController);
router.post('/lync/responses/:notification_id',controller.lyncAddResponsesController);
module.exports = router;
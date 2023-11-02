const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');

router.post('/process-data', dataController.processData);
router.get('/status/:taskId', dataController.checkStatus);

module.exports = router;
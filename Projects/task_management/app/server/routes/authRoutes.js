const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');




router.post('/login', authController.login); //Returns access token
router.post('/logout', authController.logout);
router.post('/first-time-login', authController.firstTimeLogin);
// router.get('/',(req,res)=>{
//     res.status(200).send("Hello World");
// })

module.exports = router;

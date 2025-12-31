const express=require('express');
const router=express.Router();
const controller=require('../controller/authController');
const authenticate = require("../middleware/auth");


router.post('/register',controller.register);
router.post('/login',controller.login);
router.get('/home',controller.home);
router.get('/quiz/:id',controller.quiz);
router.get('/ques/:id',controller.ques);
router.post('/ques/:id',authenticate,controller.submitAnswerAndResult);
router.get("/profile/:id", authenticate, controller.getUserProfile);
router.get("/review/:user_id/:attempt_id", controller.review);








module.exports = router;

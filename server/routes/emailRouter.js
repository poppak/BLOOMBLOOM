const Router = require('express');
const router = new Router();
const emailController = require('../controllers/emailController');

router.post('/', emailController.sendEmailNotification);

module.exports = router;
const router = require('express').Router();
const controller = require('../../controller/mobileController/notificationController');

router.post('/register-token', controller.registerToken);
router.post('/send-test', controller.sendTestNotification);

module.exports = router;

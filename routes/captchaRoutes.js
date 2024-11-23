const express = require('express');
const router = express.Router();
const {
  generateCaptcha,
  verifyCaptcha,
  createOrder,
  verifyPayment,
  getDefaultUserCoins
} = require('../controllers/captchaController');

router.get('/captcha', generateCaptcha);
router.post('/captcha/verify', verifyCaptcha);
router.post('/create-order', createOrder);
router.post('/payment-success', verifyPayment);
router.get('/user/coins', getDefaultUserCoins);
module.exports = router;

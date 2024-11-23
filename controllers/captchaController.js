const crypto = require('crypto');
const Razorpay = require('razorpay');
const { getUserByUsername, updateUserCoins } = require('../models/user');
const dotenv = require('dotenv');
dotenv.config();

const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;
const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

// Generate a CAPTCHA
exports.generateCaptcha = async (req, res) => {
  const captchaText = crypto.randomBytes(6).toString('base64').slice(0, 6);
  res.json({ captchaText, id: crypto.randomBytes(8).toString('hex') });
};

// Verify CAPTCHA and award coins
exports.verifyCaptcha = async (req, res) => {
  const { userAnswer, captchaText } = req.body;

  try {
    // Fetch the user from MySQL
    getUserByUsername('default_user', (err, user) => {
      if (err || !user) {
        return res.status(404).json({ success: false, message: 'User not found!' });
      }

      if (userAnswer === captchaText) {
        // Correct answer: Award 15 coins
        user.coins += 15;
        updateUserCoins('default_user', user.coins, (err, result) => {
          if (err) {
            return res.status(500).json({ success: false, message: 'Error updating coins' });
          }
          res.json({ success: true, coins: user.coins, message: 'Correct CAPTCHA!' });
        });
      } else {
        // Incorrect answer: Deduct 10 coins (allowing negative balance)
        user.coins -= 10;
        updateUserCoins('default_user', user.coins, (err, result) => {
          if (err) {
            return res.status(500).json({ success: false, message: 'Error updating coins' });
          }
          res.json({ success: false, coins: user.coins, message: 'Incorrect CAPTCHA!' });
        });
      }
    });
  } catch (error) {
    console.error('Error verifying CAPTCHA:', error);
    res.status(500).json({ success: false, message: 'Internal server error!' });
  }
};

// Razorpay Order
exports.createOrder = async (req, res) => {
  const amountInRupees = req.body.amount;
  const amountInPaise = amountInRupees * 100; // Convert INR to paise (100 paise = 1 INR)

  const options = {
    amount: amountInPaise, // Razorpay requires amount in paise
    currency: 'INR',
    receipt: `receipt_${crypto.randomBytes(8).toString('hex')}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json({ orderId: order.id, key_id: RAZORPAY_KEY_ID });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating Razorpay order', error });
  }
};

// Payment Verification
exports.verifyPayment = async (req, res) => {
  const { paymentId, orderId, signature } = req.body;

  const generatedSignature = crypto
    .createHmac('sha256', RAZORPAY_KEY_SECRET)
    .update(orderId + '|' + paymentId)
    .digest('hex');

  if (generatedSignature === signature) {
    try {
      // Find the user
      getUserByUsername('default_user', (err, user) => {
        if (err || !user) {
          return res.status(404).json({ success: false, message: 'User not found!' });
        }

        // Calculate coins based on amount
        const order = razorpay.orders.fetch(orderId);
        const amountInRupees = order.amount / 100; // Convert paise to INR
        const coinsToAward = amountInRupees;

        user.coins += coinsToAward;
        updateUserCoins('default_user', user.coins, (err, result) => {
          if (err) {
            return res.status(500).json({ success: false, message: 'Error updating coins' });
          }
          res.json({ success: true, coins: user.coins, message: 'Payment verified and coins awarded!' });
        });
      });
    } catch (error) {
      console.error('Error during payment verification:', error);
      res.status(500).json({ success: false, message: 'Error during payment verification' });
    }
  } else {
    res.status(400).json({ success: false, message: 'Payment verification failed!' });
  }
};

// Get user coins
exports.getDefaultUserCoins = async (req, res) => {
  try {
    getUserByUsername('default_user', (err, user) => {
      if (err || !user) {
        return res.status(404).json({ success: false, message: 'User not found!' });
      }
      res.json({ success: true, coins: user.coins });
    });
  } catch (error) {
    console.error('Error fetching user coins:', error);
    res.status(500).json({ success: false, message: 'Server error!' });
  }
};

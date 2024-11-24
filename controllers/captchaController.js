const crypto = require('crypto');
const Razorpay = require('razorpay');
const User = require('../models/user');
const dotenv = require('dotenv');
dotenv.config(); 

const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;
//console.log("RAZORPAY_KEY_ID", process.env );

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
    // Fetch the user
    const user = await User.findOne({ username: 'default_user' });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found!' });
    }

    if (userAnswer === captchaText) {
      // Correct answer: Award 15 coins
      user.coins += 15;
      await user.save();
      res.json({ success: true, coins: user.coins, message: 'Correct CAPTCHA!' });
    } else {
      // Incorrect answer: Deduct 10 coins (allowing negative balance)
      user.coins -= 10;
      await user.save();
      res.json({ success: false, coins: user.coins, message: 'Incorrect CAPTCHA!' });
    }
  } catch (error) {
    console.error('Error verifying CAPTCHA:', error);
    res.status(500).json({ success: false, message: 'Internal server error!' });
  }
};


// Razorpay Order
exports.createOrder = async (req, res) => {
  const amountInRupees = req.body.amount; // Amount in INR
  const amountInPaise = amountInRupees * 100; // Convert INR to paise (100 paise = 1 INR)

  const options = {
    amount: amountInPaise, // Razorpay requires amount in paise
    currency: 'INR',
    receipt: `receipt_${crypto.randomBytes(8).toString('hex')}`,
    payment_capture: 1
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

  // Generate the signature to verify
  const generatedSignature = crypto
    .createHmac('sha256', RAZORPAY_KEY_SECRET)
    .update(orderId + '|' + paymentId)
    .digest('hex');

  if (generatedSignature === signature) {
    try {
      // Find the user (assuming 'default_user' is the user who is making the payment)
      const user = await User.findOne({ username: 'default_user' });
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found!' });
      }

      // Calculate the number of coins based on the amount in INR
      const order = await razorpay.orders.fetch(orderId);
      const amountInRupees = order.amount / 100; // Convert paise back to INR
      const coinsToAward = amountInRupees; // 1 INR = 1 Coin

      // Add the coins to the user's balance
      user.coins += coinsToAward;
      await user.save();

      // Respond with the success message and updated coin balance
      res.json({ success: true, coins: user.coins, message: 'Payment verified and coins awarded!' });
    } catch (error) {
      console.error('Error during payment verification:', error);
      res.status(500).json({ success: false, message: 'Error during payment verification' });
    }
  } else {
    res.status(400).json({ success: false, message: 'Payment verification failed!' });
  }
};


exports.getDefaultUserCoins = async (req, res) => {
  try {
    const user = await User.findOne({ username: 'default_user' });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found!' });
    }
    res.json({ success: true, coins: user.coins });
  } catch (error) {
    console.error('Error fetching user coins:', error);
    res.status(500).json({ success: false, message: 'Server error!' });
  }
};
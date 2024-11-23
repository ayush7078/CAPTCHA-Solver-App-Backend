# CAPTCHA Solver with Razorpay Integration

This project implements a CAPTCHA solver that rewards users with coins for solving CAPTCHA challenges. It also integrates with Razorpay for payment processing, where users can earn coins based on the amount they pay.

## Features

- **CAPTCHA Generation and Verification**: Users can solve CAPTCHAs to earn coins. Correct answers award coins, while incorrect answers deduct coins.
- **Payment Gateway Integration**: Razorpay is used to create orders, verify payments, and award coins based on the payment amount.
- **MongoDB Integration**: The application stores user data, including coins, in a MongoDB database.
- **Express.js Server**: The backend is powered by Express.js to handle routes and API requests.
- **Environment Variables**: The application uses `.env` files for configuration (e.g., MongoDB URI, Razorpay credentials).

## Technologies Used

- **Node.js**
- **Express.js**
- **MongoDB**
- **Razorpay**
- **dotenv** for environment variables
- **crypto** for secure random generation and hashing

## Installation

### 1. Clone the repository

git clone https://github.com/ayush7078/CAPTCHA-Solver-App-Backend.git
cd CAPTCHA-Solver-App-Backend

2. Install dependencies
Make sure you have Node.js and npm installed. If not, download and install Node.js.

- Run the following command to install all required dependencies:
npm install

3. Set up environment variables
- Create a .env file in the root directory and add the following environment variables:

MONGO_URI=mongodb://localhost:27017/captcha_solver
PORT=5000
RAZORPAY_KEY_ID= razorpay_key_id
RAZORPAY_KEY_SECRET=razorpay_key_secret
Replace razorpay_key_id and razorpay_key_secret with your Razorpay credentials.

4. Run the application

- Start the server with the following command:
npm start

The server will run on port 5000 by default. If you have specified a different port in your .env file, it will use that.

API Endpoints
1. Generate CAPTCHA
GET /api/captcha
Generates a random CAPTCHA text for the user to solve.

2. Verify CAPTCHA
POST /api/captcha/verify
Request body:
{
  "userAnswer": "CAPTCHA_ANSWER",
  "captchaText": "CAPTCHA_TEXT"
}
Verifies the user-provided CAPTCHA answer. If correct, coins are awarded; if incorrect, coins are deducted.

3. Create Order (Razorpay)
POST /api/create-order
Request body:
{
  "amount": 100 // Amount in INR
}
Creates a Razorpay order for the specified amount and returns the order ID and key.

4. Verify Payment
POST /api/payment-success
Request body:
{
  "paymentId": "PAYMENT_ID",
  "orderId": "ORDER_ID",
  "signature": "SIGNATURE"
}
Verifies the payment using the payment ID, order ID, and signature. If successful, coins are added to the user's account based on the amount paid.

5. Get Default User Coins
GET /api/user/coins
Retrieves the current number of coins for the default user.

# Folder Structure

├── controllers/
│   └── captchaController.js      # Contains the business logic for CAPTCHA and payment
├── models/
│   └── user.js                   # Mongoose model for user data (username, coins)
├── routes/
│   └── captchaRoutes.js          # API routes for CAPTCHA and Razorpay operations
├── config/
│   └── db.js                     # Database connection configuration
├── .env                           # Environment variables (DO NOT commit to GitHub)
├── server.js                      # Entry point for the application
├── package.json                   # Project metadata and dependencies
└── README.md                      # Documentation


# Notes
Make sure MongoDB is installed and running on your local machine or use a cloud database provider.
For Razorpay integration, you need to have a Razorpay account to get the API keys.
const db = require('../config/db'); // Import the pool

// Get user by username
const getUserByUsername = (username, callback) => {
  const query = 'SELECT * FROM users WHERE username = ?';
  db.execute(query, [username], (err, results) => { // Use execute instead of query
    if (err) {
      console.error('Error fetching user:', err);
      return callback(err);
    }
    callback(null, results[0]); // Return the first matching user
  });
};

// Update user coins
const updateUserCoins = (username, coins, callback) => {
  const query = 'UPDATE users SET coins = ? WHERE username = ?';
  db.execute(query, [coins, username], (err, results) => { // Use execute instead of query
    if (err) {
      console.error('Error updating user coins:', err);
      return callback(err);
    }
    callback(null, results);
  });
};

module.exports = { getUserByUsername, updateUserCoins };

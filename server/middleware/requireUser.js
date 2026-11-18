const mongoose = require('mongoose');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const userId = req.header('x-user-id');

    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(401).json({ message: 'Please log in first' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: 'Please log in first' });
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

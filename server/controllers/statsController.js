const Photo = require('../models/Photo');
const User = require('../models/User');

exports.getStats = async (req, res, next) => {
  try {
    const [totalPhotos, totalUsers] = await Promise.all([
      Photo.countDocuments(),
      User.countDocuments(),
    ]);
    res.json({ totalPhotos, totalUsers });
  } catch (err) {
    next(err);
  }
};

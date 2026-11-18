const mongoose =require('mongoose');
const Photo =require('../models/Photo');
const Comment =require('../models/Comment');

exports.create = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid photo id' });
    }

    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    const comment = await Comment.create({
      photoId: photo._id,
      userId: req.user._id,
      comment: req.body.comment,
    });

    await comment.populate('userId', 'firstName lastName');
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};

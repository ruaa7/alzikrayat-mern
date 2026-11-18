const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Photo = require('../models/Photo');
const Comment = require('../models/Comment');

const uploadsDir = path.join(__dirname, '..', 'uploads');

// GET /api/photos all photos, newest first
exports.getAll = async (req, res, next) => {
  try {
    const photos = await Photo.find()
      .sort({ dateTime: -1 })
      .populate('userId', 'firstName lastName');
    res.json(photos);
  } catch (err) {
    next(err);
  }
};

// GET /api/photos/:id 
exports.getOne = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid photo id' });
    }

    const photo = await Photo.findById(req.params.id).populate('userId', 'firstName lastName');
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    const comments = await Comment.find({ photoId: photo._id })
      .sort({ dateTime: 1 })
      .populate('userId', 'firstName lastName');

    res.json({ ...photo.toObject(), comments });
  } catch (err) {
    next(err);
  }
};

// POST /api/photos - upload a photo (logged-in users only)
exports.create = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please choose an image to upload' });
    }

    const photo = await Photo.create({
      userId: req.user._id,
      fileName: req.file.filename,
      title: req.body.title,
      description: req.body.description,
    });

    await photo.populate('userId', 'firstName lastName');
    res.status(201).json(photo);
  } catch (err) {
    if (req.file) fs.unlink(req.file.path, () => {});
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid photo id' });
    }

    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    if (photo.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own photos' });
    }

    await Comment.deleteMany({ photoId: photo._id });
    await photo.deleteOne();
    fs.unlink(path.join(uploadsDir, photo.fileName), () => {}); // remove the file too

    res.json({ message: 'Photo deleted' });
  } catch (err) {
    next(err);
  }
};

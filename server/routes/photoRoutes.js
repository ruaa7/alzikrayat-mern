const path = require('path');
const crypto = require('crypto');
const express = require('express');
const multer = require('multer');
const photoController = require('../controllers/photoController');
const requireUser = require('../middleware/requireUser');
const { validatePhoto } = require('../middleware/validation');

const router = express.Router();

// multer store images on disk in server/uploads/
const allowedTypes = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
};

const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', 'uploads'),
  filename: (req, file, cb) => {
    cb(null, crypto.randomBytes(16).toString('hex') + allowedTypes[file.mimetype]);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (allowedTypes[file.mimetype]) return cb(null, true);
    const err = new Error('Only JPG, PNG, GIF or WEBP images are allowed');
    err.isFileTypeError = true;
    cb(err);
  },
});

router.get('/api/photos', photoController.getAll);
router.get('/api/photos/:id', photoController.getOne);
router.post('/api/photos', requireUser, upload.single('photo'), validatePhoto, photoController.create);
router.delete('/api/photos/:id', requireUser, photoController.remove);

module.exports = router;

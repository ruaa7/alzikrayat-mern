const express = require('express');
const commentController = require('../controllers/commentController');
const requireUser = require('../middleware/requireUser');
const { validateComment } = require('../middleware/validation');

const router = express.Router();

router.post('/api/photos/:id/comments', requireUser, validateComment, commentController.create);

module.exports = router;


module.exports = (err, req, res, next) => {
  console.error(err);

  // multer errors and our own file-type error
  if (err.name === 'MulterError') {
    const message = err.code === 'LIMIT_FILE_SIZE' ? 'Image must be 5 MB or smaller' : err.message;
    return res.status(400).json({ message });
  }
  if (err.isFileTypeError) {
    return res.status(400).json({ message: err.message });
  }

  // Mongoose: bad ObjectId,schema validation,duplicate key
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid id' });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: 'That email is already registered' });
  }

  res.status(err.status || 500).json({ message: err.message || 'Server error' });
};

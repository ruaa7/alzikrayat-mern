
const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileName: { type: String, required: [true, 'File name is required'] },
  title: { type: String, required: [true, 'Title is required'], trim: true },
  description: { type: String, trim: true },
  dateTime: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Photo', photoSchema);

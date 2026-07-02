const mongoose = require('mongoose');

// This is the blueprint for our data storage
const UrlSchema = new mongoose.Schema({
    longUrl: { type: String, required: true },
    shortUrlCode: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Url', UrlSchema);
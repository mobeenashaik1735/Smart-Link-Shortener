const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { nanoid } = require('nanoid');
const Url = require('./models/Url');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to your MongoDB Cloud Database using your .env link
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Database Connected Perfectly!'))
    .catch(err => console.error('Database Error:', err));

// Route 1: Create the short link
app.post('/api/shorten', async (req, res) => {
    const { longUrl } = req.body;
    if (!longUrl) return res.status(400).json({ error: 'Please enter a URL' });

    try {
        const shortUrlCode = nanoid(5); // Generates a 5-character code like 'x7K29'
        const newUrl = new Url({ longUrl, shortUrlCode });
        await newUrl.save(); // Saves to cloud database

        res.json({ shortUrl: `https://smart-link-shortener.onrender.com/${shortUrlCode}` });
    } catch (err) {
        res.status(500).json({ error: 'Server Error occurred' });
    }
});

// Route 2: The Redirection Magic
app.get('/:code', async (req, res) => {
    try {
        const linkRecord = await Url.findOne({ shortUrlCode: req.params.code });
        if (linkRecord) {
            return res.redirect(linkRecord.longUrl); // Pushes user to original website
        }
        return res.status(404).send('Link not found.');
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on Port ${PORT}`));

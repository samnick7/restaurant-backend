const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://sam-nick:Samnick%407@cluster1.we4olul.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Mongoose Schema & Model
const subscriberSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true }
},{ timestamps: true });

const Subscriber = mongoose.model('Subscriber', subscriberSchema);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "bitemerestaurant123@gmail.com",
    pass: "scbj spil rngr seuo"
  }
});

// POST /subscribe Route
app.post('/subscribe', async (req, res) => {
  const { email } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  try {
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Already subscribed' });
    }

    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();

    await transporter.sendMail({
      from: `"Bite-me" <bitemerestaurant123@gmail.com>`,
      to: email,
      subject: "🎁 Welcome Offer from Bite-Me Restaurant!",
      html: `
        <h2>Thank you for subscribing!</h2>
        <p>Here's your exclusive offer: <strong>20% OFF</strong> your next order.</p>
        <p>Use Code: <b>WELCOME20</b> at checkout.</p>
        <p>Visit: <a href="https://samnick7.github.io/Restaurant-site">Bite-me.com</a></p>
      `
    });

    res.status(200).json({ message: 'Thank you for subscribing!' });
  } catch (err) {
    console.error('Error saving subscriber:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
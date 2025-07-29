const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;
const MONGO_URI = "mongodb+srv://sam-nick:Samnick@7@cluster1.we4olul.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1";
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(MONGO_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Mongoose Schema & Model
const subscriberSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true }
});

const Subscriber = mongoose.model('Subscriber', subscriberSchema);

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

    res.status(200).json({ message: 'Thank you for subscribing!' });
  } catch (err) {
    console.error('Error saving subscriber:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

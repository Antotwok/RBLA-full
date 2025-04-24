// Backend Architect: Staines Paul
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Superadmin = require('../models/superadmin'); // Assuming your Superadmin model is here
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

async function createSuperadmin() {
  const username = 'paul786';
  const password = 'paul9801';
  const hashedPassword = await bcrypt.hash(password, 10);

  const superadmin = new Superadmin({ username, password: hashedPassword });

  try {
    await superadmin.save();
    console.log('Superadmin created successfully with username: paul786');
    mongoose.disconnect();
  } catch (err) {
    console.error('Error creating superadmin:', err);
    mongoose.disconnect();
  }
}

createSuperadmin();

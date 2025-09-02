require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bookRoutes = require('./routes/books');
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI + 'booksdb?retryWrites=true&w=majority';
mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

app.use('/api/books', bookRoutes);
app.use('/api/auth', authRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
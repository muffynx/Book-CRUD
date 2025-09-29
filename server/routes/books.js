const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Book = require('../models/Book');

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Apply middleware to all routes
router.use(authenticateToken);

// GET all books for the authenticated user
router.get('/', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const books = await Book.find({ userId: req.user.userId })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    const count = await Book.countDocuments({ userId: req.user.userId });
    res.json({
      books,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page)
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch books', error: err.message });
  }
});

// GET book by id (only if owned by the user)
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!book) return res.status(404).json({ message: 'Book not found or you do not have permission' });
    res.json({ book });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch book', error: err.message });
  }
});

// POST new book
router.post('/', async (req, res) => {
  const bookData = { ...req.body, userId: req.user.userId };
  const book = new Book(bookData);
  try {
    const newBook = await book.save();
    res.status(201).json({ message: 'Book created successfully', book: newBook });
  } catch (err) {
    res.status(400).json({ message: 'Failed to create book', error: err.message });
  }
});

// PUT update book (only if owned by the user)
router.put('/:id', async (req, res) => {
  try {
    const updatedBook = await Book.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );
    if (!updatedBook) return res.status(404).json({ message: 'Book not found or you do not have permission' });
    res.json({ message: 'Book updated successfully', book: updatedBook });
  } catch (err) {
    res.status(400).json({ message: 'Failed to update book', error: err.message });
  }
});

// DELETE book (only if owned by the user)
// server/routes/books.js
router.delete('/:id', async (req, res) => {
  try {
    console.log("DELETE request received for book ID:", req.params.id, "User ID:", req.user.userId);
    const deletedBook = await Book.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!deletedBook) {
      console.log("Book not found or permission denied for ID:", req.params.id);
      return res.status(404).json({ message: 'Book not found or you do not have permission' });
    }
    console.log("Book deleted:", deletedBook);
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    console.error("Error deleting book:", err.message);
    res.status(500).json({ message: 'Failed to delete book', error: err.message });
  }
});

module.exports = router;
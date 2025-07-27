const express = require('express');
const { ContactMessage } = require('../models');
const router = express.Router();

// POST /api/contact - Save a new contact message
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }
    const contact = await ContactMessage.create({ name, email, subject, message });
    res.status(201).json({ success: true, data: contact });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/contact - List all contact messages (admin only)
router.get('/', async (req, res) => {
  // TODO: Replace with real admin auth check
  // if (!req.user || !req.user.isAdmin) return res.status(403).json({ success: false, message: 'Forbidden' });
  try {
    const messages = await ContactMessage.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ success: true, data: messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/contact/:id - Delete a contact message (admin only)
router.delete('/:id', async (req, res) => {
  // TODO: Replace with real admin auth check
  try {
    const { id } = req.params;
    const deleted = await ContactMessage.destroy({ where: { id } });
    if (deleted) {
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, message: 'Message not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router; 
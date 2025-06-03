const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const OrganInventory = require('../models/OrganInventoryModel');

console.log("Organ Inventory Routes Loaded");

// Add Organ
router.post('/add-organ', async (req, res) => {
  try {
    const { organType, bloodGroup, quantity, donor, hospital } = req.body;

    // Input validation
    if (!organType || !bloodGroup || !quantity || !donor) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Convert donor and hospital to ObjectIds
    const newOrgan = new OrganInventory({
      organType,
      bloodGroup,
      quantity,
      donor: new mongoose.Types.ObjectId(donor),
      hospital: hospital ? new mongoose.Types.ObjectId(hospital) : undefined,
    });

    await newOrgan.save();
    res.status(201).json({ success: true, message: 'Organ added successfully' });
  } catch (error) {
    console.error('Organ save error:', error);
    res.status(500).json({ success: false, message: 'Error adding organ', error: error.message });
  }
});

// Get Organs
router.get('/get-organ', async (req, res) => {
  try {
    const organs = await OrganInventory.find()
      .populate('donor', 'name email')
      .populate('hospital', 'name email');
    res.status(200).json({ success: true, data: organs });
  } catch (error) {
    console.error('Error fetching organs:', error);
    res.status(500).json({ success: false, message: 'Error fetching organs', error: error.message });
  }
});

// Delete Organ
router.delete('/:id', async (req, res) => {
  try {
    const organ = await OrganInventory.findByIdAndDelete(req.params.id);
    if (!organ) {
      return res.status(404).json({ success: false, message: 'Organ not found' });
    }
    res.status(200).json({ success: true, message: 'Organ deleted successfully' });
  } catch (error) {
    console.error('Error deleting organ:', error);
    res.status(500).json({ success: false, message: 'Error deleting organ', error: error.message });
  }
});

module.exports = router;

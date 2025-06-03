// models/organInventoryModel.js

const mongoose = require('mongoose');

const organInventorySchema = new mongoose.Schema({
  organType: {
    type: String,
    required: true,
  },
  bloodGroup: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

module.exports = mongoose.model('OrganInventory', organInventorySchema);

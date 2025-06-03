// controllers/organInventoryController.js

const Organ = require('../models/OrganInventoryModel');

exports.getOrgans = async (req, res) => {
  try {
    const organs = await Organ.find().populate('donor hospital', 'name _id'); // Populate only name & id
    res.status(200).json({ success: true, data: organs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addOrgan = async (req, res) => {
  try {
    const organ = new Organ(req.body);
    await organ.save();
    res.status(201).json({ success: true, data: organ });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
// controllers/organInventoryController.js

exports.deleteOrgan = async (req, res) => {
    try {
      const organ = await Organ.findByIdAndDelete(req.params.id);
      if (!organ) {
        return res.status(404).json({ success: false, message: "Organ not found" });
      }
      res.status(200).json({ success: true, message: "Organ deleted successfully" });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
  

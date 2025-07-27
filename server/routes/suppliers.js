const express = require('express');
const User = require('../models/User');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/suppliers
// @desc    Get all suppliers (vendors only)
// @access  Private
router.get('/', auth, requireRole(['vendor']), async (req, res) => {
  try {
    const { category, location, search } = req.query;
    
    let query = { 
      role: 'supplier',
      isActive: true 
    };

    // Add search filter if provided
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Add category filter if provided (placeholder for future implementation)
    if (category) {
      // This would be implemented when product categories are added
      // query.category = category;
    }

    // Add location filter if provided (placeholder for future implementation)
    if (location) {
      // This would be implemented when location data is added
      // query.location = location;
    }

    const suppliers = await User.find(query)
      .select('name email phone createdAt')
      .sort({ name: 1 });

    res.json({
      success: true,
      data: suppliers
    });
  } catch (error) {
    console.error('Get suppliers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/suppliers/:supplierId
// @desc    Get a specific supplier's details (vendors only)
// @access  Private
router.get('/:supplierId', auth, requireRole(['vendor']), async (req, res) => {
  try {
    const { supplierId } = req.params;

    const supplier = await User.findOne({
      _id: supplierId,
      role: 'supplier',
      isActive: true
    }).select('name email phone createdAt');

    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    res.json({
      success: true,
      data: supplier
    });
  } catch (error) {
    console.error('Get supplier error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 
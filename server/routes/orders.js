const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/orders
// @desc    Get orders for the current user (filtered by role)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { status, supplierId, vendorId } = req.query;
    const userId = req.user._id;
    const userRole = req.user.role;

    let query = {};

    // Filter by user role
    if (userRole === 'vendor') {
      query.vendorId = userId;
      if (supplierId) query.supplierId = supplierId;
    } else if (userRole === 'supplier') {
      query.supplierId = userId;
      if (vendorId) query.vendorId = vendorId;
    }

    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('vendorId', 'name email')
      .populate('supplierId', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders/:orderId
// @desc    Get a specific order
// @access  Private
router.get('/:orderId', auth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    let query = { _id: orderId };

    // Ensure user can only access their own orders
    if (userRole === 'vendor') {
      query.vendorId = userId;
    } else if (userRole === 'supplier') {
      query.supplierId = userId;
    }

    const order = await Order.findOne(query)
      .populate('vendorId', 'name email phone')
      .populate('supplierId', 'name email phone');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/orders
// @desc    Create a new order (vendors only)
// @access  Private
router.post('/', auth, requireRole(['vendor']), [
  body('supplierId').isMongoId().withMessage('Valid supplier ID is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.productId').isMongoId().withMessage('Valid product ID is required'),
  body('items.*.name').trim().notEmpty().withMessage('Product name is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('items.*.price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('shippingAddress').optional().isObject(),
  body('notes').optional().isString().isLength({ max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      supplierId,
      items,
      shippingAddress,
      notes,
      expectedDeliveryDate
    } = req.body;

    const vendorId = req.user._id;

    // Create new order
    const order = new Order({
      vendorId,
      supplierId,
      items,
      shippingAddress,
      notes,
      expectedDeliveryDate: expectedDeliveryDate ? new Date(expectedDeliveryDate) : null
    });

    await order.save();

    // Populate vendor and supplier info
    await order.populate('vendorId', 'name email');
    await order.populate('supplierId', 'name email');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/orders/:orderId/status
// @desc    Update order status (suppliers can update status, vendors can cancel)
// @access  Private
router.put('/:orderId/status', auth, [
  body('status').isIn(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { orderId } = req.params;
    const { status } = req.body;
    const userId = req.user._id;
    const userRole = req.user.role;

    let query = { _id: orderId };

    // Ensure user can only update their own orders
    if (userRole === 'vendor') {
      query.vendorId = userId;
      // Vendors can only cancel orders
      if (status !== 'cancelled') {
        return res.status(403).json({ message: 'Vendors can only cancel orders' });
      }
    } else if (userRole === 'supplier') {
      query.supplierId = userId;
      // Suppliers cannot cancel orders
      if (status === 'cancelled') {
        return res.status(403).json({ message: 'Suppliers cannot cancel orders' });
      }
    }

    const order = await Order.findOne(query);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update status
    order.status = status;

    // Update delivery date if status is delivered
    if (status === 'delivered') {
      order.actualDeliveryDate = new Date();
    }

    await order.save();

    // Populate vendor and supplier info
    await order.populate('vendorId', 'name email');
    await order.populate('supplierId', 'name email');

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 
const User = require('../models/User');
const Property = require('../models/Property');
const Booking = require('../models/Booking');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all properties
// @route   GET /api/admin/properties
// @access  Private/Admin
const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find({}).populate('ownerId', 'name email');
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings
// @route   GET /api/admin/bookings
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('propertyId', 'title location')
      .populate('tenantId', 'name email');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await User.findByIdAndDelete(req.params.id);
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete property
// @route   DELETE /api/admin/properties/:id
// @access  Private/Admin
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (property) {
      await Property.findByIdAndDelete(req.params.id);
      res.json({ message: 'Property removed' });
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all pending owners
// @route   GET /api/admin/owners/pending
// @access  Private/Admin
const getPendingOwners = async (req, res) => {
  try {
    const owners = await User.find({ userType: 'Owner', isApprovedOwner: false }).select('-password');
    res.json(owners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve or reject owner
// @route   PUT /api/admin/owners/:id/status
// @access  Private/Admin
const updateOwnerStatus = async (req, res) => {
  try {
    const { isApprovedOwner } = req.body;
    const user = await User.findById(req.params.id);

    if (user && user.userType === 'Owner') {
      user.isApprovedOwner = isApprovedOwner;
      await user.save();
      res.json({ message: `Owner approval status updated successfully`, user });
    } else {
      res.status(404).json({ message: 'Owner not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllUsers, getAllProperties, getAllBookings, deleteUser, deleteProperty, getPendingOwners, updateOwnerStatus };

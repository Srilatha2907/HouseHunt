const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getAllProperties,
  getAllBookings,
  deleteUser,
  deleteProperty,
  getPendingOwners,
  updateOwnerStatus,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All routes here are protected and require 'admin' role
router.use(protect);
router.use(authorize('admin'));

router.route('/users').get(getAllUsers);
router.route('/users/:id').delete(deleteUser);

router.route('/properties').get(getAllProperties);
router.route('/properties/:id').delete(deleteProperty);

router.route('/bookings').get(getAllBookings);

router.route('/owners/pending').get(getPendingOwners);
router.route('/owners/:id/status').put(updateOwnerStatus);

module.exports = router;

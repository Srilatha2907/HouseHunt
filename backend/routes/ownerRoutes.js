const express = require('express');
const router = express.Router();
const {
  addProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
  getPropertyBookings,
  updateBookingStatus,
} = require('../controllers/ownerController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All routes here are protected and require 'owner' role
router.use(protect);
router.use(authorize('owner'));

router.route('/properties')
  .post(addProperty)
  .get(getMyProperties);

router.route('/properties/:id')
  .put(updateProperty)
  .delete(deleteProperty);

router.route('/properties/:id/bookings')
  .get(getPropertyBookings);

router.route('/bookings/:id/status')
  .put(updateBookingStatus);

module.exports = router;

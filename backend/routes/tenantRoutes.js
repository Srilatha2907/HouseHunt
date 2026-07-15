const express = require('express');
const router = express.Router();
const {
  getAllProperties,
  getPropertyDetails,
  bookProperty,
  getMyBookings,
} = require('../controllers/tenantController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All routes here are protected and require 'tenant' role
router.use(protect);
router.use(authorize('tenant'));

router.route('/properties').get(getAllProperties);
router.route('/properties/:id').get(getPropertyDetails);

router.route('/bookings')
  .post(bookProperty)
  .get(getMyBookings);

module.exports = router;

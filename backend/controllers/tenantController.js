const Property = require('../models/Property');
const Booking = require('../models/Booking');

// @desc    View all properties
// @route   GET /api/tenant/properties
// @access  Private/Tenant
const getAllProperties = async (req, res) => {
  try {
    const { location, minRent, maxRent, propertyType, amenities } = req.query;

    let query = { available: true };

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    
    if (minRent || maxRent) {
      query.rent = {};
      if (minRent) query.rent.$gte = Number(minRent);
      if (maxRent) query.rent.$lte = Number(maxRent);
    }

    if (propertyType && propertyType !== 'All') {
      query.propertyType = propertyType;
    }

    if (amenities) {
      // amenities can be a comma separated string
      const amenitiesArray = amenities.split(',').map(a => a.trim());
      if (amenitiesArray.length > 0) {
        query.amenities = { $all: amenitiesArray };
      }
    }

    const properties = await Property.find(query).populate('ownerId', 'name email');
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    View property details
// @route   GET /api/tenant/properties/:id
// @access  Private/Tenant
const getPropertyDetails = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('ownerId', 'name email phone');
    if (property) {
      res.json(property);
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Book a property
// @route   POST /api/tenant/bookings
// @access  Private/Tenant
const bookProperty = async (req, res) => {
  try {
    const { propertyId } = req.body;

    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (!property.available) {
      return res.status(400).json({ message: 'Property is not available for booking' });
    }

    const booking = new Booking({
      propertyId,
      tenantId: req.user._id,
      status: 'pending',
    });

    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    View my bookings
// @route   GET /api/tenant/bookings
// @access  Private/Tenant
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ tenantId: req.user._id }).populate('propertyId', 'title location rent');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllProperties, getPropertyDetails, bookProperty, getMyBookings };

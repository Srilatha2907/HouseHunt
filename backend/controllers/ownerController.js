const Property = require('../models/Property');
const Booking = require('../models/Booking');

// @desc    Add a property
// @route   POST /api/owner/properties
// @access  Private/Owner
const addProperty = async (req, res) => {
  try {
    const { title, description, location, rent, images, bedrooms, bathrooms, available, propertyType, amenities } = req.body;

    const property = new Property({
      title,
      description,
      location,
      rent,
      images,
      ownerId: req.user._id,
      bedrooms,
      bathrooms,
      available,
      propertyType: propertyType || 'Apartment',
      amenities: amenities || [],
    });

    const createdProperty = await property.save();
    res.status(201).json(createdProperty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a property
// @route   PUT /api/owner/properties/:id
// @access  Private/Owner
const updateProperty = async (req, res) => {
  try {
    const { title, description, location, rent, images, bedrooms, bathrooms, available } = req.body;

    const property = await Property.findById(req.params.id);

    if (property) {
      if (property.ownerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this property' });
      }

      property.title = title || property.title;
      property.description = description || property.description;
      property.location = location || property.location;
      property.rent = rent || property.rent;
      property.images = images || property.images;
      property.bedrooms = bedrooms || property.bedrooms;
      property.bathrooms = bathrooms || property.bathrooms;
      property.available = available !== undefined ? available : property.available;

      const updatedProperty = await property.save();
      res.json(updatedProperty);
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a property
// @route   DELETE /api/owner/properties/:id
// @access  Private/Owner
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (property) {
      if (property.ownerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to delete this property' });
      }

      await Property.findByIdAndDelete(req.params.id);
      res.json({ message: 'Property removed' });
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    View my properties
// @route   GET /api/owner/properties
// @access  Private/Owner
const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ ownerId: req.user._id });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    View bookings for my properties
// @route   GET /api/owner/properties/:id/bookings
// @access  Private/Owner
const getPropertyBookings = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (property) {
      if (property.ownerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to view bookings for this property' });
      }

      const bookings = await Booking.find({ propertyId: req.params.id }).populate('tenantId', 'name email phone');
      res.json(bookings);
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/owner/bookings/:id/status
// @access  Private/Owner
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const property = await Property.findById(booking.propertyId);
    if (!property || property.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    booking.status = status;
    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addProperty, updateProperty, deleteProperty, getMyProperties, getPropertyBookings, updateBookingStatus };

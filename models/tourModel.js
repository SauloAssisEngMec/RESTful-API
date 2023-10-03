const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "tour must have a name"],
    unique: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, "Must have duration"],
  },
  maxGroupSize: {
    type: Number,
    required: [true, "Must have a group  size"],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    requered: [true, "tour must have a name"],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    requered: [true, "tour must have a summary"],
  },
  description: {
    type: String,
    trim: true,
  },
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;

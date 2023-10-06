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
    requered: {
      values: [true, "tour must have a prce"],
    },
  },

  priceDiscount: {
    type: Number,
    validate: {
      validator: function (value) {
        return value < this.price;
      },
      message: "Discount Price ({VALUE}) should be below regular price",
    },
  },
  summary: {
    type: String,
    trim: true,
    requered: [true, "tour must have a summary"],
  },
  description: {
    type: String,
    trim: true,
  },
  difficulty: {
    type: String,
    // required: [true, "Tour must have difficulty!!"],
    enum: {
      values: ["easy", "medium", "difficult"],
      message: "possible choice: easy, medium, hard!!",
    },
  },
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;

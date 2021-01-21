const mongoose = require("mongoose");

const DataPointSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("DATAPOINT", DataPointSchema);

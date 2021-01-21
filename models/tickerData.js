const mongoose = require("mongoose");
const Ticker = require("./ticker");

const TickerDataSchema = new mongoose.Schema({
  ticker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticker",
    required: true,
  },
  data: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DATAPOINT",
      required: false,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("TICKERDATA", TickerDataSchema);

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Ticker = require("../../models/ticker");

//@desc     Add stock ticker to db, update if not in it
//@route    GET /api/stocks
router.post("/addStockDB", async (req, res) => {
  const newTicker = {
    symbol: req.body.symbol,
    name: req.body.name,
    isTop100: req.body.top100,
  };
  if (!newTicker.symbol || !newTicker.name || !newTicker.isTop100) {
    return res.status(400).json({ msg: "Missing parameter in request!" });
  }
  try {
    let ticker = await Ticker.findOne({ symbol: req.body.symbol });
    if (ticker) {
      res.json({ msg: "Ticker is already in the DB!" });
    } else {
      let ticker = await Ticker.create(newTicker);
      ticker.save();
      res.json({ msg: "Ticker created successfully" });
    }
  } catch (err) {
    console.error(err);
    res.json({ error: err });
  }
});

module.exports = router;

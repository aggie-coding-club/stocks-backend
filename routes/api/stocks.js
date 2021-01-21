const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Ticker = require("../../models/ticker");
const TickerData = require("../../models/tickerData");

//@desc     Add stock ticker to db, update if not in it
//@route    POST /api/stocks/addStockDB
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
      res.json({
        msg: `Ticker with symbol ${req.body.symbol} is already in the DB!`,
      });
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

//@desc     Set the tickerData object in the DB fo rthe correlation ticker
//@route    POST /api/stocks/setStockData
router.post("/setStockData", async (req, res) => {
  let symbol = req.body.symbol;

  if (!symbol) {
    return res
      .status(400)
      .json({ msg: "Missing symbol parameter in request!" });
  }
  try {
    let ticker = await Ticker.findOne({ symbol: req.body.symbol });
    if (ticker) {
      const tickerData = {
        ticker: ticker,
        data: req.body.data,
      };
      var currData = await TickerData.findOne({ ticker: ticker });
      if (currData) {
        //ticker data already exists, we should just update the data at this point
        TickerData.updateOne(
          { ticker: ticker },
          { data: req.body.data },

          // {
          //   $push: { tvs: res },
          // },
          { multi: true },
          function (err, docs) {
            if (err) {
              console.log(err);
            } else {
              //   console.log("Original Doc : ", docs);
            }
          }
        );
        res.json({
          msg: `Data with symbol ${req.body.symbol} exists, data updated!`,
        });
      } else {
        let data = await TickerData.create(tickerData);
        data.save();
        res.json({
          msg: `Data with symbol ${req.body.symbol} created!`,
        });
      }
    }
  } catch (err) {
    console.error(err);
    res.json({ error: err });
  }
});

module.exports = router;

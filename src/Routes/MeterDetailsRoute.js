const express = require("express");
const { getMeterDataById } = require("../DataAccess/MeterDetails");

const meterDetailsRoute = express.Router();

meterDetailsRoute.get("/meterDetails/:meterId", async (req, res) => {
  const data = await getMeterDataById(req.params.meterId);
  res.send(data);
});

module.exports = { meterDetailsRoute };

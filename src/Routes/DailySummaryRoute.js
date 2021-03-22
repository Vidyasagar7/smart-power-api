const express = require("express");
const {
  getDailySummaryByMeterId,
  getDailySummaries,
} = require("../DataAccess/DailySummary");
const dailySummaryRoute = express.Router();

dailySummaryRoute.get(`/meter/:meterId/dailySummary/:dateEpochMilli`, async (req, res) => {
  const dailySummary = await getDailySummaryByMeterId(
    req.params.meterId,
    req.params.dateEpochMilli
  );
  res.send(dailySummary);
});

dailySummaryRoute.get("/meter/:meterId/summaries", async (req, res) => {

  if (!req.query.fromDate || ! req.query.toDate) {
    return res.status(400).send({"error": "fromDate and toDate must be provided"})
  }
  const monthlyGrouping = await getDailySummaries(
    req.params.meterId,
    req.query.fromDate,
    req.query.toDate
  );
  res.send(monthlyGrouping);
});

module.exports = { dailySummaryRoute };

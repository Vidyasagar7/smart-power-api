const express = require("express");
const { getMonthlySummaryByMeterId } = require("../DataAccess/MonthlySummary");

const monthlySummaryRoute = express.Router();

monthlySummaryRoute.get(
  "/meter/:meterId/monthlysummary/:year",
  async (req, res) => {
    const monthlySummary = await getMonthlySummaryByMeterId(
      req.params.meterId,
      req.params.year
    );
    res.send(monthlySummary);
  }
);

module.exports = { monthlySummaryRoute };

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { response } = require("express");
const { getMeterDataById } = require("./meterData");
const {
  getDailySummaryByMeterId,
  monthlyAggregation,
} = require("./dailysummary");
const { getMonthlySummaryByMeterId } = require("./monthlysummary");
const {
  getAccountByMeterId,
  linkMeterId,
  deleteUserById,
} = require("./linkaccount");

const app = express();

app.use(helmet());
app.use(bodyParser.json());

app.use(cors());

app.use(morgan("combined"));

app.get("/meterDetails/:meterId", async (req, res) => {
  const data = await getMeterDataById(req.params.meterId);
  res.send(data);
});

app.get("/meter/:meterId/monthlysummary/:year", async (req, res) => {
  const monthlySummary = await getMonthlySummaryByMeterId(
    req.params.meterId,
    req.params.year
  );
  res.send(monthlySummary);
});

app.get(`/meter/:meterId/dailysummary/:dateEpochMilli`, async (req, res) => {
  const dailySummary = await getDailySummaryByMeterId(
    req.params.meterId,
    req.params.dateEpochMilli
  );
  res.send(dailySummary);
});

app.post("/linkaccount", async (req, res) => {
  const userAccount = await getAccountByMeterId(req.body.meterId);
  console.log(`Account Details::${userAccount}`);
  if (userAccount && userAccount.length > 0) {
    res.status(400).send(`${req.body.meterId} is already linked`);
  } else {
    const linkAccount = await linkMeterId(req.body.userId, req.body.meterId);
    //console.log("Not exist");
    res.sendStatus(200);
  }
});
app.get("/meter/:meterId", async (req, res) => {
  const getMeterId = await getAccountByMeterId(req.params.meterId);
  res.send(getMeterId);
});

app.delete("/user/:userId", async (req, res) => {
  const deleteUser = await deleteUserById(req.params.userId);
  res.sendStatus(200);
});

app.get("/readings/:meterId", async (req, res) => {
  const monthlyGrouping = await monthlyAggregation(
    req.params.meterId,
    req.query.fromDate,
    req.query.toDate
  );
  res.send(monthlyGrouping);
});

app.listen(3001, () => {
  console.log("listening on port 3001");
});

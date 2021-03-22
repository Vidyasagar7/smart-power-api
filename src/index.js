const dotEnv = require("dotenv");
// Load the environment variables
dotEnv.config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { meterDetailsRoute } = require("./Routes/MeterDetailsRoute");
const { dailySummaryRoute } = require("./Routes/DailySummaryRoute");
const { monthlySummaryRoute } = require("./Routes/MonthlySummaryRoute");
const { userAccountRoute } = require("./Routes/UserAccountRoute");
const { authenticationController } = require("./Auth/AuthenticationController");



const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("combined"));

app.use("/api/*", authenticationController)
app.use("/api", meterDetailsRoute);
app.use("/api", dailySummaryRoute);
app.use("/api", monthlySummaryRoute);
app.use("/api", userAccountRoute);

app.listen(3001, () => {
  console.log("listening on port 3001");
});

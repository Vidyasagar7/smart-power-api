const express = require("express");
const { getMeterDataById } = require("../DataAccess/MeterDetails");
const {
  getUserAccountByMeterId,
  deleteUserAccountByUserId,
  linkUserAccount,
  getUserAccountByUserId,
} = require("../DataAccess/UserAccount");
const userAccountRoute = express.Router();

userAccountRoute.post("/user/linkaccount", async (req, res) => {
  
  // Check input params
  if (!req.body.meterId || !req.body.userId) {
    res.status(400).send({"error": "meterId and userId should be provided"})
  }
  const meterData = await getMeterDataById(req.body.meterId);
  console.log(`meter Data::${meterData}`);
  if(!meterData){
    res.status(400).send({"error": `Provided meterId:${req.body.meterId} is Invaild`})
  }

  const userAccount = await getUserAccountByMeterId(req.body.meterId);
  console.log(`Account Details::${userAccount}`);
  if (userAccount && userAccount.length > 0) {
    res.status(400).send(`${req.body.meterId} is already linked`);
  } else {
    const linkAccount = await linkUserAccount(
      req.body.userId,
      req.body.meterId
    );
    res.sendStatus(200);
  }
});

userAccountRoute.get("/user/:userId", async (req, res) => {

const userDetails = await getUserAccountByUserId(req.params.userId);
res.send(userDetails);
});

userAccountRoute.get("/user/meter/:meterId", async (req, res) => {
  const getMeterId = await getUserAccountByMeterId(req.params.meterId);
  res.send(getMeterId);
});

userAccountRoute.delete("/user/:userId", async (req, res) => {
  const deleteUser = await deleteUserAccountByUserId(req.params.userId);
  res.sendStatus(200);
});

module.exports = { userAccountRoute };

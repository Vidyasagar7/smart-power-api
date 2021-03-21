const express = require("express");
const jwt = require("jsonwebtoken");
var jwksClient = require("jwks-rsa");

const NodeCache = require("node-cache");
const jwksCache = new NodeCache();

const JWS_KEY = "deafultJwsKey";
const client = jwksClient({
  jwksUri: "https://dev-upup1sol.eu.auth0.com/.well-known/jwks.json",
});

const getKey = (header, callback) => {
    
  if (jwksCache.has("deafultJwsKey")) {
    return callback(null, jwksCache.get(JWS_KEY));
  }

  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      console.error("Unable to fetch JWKS from auth0");
      return callback(null, null);
    }
    const signingKey = key.publicKey || key.rsaPublicKey;
    jwksCache.set(JWS_KEY, signingKey);
    callback(null, signingKey);
  });
};

const isValidToken = async (token) => {
  return new Promise((resolve, reject) =>
    jwt.verify(token, getKey, (err, decoded) =>
      err ? reject(null) : resolve(decoded)
    )
  );
};

const authenticationController = express.Router();
const authHeader = "Authorization";

authenticationController.all("/", (req, res, next) => {
  if (!req.header(authHeader)) {
    return res
      .status(403)
      .send(`{ "error": "You are not authorized to access this api"}`);
  }

  const token = req.header(authHeader).split(" ")[1];
  isValidToken(token)
    .then(() => next())
    .catch(() => res.status(401).send(`{"error":"Token is invalid"}`));
});

module.exports = { authenticationController };

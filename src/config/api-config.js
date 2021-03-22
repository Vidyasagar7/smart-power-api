const ApiConfig = {
  jwksUrl: process.env.jwksUrl || "",
  dynamoDbEndpoint: process.env.dynamoDbEndpoint || "",
};

module.exports = { ApiConfig };

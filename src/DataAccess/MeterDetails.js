const { getItem } = require("../Dynamodb/DynamoDbClient");

const getMeterDataById = async (meterId) => {
  return getItem(meterId, "METER");
};

module.exports = { getMeterDataById };

const { getItem } = require("../Dynamodb/DynamoDbClient");

const getMeterDataById = async (meterId) => {
  const projectionExpression = "areacode,taluk,pincode,meterId,houseNumber,geoLoc,street,#meterState";
  const expressionAttributeNames = {
    "#meterState": "state"
  }

  return getItem(meterId, "METER", projectionExpression, expressionAttributeNames);
};

module.exports = { getMeterDataById };
